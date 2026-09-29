"""Model B — Multi-object tracking via ByteTrack (ultralytics implementation).

ultralytics' model.track() fuses detection + ByteTrack; this wrapper exposes a
stable Track interface. Track IDs are anonymous integers only.
"""
from __future__ import annotations

import time
from typing import Any

import numpy as np

from app.core.config import settings
from app.core.logging_config import get_logger
from app.models.detections import Detection, Track

logger = get_logger(__name__)


class ByteTracker:
    """ByteTrack wrapper over the person YOLO model (detect + track in one pass)."""

    def __init__(self, person_detector: Any | None = None) -> None:
        self.person_detector = person_detector
        self._prev_centers: dict[int, tuple[float, float, float]] = {}  # id -> (cx, cy, t)
        self._seen_ids: set[int] = set()

    def update(self, frame: np.ndarray) -> tuple[list[Track], list[Detection]]:
        """Returns (tracks, raw person detections). Empty lists if model unavailable."""
        if self.person_detector is None or not self.person_detector.ensure_loaded():
            return [], []
        model = self.person_detector.model
        info = self.person_detector.mm.get("PERSON_MODEL")
        try:
            t0 = time.perf_counter()
            results = model.track(
                frame,
                persist=True,
                conf=settings.person_confidence,
                iou=settings.person_iou,
                imgsz=settings.person_input_size,
                classes=[0],
                tracker=settings.tracker_type,
                verbose=False,
                device=info.device,
            )
            latency = (time.perf_counter() - t0) * 1000
            info.latency_ms = latency
        except Exception as exc:
            logger.error("tracking failed: %s", exc)
            return [], []

        tracks: list[Track] = []
        detections: list[Detection] = []
        r = results[0]
        boxes = getattr(r, "boxes", None)
        if boxes is None or boxes.id is None:
            return tracks, detections

        now = time.time()
        ids = boxes.id.int().cpu().tolist()
        confs = boxes.conf.float().cpu().tolist()
        xyxy = boxes.xyxy.float().cpu().numpy()
        for tid, conf, bb in zip(ids, confs, xyxy):
            x1, y1, x2, y2 = (float(v) for v in bb[:4])
            cx, cy = (x1 + x2) / 2.0, (y1 + y2) / 2.0
            prev = self._prev_centers.get(tid)
            vx = vy = 0.0
            if prev is not None:
                dt = max(now - prev[2], 1e-3)
                vx = (cx - prev[0]) / dt
                vy = (cy - prev[1]) / dt
            self._prev_centers[tid] = (cx, cy, now)
            self._seen_ids.add(tid)
            tracks.append(Track(
                track_id=int(tid),
                bbox=(x1, y1, x2, y2),
                confidence=float(conf),
                class_name="person",
                center_x=cx,
                center_y=cy,
                velocity_x=vx,
                velocity_y=vy,
                timestamp=now,
            ))
            detections.append(Detection(
                bbox=(x1, y1, x2, y2), confidence=float(conf),
                class_id=0, class_name="person", track_id=int(tid),
            ))
        return tracks, detections

    @property
    def unique_ids_seen(self) -> int:
        return len(self._seen_ids)

    def velocity(self, track_id: int) -> tuple[float, float]:
        prev = self._prev_centers.get(track_id)
        return (0.0, 0.0) if prev is None else (0.0, 0.0)  # velocity kept in Track objects
