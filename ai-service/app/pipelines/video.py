"""Video pipeline — batch processing of uploaded MP4/AVI/MOV files.

Video → frame extraction (configurable skip) → same person/product models and
analytics as the live pipeline → per-video aggregate events and metrics.
Runs in a worker thread; job status is queryable. No synthetic results.
"""
from __future__ import annotations

import shutil
import threading
import time
import uuid
from collections import deque
from pathlib import Path

import cv2

from app.alerts.engine import AlertEngine
from app.analytics.queue import QueueAnalytics
from app.analytics.shopper import ShopperAnalytics
from app.core.config import settings
from app.core.logging_config import get_logger
from app.inventory.engine import InventoryEngine
from app.models.person_detector import PersonDetector
from app.models.product_detector import ProductDetector, RackDetector, ShelfDetector
from app.models.product_recognizer import ProductRecognizer
from app.pipelines.annotator import draw_geometry, draw_tracks
from app.tracking.tracker import ByteTracker

logger = get_logger(__name__)

UPLOAD_DIR = settings.log_dir.parent / "data" / "videos"
ALLOWED_EXT = {".mp4", ".avi", ".mov", ".mkv"}


class VideoPipeline:
    """Batch video processing sharing the same models as the live pipeline."""

    def __init__(self) -> None:
        self.person_detector = PersonDetector()
        self.tracker = ByteTracker(self.person_detector)
        self.product_detector = ProductDetector()
        self.rack_detector = RackDetector()
        self.shelf_detector = ShelfDetector()
        self.recognizer = ProductRecognizer()
        self.shopper = ShopperAnalytics("video")
        self.queue = QueueAnalytics("video")
        self.inventory = InventoryEngine("video")
        self.alerts = AlertEngine()
        self.jobs: dict[str, dict] = {}
        self._lock = threading.Lock()

    # ------------------------------------------------------------- upload
    def upload(self, filename: str, content: bytes) -> dict:
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXT:
            return {"ok": False, "error": f"unsupported extension {ext}"}
        video_id = uuid.uuid4().hex[:12]
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        path = UPLOAD_DIR / f"{video_id}{ext}"
        path.write_bytes(content)
        cap = cv2.VideoCapture(str(path))
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        cap.release()
        job = {
            "video_id": video_id, "filename": filename, "path": str(path),
            "status": "UPLOADED", "frames_total": frames,
            "fps_source": round(fps, 2), "size_bytes": len(content),
            "frames_processed": 0, "error": None,
        }
        with self._lock:
            self.jobs[video_id] = job
        return {"ok": True, "job": job}

    # ------------------------------------------------------------ process
    def process(self, video_id: str, frame_skip: int = 1,
                confidence_override: float | None = None) -> dict:
        with self._lock:
            job = self.jobs.get(video_id)
        if job is None:
            return {"ok": False, "error": "unknown video_id"}
        if job["status"] == "PROCESSING":
            return {"ok": False, "error": "already processing"}
        job["status"] = "PROCESSING"
        job["error"] = None
        thread = threading.Thread(
            target=self._run, args=(job, frame_skip, confidence_override),
            name=f"video-{video_id}", daemon=True)
        thread.start()
        return {"ok": True, "video_id": video_id}

    def _run(self, job: dict, frame_skip: int, confidence_override: float | None) -> None:
        path = job["path"]
        cap = cv2.VideoCapture(path)
        if not cap.isOpened():
            job["status"] = "FAILED"
            job["error"] = "cannot open video"
            return
        idx = -1
        try:
            while True:
                ok, frame = cap.read()
                if not ok:
                    break
                idx += 1
                if idx % max(frame_skip, 1) != 0:
                    continue
                self._process_frame(frame, job, confidence_override)
                job["frames_processed"] = idx + 1
            job["status"] = "COMPLETED"
            job["summary"] = {
                "entries": self.shopper.entries,
                "exits": self.shopper.exits,
                "unique_tracks": self.shopper.unique_ids_seen,
                "inventory_status": [s.to_dict() for s in self.inventory.product_status()],
                "queue_metrics": self.queue.metrics(),
            }
        except Exception as exc:
            logger.exception("video processing failed")
            job["status"] = "FAILED"
            job["error"] = str(exc)[:300]
        finally:
            cap.release()

    def _process_frame(self, frame, job: dict, confidence_override: float | None) -> None:
        tracks, _ = self.tracker.update(frame)
        self.shopper.update(tracks)
        self.queue.update(tracks)

        dets = self.product_detector.detect(frame, conf_override=confidence_override)
        if dets:
            recognized: dict[int, str] = {}
            if self.recognizer.has_reference_data:
                for i, det in enumerate(dets):
                    x1, y1, x2, y2 = (int(v) for v in det.bbox)
                    crop = frame[max(y1, 0):y2, max(x1, 0):x2]
                    if crop.size == 0:
                        continue
                    res = self.recognizer.recognize(crop)
                    if res.status == "MATCHED" and res.product_id:
                        recognized[i] = res.product_id
            for ev in self.inventory.observe(dets, recognized,
                                             (frame.shape[1], frame.shape[0])):
                self.alerts.fire_from_inventory_event(ev)

    # ------------------------------------------------------------- status
    def status(self, video_id: str) -> dict | None:
        with self._lock:
            job = self.jobs.get(video_id)
        return dict(job) if job else None

    def annotate_video(self, video_id: str, out_name: str | None = None) -> str | None:
        """Re-encode video with overlays (person tracks + geometry) for review."""
        with self._lock:
            job = self.jobs.get(video_id)
        if job is None or job["status"] != "COMPLETED":
            return None
        src = job["path"]
        out_path = Path(src).with_name(f"{Path(src).stem}_annotated.mp4")
        cap = cv2.VideoCapture(src)
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        writer = cv2.VideoWriter(str(out_path), cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            draw_geometry(frame)
            tracks, _ = self.tracker.update(frame)
            draw_tracks(frame, tracks)
            writer.write(frame)
        cap.release()
        writer.release()
        return str(out_path)


_video_pipeline: VideoPipeline | None = None


def get_video_pipeline() -> VideoPipeline:
    global _video_pipeline
    if _video_pipeline is None:
        _video_pipeline = VideoPipeline()
    return _video_pipeline
