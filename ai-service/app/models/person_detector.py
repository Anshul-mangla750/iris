"""Model A — Person detector (YOLO, COCO-pretrained 'person' class)."""
from __future__ import annotations

import time
from typing import Any

import numpy as np

from app.core.config import settings
from app.core.logging_config import get_logger
from app.models.detections import Detection
from app.models.model_manager import get_model_manager

logger = get_logger(__name__)


class PersonDetector:
    """Thin wrapper around a YOLO model restricted to class 'person'."""

    def __init__(self) -> None:
        self.mm = get_model_manager()
        self.model = None
        self._last_error: str | None = None

    def ensure_loaded(self) -> bool:
        info = self.mm.get("PERSON_MODEL")
        if info is None:
            return False
        if info.status == "DISABLED":
            return False
        if info.status != "READY":
            self.mm.load("PERSON_MODEL")
            info = self.mm.get("PERSON_MODEL")
        self.model = info.loaded_obj if info.status == "READY" else None
        return self.model is not None

    def detect(self, frame: np.ndarray) -> list[Detection]:
        """Run person detection. Returns [] when model not loaded (never fabricates)."""
        if not self.ensure_loaded():
            return []
        try:
            t0 = time.perf_counter()
            results = self.model.predict(
                frame,
                conf=settings.person_confidence,
                iou=settings.person_iou,
                imgsz=settings.person_input_size,
                classes=[0],  # COCO person
                verbose=False,
                device=self.mm.get("PERSON_MODEL").device,
            )
            latency = (time.perf_counter() - t0) * 1000
            self.mm.get("PERSON_MODEL").latency_ms = latency
            return self._parse(results[0])
        except Exception as exc:
            self._last_error = str(exc)[:200]
            logger.error("person detection failed: %s", exc)
            return []

    def _parse(self, result: Any) -> list[Detection]:
        out: list[Detection] = []
        boxes = getattr(result, "boxes", None)
        if boxes is None or boxes.data is None or len(boxes) == 0:
            return out
        for b in boxes.data.cpu().numpy():
            x1, y1, x2, y2, conf, cls = b[:6]
            out.append(Detection(
                bbox=(float(x1), float(y1), float(x2), float(y2)),
                confidence=float(conf),
                class_id=0,
                class_name="person",
            ))
        return out

    @property
    def last_error(self) -> str | None:
        return self._last_error
