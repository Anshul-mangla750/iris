"""Model F — Optional shelf segmentation pipeline.

Used only when SEGMENTATION_MODEL is trained and segmentation_enabled=True.
Computes occupancy from product pixel area vs shelf pixel area. When the model is
absent, the inventory engine falls back to geometric facing-width estimation.
"""
from __future__ import annotations

from typing import Any

import cv2
import numpy as np

from app.core.config import settings
from app.core.logging_config import get_logger
from app.models.model_manager import get_model_manager

logger = get_logger(__name__)


class ShelfSegmenter:
    """Optional YOLO-seg wrapper for shelf/product/empty-area masks."""

    def __init__(self) -> None:
        self.mm = get_model_manager()
        self.model: Any | None = None

    def ensure_loaded(self) -> bool:
        info = self.mm.get("SEGMENTATION_MODEL")
        if info is None or info.status == "DISABLED":
            return False
        if info.status != "READY":
            self.mm.load("SEGMENTATION_MODEL")
            info = self.mm.get("SEGMENTATION_MODEL")
        self.model = info.loaded_obj if info.status == "READY" else None
        return self.model is not None

    @property
    def is_ready(self) -> bool:
        info = self.mm.get("SEGMENTATION_MODEL")
        return bool(info and info.status == "READY")

    def segment(self, frame: np.ndarray) -> dict[str, Any]:
        """Returns {'masks': list[np.ndarray], 'classes': list[str]} or empty dict."""
        if not self.ensure_loaded():
            return {}
        try:
            results = self.model.predict(
                frame, conf=0.4, imgsz=640, verbose=False,
                device=self.mm.get("SEGMENTATION_MODEL").device,
            )
            r = results[0]
            masks = []
            names = []
            if getattr(r, "masks", None) is not None and r.masks is not None:
                for mask, cls in zip(r.masks.data.cpu().numpy(), r.boxes.cls.int().cpu().tolist()):
                    masks.append(mask.astype(bool))
                    names.append(str(self.model.names.get(cls, cls)))
            return {"masks": masks, "classes": names}
        except Exception as exc:
            logger.error("segmentation failed: %s", exc)
            return {}

    @staticmethod
    def mask_area_within(mask: np.ndarray, polygon: list[list[float]] | None = None) -> int:
        """Count mask pixels inside a polygon (or total when polygon is None)."""
        total = int(mask.sum())
        if polygon is None or len(polygon) < 3:
            return total
        m = mask.astype(np.uint8) * 255
        poly = np.array(polygon, dtype=np.int32)
        roi = np.zeros_like(m)
        cv2.fillPoly(roi, [poly], 255)
        masked = cv2.bitwise_and(m, roi)
        return int((masked > 0).sum())
