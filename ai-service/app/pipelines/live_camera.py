"""Live camera pipeline — the primary real-time processing path.

Camera → OpenCV capture (thread + bounded queue) → frame preprocessing →
person YOLO + ByteTrack (every frame) → product/rack/shelf models (interval) →
analytics engines → alert engine → annotated MJPEG stream + live metrics.

Failure handling: camera loss sets CAMERA_OFFLINE and retries with backoff;
model failures never crash the pipeline (that frame simply has fewer overlays).
"""
from __future__ import annotations

import threading
import time
from collections import deque
from typing import Any

import cv2
import numpy as np

from app.alerts.engine import AlertEngine
from app.analytics.queue import QueueAnalytics
from app.analytics.shopper import ShopperAnalytics
from app.core.config import settings
from app.core.logging_config import get_logger
from app.core.store_config import get_store_config
from app.inventory.engine import InventoryEngine
from app.models.person_detector import PersonDetector
from app.models.product_detector import ProductDetector, RackDetector, ShelfDetector
from app.models.product_recognizer import ProductRecognizer
from app.models.shelf_segmentation import ShelfSegmenter
from app.pipelines.annotator import (draw_detections, draw_geometry, draw_hud,
                                     draw_tracks)
from app.privacy.filters import blur_person_head
from app.queue.model import get_queue_model, label_from_thresholds
from app.tracking.tracker import ByteTracker

logger = get_logger(__name__)


class LiveCameraPipeline:
    """Single-camera real-time pipeline. One instance per active camera."""

    def __init__(self, camera_id: str = "cam_0", source: int | str | None = None) -> None:
        self.camera_id = camera_id
        self.source = source if source is not None else settings.camera_source_value
        self.status = "STOPPED"
        self.error: str | None = None
        self.store_config = get_store_config()

        # models
        self.person_detector = PersonDetector()
        self.tracker = ByteTracker(self.person_detector)
        self.product_detector = ProductDetector()
        self.rack_detector = RackDetector()
        self.shelf_detector = ShelfDetector()
        self.recognizer = ProductRecognizer()
        self.segmenter = ShelfSegmenter()

        # analytics
        self.shopper = ShopperAnalytics(camera_id)
        self.queue = QueueAnalytics(camera_id)
        self.inventory = InventoryEngine(camera_id)
        self.alerts = AlertEngine()
        self.queue_model = get_queue_model()

        # runtime state — MULTI-THREADED PIPELINE:
        #   capture thread  → newest frame into _latest_raw (drop-old, always fresh)
        #   inference thread → YOLO tracking + analytics at model pace (~2-4 Hz CPU)
        #   product thread   → product/shelf/rack scans on interval (heavy, isolated)
        #   stream thread    → annotate + JPEG encode at display pace (~12-20 FPS)
        # Decoupling means the MJPEG stream stays smooth even when inference is slow.
        self._cap: cv2.VideoCapture | None = None
        self._stop = threading.Event()
        self._threads: list[threading.Thread] = []
        self._raw_lock = threading.Lock()
        self._latest_raw: np.ndarray | None = None
        self._raw_seq = 0
        self._res_lock = threading.Lock()
        self._latest_result: dict = {"tracks": [], "person_dets": [], "raw_seq": -1}
        self._prod_lock = threading.Lock()
        self._latest_products: dict = {"products": [], "shelves": [], "racks": []}
        self._frame_lock = threading.Lock()
        self._jpeg: bytes | None = None
        self._frame_seq = 0  # published stream frames
        self._last_frames: deque = deque(maxlen=60)  # stream FPS timestamps
        self._last_infer: deque = deque(maxlen=60)  # tracker FPS timestamps
        self.latency_ms = 0.0
        self.preprocess_ms = 0.0
        self.postprocess_ms = 0.0
        self._last_queue_observation_ts = 0.0
        self._last_prediction_ts = 0.0
        self._last_queue_state: dict[str, str] = {}
        self._reconnect_delay = settings.camera_reconnect_delay_s

    # ----------------------------------------------------------- lifecycle
    def start(self) -> tuple[bool, str]:
        if any(t.is_alive() for t in self._threads):
            return True, "already running"
        self._stop.clear()
        if not self._open_capture():
            self.status = "CAMERA_OFFLINE"
            self.error = f"cannot open source: {self.source}"
            return False, self.error
        specs = [
            ("capture", self._capture_loop),
            ("infer", self._inference_loop),
            ("product", self._product_loop),
            ("stream", self._stream_loop),
        ]
        self._threads = [
            threading.Thread(target=fn, name=f"live-{self.camera_id}-{name}", daemon=True)
            for name, fn in specs
        ]
        for t in self._threads:
            t.start()
        self.status = "RUNNING"
        return True, "started"

    def stop(self) -> None:
        self._stop.set()
        for t in self._threads:
            if t.is_alive():
                t.join(timeout=5)
        self._threads = []
        self._release()
        self.status = "STOPPED"

    def _open_capture(self) -> bool:
        try:
            cap = None
            if isinstance(self.source, str) and self.source.lower().startswith("http"):
                # Phone IP-camera apps usually expose an MJPEG endpoint; plain
                # VideoCapture can miss it — probe common paths first.
                cap = self._open_http_stream(self.source)
            if cap is None:
                cap = cv2.VideoCapture(self.source)
            if isinstance(self.source, int):
                cap.set(cv2.CAP_PROP_FRAME_WIDTH, settings.camera_width)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, settings.camera_height)
                cap.set(cv2.CAP_PROP_FPS, settings.camera_fps)
                # minimize driver-side buffering → fresher frames, less perceived lag
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            if not cap.isOpened():
                cap.release()
                return False
            self._cap = cap
            return True
        except Exception as exc:
            self.error = str(exc)[:200]
            return False

    def _open_http_stream(self, url: str):
        """Open a phone IP-camera MJPEG stream, probing common endpoint paths.

        IP Webcam (Android) serves /video; DroidCam uses /video too; many apps
        also expose /mjpegfeed or the bare root. Returns an opened capture or None.
        """
        base = url.rstrip("/")
        candidates = [base]
        for suffix in ("/video", "/mjpegfeed", "/mjpegfeed?640x480", "/stream", "/live"):
            if not base.lower().endswith(suffix):
                candidates.append(base + suffix)
        last_err = "no probe succeeded"
        for cand in candidates:
            try:
                import urllib.request
                req = urllib.request.Request(cand, headers={"User-Agent": "RetailEdge/1.0"})
                with urllib.request.urlopen(req, timeout=2.0) as resp:
                    ctype = resp.headers.get("Content-Type", "")
                    if "multipart" in ctype or "jpeg" in ctype or "octet-stream" in ctype:
                        cap = cv2.VideoCapture(cand)
                        if cap.isOpened():
                            logger.info("opened HTTP stream: %s (%s)", cand, ctype)
                            return cap
                        cap.release()
                    else:
                        last_err = f"{cand} → {ctype or 'unknown type'}"
            except Exception as exc:
                last_err = f"{cand} → {exc}"
        logger.warning("HTTP stream probe failed for %s: %s", url, last_err)
        self.error = f"stream probe failed: {last_err}"[:200]
        return None

    @staticmethod
    def _is_file_source(source: Any) -> bool:
        """Video files must be paced; devices/RTSP stream at camera rate."""
        return isinstance(source, str) and "://" not in source

    def _release(self) -> None:
        if self._cap is not None:
            try:
                self._cap.release()
            except Exception:
                pass
            self._cap = None

    # ----------------------------------------------------------- main loops
    def _capture_loop(self) -> None:
        """Reads frames at camera rate into _latest_raw (drop-old semantics)."""
        consecutive_failures = 0
        while not self._stop.is_set():
            if self._cap is None or not self._cap.isOpened():
                self.status = "CAMERA_OFFLINE"
                self.error = "camera disconnected"
                logger.warning("camera %s offline; retrying in %.1fs",
                               self.camera_id, self._reconnect_delay)
                self.alerts.fire("CAMERA_OFFLINE", severity="CRITICAL",
                                 camera_id=self.camera_id,
                                 detail=f"source {self.source} disconnected")
                time.sleep(self._reconnect_delay)
                if not self._stop.is_set() and not self._open_capture():
                    continue
                if self._cap is not None:
                    self.status = "RUNNING"
                    self.error = None
                    consecutive_failures = 0

            t0 = time.perf_counter()
            ok, frame = self._cap.read() if self._cap else (False, None)
            if not ok or frame is None:
                consecutive_failures += 1
                if self._is_file_source(self.source):  # video file ended
                    logger.info("video source ended for %s", self.camera_id)
                    self.status = "STOPPED"
                    self.error = "video ended"
                    self._release()
                    return
                if consecutive_failures >= 30:
                    self._release()
                    continue
                time.sleep(0.05)
                continue
            consecutive_failures = 0

            tp = time.perf_counter()
            frame = self._preprocess(frame)
            self.preprocess_ms = (time.perf_counter() - tp) * 1000
            with self._raw_lock:
                self._latest_raw = frame
                self._raw_seq += 1
            if self._is_file_source(self.source):  # pace file playback
                delay = 1.0 / max(settings.camera_fps, 1.0) - (time.perf_counter() - t0)
                if delay > 0:
                    time.sleep(delay)

    def _inference_loop(self) -> None:
        """YOLO person tracking + analytics at model pace; results shared via lock."""
        while not self._stop.is_set():
            with self._raw_lock:
                frame = self._latest_raw
                seq = self._raw_seq
            if frame is None:
                time.sleep(0.05)
                continue
            t0 = time.perf_counter()
            try:
                tracks, person_dets = self.tracker.update(frame)
            except Exception as exc:  # never crash the loop
                logger.error("tracking error on %s: %s", self.camera_id, exc)
                tracks, person_dets = [], []

            events = self.shopper.update(tracks)
            for ev in events:
                self._persist_event(ev)
            self.queue.update(tracks)
            self._maybe_queue_observation()
            self._maybe_queue_prediction()

            with self._res_lock:
                self._latest_result = {"tracks": tracks, "person_dets": person_dets,
                                       "raw_seq": seq}
            self.latency_ms = (time.perf_counter() - t0) * 1000
            self._last_infer.append(time.time())

    def _product_loop(self) -> None:
        """Heavy product/shelf/rack scans on their own thread (never blocks tracking)."""
        last_product = 0.0
        last_shelf = 0.0
        while not self._stop.is_set():
            now = time.time()
            with self._raw_lock:
                frame = self._latest_raw
            if frame is None:
                time.sleep(0.2)
                continue
            ran = False
            if settings.product_enabled and now - last_product >= settings.product_inference_interval_s:
                last_product = now
                try:
                    dets = self.product_detector.detect(frame)
                    # inventory must observe even 0 detections — that's how an
                    # empty shelf is confirmed; also keeps last_scan fresh
                    self._process_shelf_frame(frame, dets)
                    with self._prod_lock:
                        self._latest_products["products"] = dets
                    ran = True
                except Exception as exc:
                    logger.error("product scan error on %s: %s", self.camera_id, exc)
            if (settings.shelf_enabled and
                    now - last_shelf >= max(settings.product_inference_interval_s * 2, 2.0)):
                last_shelf = now
                try:
                    shelves = self.shelf_detector.detect(frame)
                    racks = self.rack_detector.detect(frame)
                    with self._prod_lock:
                        self._latest_products["shelves"] = shelves
                        self._latest_products["racks"] = racks
                    ran = True
                except Exception as exc:
                    logger.error("shelf scan error on %s: %s", self.camera_id, exc)
            if not ran:
                time.sleep(0.1)  # idle poll between interval fires

    def _stream_loop(self) -> None:
        """Annotate + JPEG encode at display pace using the LATEST shared results."""
        while not self._stop.is_set():
            with self._raw_lock:
                frame = self._latest_raw
                raw_seq = self._raw_seq
            if frame is None:
                time.sleep(0.05)
                continue
            tq = time.perf_counter()
            with self._res_lock:
                res = dict(self._latest_result)
            tracks = res.get("tracks", [])
            person_dets = res.get("person_dets", [])
            with self._prod_lock:
                products = list(self._latest_products["products"])
                shelves = list(self._latest_products["shelves"])
            annotated = self._annotate(frame, tracks, person_dets,
                                       product_dets=products, shelf_dets=shelves)
            if settings.privacy_blur_faces:
                for tr in tracks:
                    annotated = blur_person_head(annotated, tr.bbox)
            ok, buf = cv2.imencode(
                ".jpg", annotated,
                [int(cv2.IMWRITE_JPEG_QUALITY), settings.camera_jpeg_quality])
            if ok:
                with self._frame_lock:
                    self._jpeg = buf.tobytes()
                self._frame_seq += 1
                self._last_frames.append(time.time())
            self.postprocess_ms = (time.perf_counter() - tq) * 1000
            # target ~15 FPS stream; a real-time pacing beat keeps MJPEG smooth
            elapsed = time.perf_counter() - tq
            time.sleep(max(0.0, 1.0 / 15.0 - elapsed))

    def _preprocess(self, frame: np.ndarray) -> np.ndarray:
        target_w, target_h = settings.camera_width, settings.camera_height
        h, w = frame.shape[:2]
        if (w, h) != (target_w, target_h):
            frame = cv2.resize(frame, (target_w, target_h))
        return frame

    # ----------------------------------------------------------- shelf scan
    def _process_shelf_frame(self, frame: np.ndarray,
                             product_dets: list) -> None:
        """Recognition + inventory update on a shelf-scan frame."""
        recognized: dict[int, str] = {}
        if self.recognizer.has_reference_data:
            for i, det in enumerate(product_dets):
                x1, y1, x2, y2 = (int(v) for v in det.bbox)
                crop = frame[max(y1, 0):y2, max(x1, 0):x2]
                if crop.size == 0:
                    continue
                res = self.recognizer.recognize(crop)
                if res.status == "MATCHED" and res.product_id:
                    recognized[i] = res.product_id

        inv_events = self.inventory.observe(product_dets, recognized,
                                            (frame.shape[1], frame.shape[0]))
        for ev in inv_events:
            self.alerts.fire_from_inventory_event(ev)
            self._persist_event({"type": f"INVENTORY_{ev['type']}", **ev})

        if self.store_config.get_planogram():
            for v in self.inventory.planogram_violations(product_dets, recognized):
                self.alerts.fire_from_planogram(v)

    # ------------------------------------------------------------- queue ML
    def _maybe_queue_observation(self) -> None:
        if not settings.queue_enabled:
            return
        if time.time() - self._last_queue_observation_ts < settings.queue_metrics_interval_s:
            return
        self._last_queue_observation_ts = time.time()
        feats = self.queue.observation_features(settings.store_id)
        if feats is None:
            return
        feats["label"] = label_from_thresholds(feats["queue_length"])
        try:
            from app.core.edge_buffer import get_edge_buffer
            from app.database.models import QueueObservation, get_database

            with get_database().session() as s:
                s.add(QueueObservation(
                    store_id=feats["store_id"], camera_id=feats["camera_id"],
                    queue_id=feats["queue_id"], queue_length=feats["queue_length"],
                    arrival_rate=feats["arrival_rate"], service_rate=feats["service_rate"],
                    active_counters=feats["active_counters"],
                    average_wait_s=feats["average_wait"],
                    rolling_queue_5m=feats["rolling_queue_5m"],
                    rolling_queue_10m=feats["rolling_queue_10m"],
                    hour=feats["hour"], day_of_week=feats["day_of_week"],
                    label=feats["label"],
                ))
                s.commit()
        except Exception as exc:
            logger.warning("queue observation persist failed: %s", exc)
            try:
                from app.core.edge_buffer import get_edge_buffer

                get_edge_buffer().put_queue_observation(feats)
            except Exception:
                pass

    def _maybe_queue_prediction(self) -> None:
        if not self.queue_model.is_trained:
            return
        if time.time() - self._last_prediction_ts < settings.queue_prediction_interval_s:
            return
        self._last_prediction_ts = time.time()
        feats = self.queue.observation_features(settings.store_id)
        if feats is None:
            return
        result = self.queue_model.predict(feats)
        state = result.get("prediction")
        if state in ("WARNING", "HIGH"):
            qid = feats["queue_id"]
            if self._last_queue_state.get(qid) != state:
                self.alerts.fire_queue(state, qid, int(feats["queue_length"]))
            self._last_queue_state[qid] = state
        elif state == "NORMAL":
            self._last_queue_state[feats["queue_id"]] = "NORMAL"

    # ------------------------------------------------------------ annotate
    def _annotate(self, frame: np.ndarray, tracks, person_dets,
                  product_dets: list | None = None,
                  shelf_dets: list | None = None) -> np.ndarray:
        if not settings.camera_draw_overlays:
            return frame
        img = frame.copy()
        draw_geometry(img)
        draw_tracks(img, tracks)
        product_dets = self._latest_products["products"] if product_dets is None else product_dets
        shelf_dets = self._latest_products["shelves"] if shelf_dets is None else shelf_dets
        if product_dets:
            draw_detections(img, product_dets, (60, 160, 255), "P")
        if shelf_dets:
            draw_detections(img, shelf_dets, (255, 180, 60), "S")
        with self._prod_lock:
            racks = list(self._latest_products["racks"])
        if racks:
            draw_detections(img, racks, (200, 80, 255), "R")
        fps = self.fps
        hud = [
            f"FPS {fps:.1f} | lat {self.latency_ms:.0f}ms",
            f"persons {len(tracks)}",
            f"entries {self.shopper.entries} exits {self.shopper.exits}",
        ]
        if self.queue.queues:
            qlens = ",".join(f"{q.queue_length()}" for q in self.queue.queues.values())
            hud.append(f"queue [{qlens}]")
        n_prod = len(self._latest_products["products"])
        if n_prod:
            hud.append(f"products {n_prod}")
        if self.status != "RUNNING":
            hud.append(f"STATUS {self.status}")
        draw_hud(img, hud)
        return img

    # ------------------------------------------------------------ getters
    @property
    def fps(self) -> float:
        """Stream FPS (published JPEG frames per second)."""
        now = time.time()
        recent = [t for t in self._last_frames if now - t <= 2.0]
        return len(recent) / 2.0 if len(recent) >= 2 else 0.0

    @property
    def inference_fps(self) -> float:
        """Tracker Hz — the model's real processing rate (independent of stream)."""
        now = time.time()
        recent = [t for t in self._last_infer if now - t <= 5.0]
        return round(len(recent) / 5.0, 2) if recent else 0.0

    @property
    def frames_processed(self) -> int:
        return self._frame_seq

    def mjpeg_frame(self) -> bytes | None:
        with self._frame_lock:
            return self._jpeg

    def latest_frame(self) -> np.ndarray | None:
        """Latest raw preprocessed frame (NO overlays) — for dataset capture."""
        with self._raw_lock:
            return self._latest_raw

    def status_dict(self) -> dict:
        return {
            "status": self.status,
            "source": str(self.source),
            "fps": round(self.fps, 1),
            "inference_fps": self.inference_fps,
            "inference_latency_ms": round(self.latency_ms, 1),
            "preprocess_latency_ms": round(self.preprocess_ms, 1),
            "postprocess_latency_ms": round(self.postprocess_ms, 1),
            "frame_count": self._frame_seq,
            "error": self.error,
        }

    def live_metrics(self) -> dict:
        """Everything the dashboard needs, all real values."""
        qm = self.queue.metrics()
        return {
            "camera": self.status_dict(),
            "shopper": self.shopper.metrics(),
            "zones": self.shopper.zone_metrics(),
            "queues": qm,
            "inventory": {
                "products": [s.to_dict() for s in self.inventory.product_status()],
                "shelves": self.inventory.shelf_gap_summary(),
            },
            "detections": {
                "products": len(self._latest_products["products"]),
                "shelves": len(self._latest_products["shelves"]),
                "racks": len(self._latest_products["racks"]),
            },
            "models_ready": self._model_states(),
        }

    def _model_states(self) -> dict:
        from app.models.model_manager import get_model_manager

        return {m["name"]: m["status"] for m in get_model_manager().status()}

    def _persist_event(self, ev: dict) -> None:
        try:
            from app.database.models import InventoryEvent, ShopperEvent, get_database

            with get_database().session() as s:
                if ev.get("type") in ("ENTRY", "EXIT", "ZONE_ENTER", "ZONE_EXIT"):
                    s.add(ShopperEvent(
                        store_id=settings.store_id, camera_id=self.camera_id,
                        track_id=ev.get("track_id", -1), event_type=ev["type"],
                        zone_id=ev.get("zone_id"),
                    ))
                elif str(ev.get("type", "")).startswith("INVENTORY_"):
                    s.add(InventoryEvent(
                        store_id=settings.store_id, camera_id=self.camera_id,
                        rack_id=ev.get("rack_id"), shelf_id=ev.get("shelf_id"),
                        product_id=ev.get("product_id"),
                        event_type=ev["type"].replace("INVENTORY_", ""),
                        expected_facing=ev.get("expected_facing", 0),
                        confidence=ev.get("confidence"),
                    ))
                s.commit()
        except Exception as exc:
            logger.warning("event persist failed: %s", exc)
            try:
                from app.core.edge_buffer import get_edge_buffer

                get_edge_buffer().put_event(ev)
            except Exception:
                pass


class PipelineManager:
    """Holds one live pipeline PER CAMERA (multi-camera store) + video jobs."""

    DEFAULT_CAMERA = "cam_0"

    def __init__(self) -> None:
        self.pipelines: dict[str, LiveCameraPipeline] = {}
        self._lock = threading.Lock()
        self.video_jobs: dict[str, dict] = {}

    @property
    def live(self) -> LiveCameraPipeline | None:
        """Backward-compat primary pipeline (DEFAULT_CAMERA, else first)."""
        if not self.pipelines:
            return None
        return self.pipelines.get(self.DEFAULT_CAMERA) or next(iter(self.pipelines.values()))

    def start_live(self, source: int | str | None = None,
                   camera_id: str | None = None) -> tuple[bool, str]:
        with self._lock:
            cid = camera_id or self.DEFAULT_CAMERA
            pipe = self.pipelines.get(cid)
            if pipe is None:
                pipe = LiveCameraPipeline(camera_id=cid, source=source)
                self.pipelines[cid] = pipe
            if source is not None and pipe.status == "STOPPED":
                pipe.source = source
            return pipe.start()

    def start_registered(self) -> list[dict]:
        """Start every enabled camera registered in store config (multi-camera boot)."""
        out = []
        for c in get_store_config().get_cameras():
            if not c.get("enabled", True):
                continue
            src: int | str = c["source"]
            if isinstance(src, str) and src.isdigit():
                src = int(src)
            ok, msg = self.start_live(source=src, camera_id=c["camera_id"])
            out.append({"camera_id": c["camera_id"], "ok": ok, "detail": msg})
        return out

    def stop_live(self, camera_id: str | None = None) -> None:
        """Stop one camera, or ALL when camera_id is None (shutdown semantics)."""
        with self._lock:
            if camera_id is None:
                for pipe in self.pipelines.values():
                    pipe.stop()
                return
            pipe = self.pipelines.get(camera_id)
            if pipe is not None:
                pipe.stop()

    def live_status(self, camera_id: str | None = None) -> dict:
        pipe = self.pipelines.get(camera_id) if camera_id else self.live
        if pipe is None:
            return {"status": "STOPPED", "source": None, "fps": 0.0,
                    "inference_latency_ms": 0.0, "preprocess_latency_ms": 0.0,
                    "postprocess_latency_ms": 0.0, "frame_count": 0, "error": None}
        return pipe.status_dict()

    def status_all(self) -> list[dict]:
        return [{"camera_id": cid, **pipe.status_dict()}
                for cid, pipe in self.pipelines.items()]


_pipeline_manager: PipelineManager | None = None
_pm_lock = threading.Lock()


def get_pipeline_manager() -> PipelineManager:
    global _pipeline_manager
    with _pm_lock:
        if _pipeline_manager is None:
            _pipeline_manager = PipelineManager()
        return _pipeline_manager
