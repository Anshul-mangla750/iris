"""Models C & E — Retail product, rack, and shelf YOLO detectors.

All three wrap custom-trained YOLO weights. When weights are absent the detectors
report NOT_TRAINED via ModelManager and return no detections (never fabricated).
"""
from __future__ import annotations

import time
from pathlib import Path
from typing import Any

import numpy as np
from ultralytics import YOLO

from app.core.config import settings
from app.core.logging_config import get_logger
from app.models.detections import Detection
from app.models.model_manager import get_model_manager

logger = get_logger(__name__)

# COCO classes the SKU-110K model cannot see (loose/everyday objects).
# A stock COCO checkpoint handles them so the system still detects
# bottles, phones, cups etc. outside dense shelf scenarios.
COCO_ITEM_CLASSES = {
    "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl",
    "banana", "apple", "sandwich", "orange", "broccoli", "carrot",
    "hot dog", "pizza", "donut", "cake", "cell phone", "laptop",
    "mouse", "remote", "keyboard", "book", "vase", "teddy bear",
    "toothbrush", "hair drier", "backpack", "handbag", "suitcase",
}
# Classes allowed even when a confidence override pushes the threshold high
# (users testing loose items need the fallback to stay alive).
ITEM_OVERRIDE_FLOOR = 0.2


def _locate_stock_coco_weights() -> str | None:
    """Find a stock (80-class COCO) YOLO checkpoint already on disk."""
    candidates = []
    person_path = getattr(settings, "person_model_path", None)
    if person_path is not None:
        candidates.append(Path(person_path))
    candidates.append(Path("yolo11n.pt"))
    for c in candidates:
        try:
            if c.is_file() and c.stat().st_size > 1_000_000:
                return str(c)
        except OSError:
            continue
    return None


class _YoloCustomDetector:
    """Base wrapper for custom-trained YOLO detection models."""

    registry_name: str = ""
    conf_setting: str = ""
    iou_setting: str = ""
    size_setting: str = ""

    def __init__(self) -> None:
        self.mm = get_model_manager()
        self.model: Any | None = None
        self._class_names: dict[int, str] = {}

    def ensure_loaded(self) -> bool:
        info = self.mm.get(self.registry_name)
        if info is None or info.status == "DISABLED":
            return False
        if info.status != "READY":
            self.mm.load(self.registry_name)
            info = self.mm.get(self.registry_name)
        self.model = info.loaded_obj if info.status == "READY" else None
        if self.model is not None and hasattr(self.model, "names"):
            self._class_names = dict(self.model.names)
        return self.model is not None

    @property
    def is_ready(self) -> bool:
        info = self.mm.get(self.registry_name)
        return bool(info and info.status == "READY")

    def detect(self, frame: np.ndarray, conf_override: float | None = None) -> list[Detection]:
        if not self.ensure_loaded():
            return []
        conf = conf_override if conf_override is not None else getattr(settings, self.conf_setting)
        try:
            t0 = time.perf_counter()
            results = self.model.predict(
                frame,
                conf=conf,
                iou=getattr(settings, self.iou_setting),
                imgsz=getattr(settings, self.size_setting),
                verbose=False,
                device=self.mm.get(self.registry_name).device,
            )
            self.mm.get(self.registry_name).latency_ms = (time.perf_counter() - t0) * 1000
            return self._parse(results[0])
        except Exception as exc:
            logger.error("%s inference failed: %s", self.registry_name, exc)
            return []

    def _parse(self, result: Any) -> list[Detection]:
        out: list[Detection] = []
        boxes = getattr(result, "boxes", None)
        if boxes is None or boxes.data is None or len(boxes) == 0:
            return out
        for b in boxes.data.cpu().numpy():
            x1, y1, x2, y2, conf, cls = b[:6]
            cls = int(cls)
            out.append(Detection(
                bbox=(float(x1), float(y1), float(x2), float(y2)),
                confidence=float(conf),
                class_id=cls,
                class_name=self._class_names.get(cls, str(cls)),
            ))
        return out


class ProductDetector(_YoloCustomDetector):
    """Model C — dense retail product/facing localization (e.g., SKU-110K-trained).

    Adds a COCO everyday-object fallback (bottle, cell phone, cup, book, ...)
    so loose items outside dense shelf scenes are still detected.
    """

    registry_name = "PRODUCT_MODEL"
    conf_setting = "product_confidence"
    iou_setting = "product_iou"
    size_setting = "product_input_size"

    def __init__(self) -> None:
        super().__init__()
        self._fallback: Any | None = None
        self._fallback_names: dict[int, str] = {}
        self._fallback_failed = False

    def _load_fallback(self) -> bool:
        if self._fallback is not None or self._fallback_failed:
            return self._fallback is not None
        if not getattr(settings, "product_coco_fallback_enabled", True):
            self._fallback_failed = True
            return False
        weights = _locate_stock_coco_weights()
        if weights is None:
            self._fallback_failed = True
            logger.warning("COCO fallback enabled but no stock yolo weights found")
            return False
        try:
            self._fallback = YOLO(weights)
            self._fallback_names = dict(self._fallback.names)
            logger.info("COCO item fallback loaded from %s", weights)
            return True
        except Exception as exc:
            self._fallback_failed = True
            logger.error("COCO fallback load failed: %s", exc)
            return False

    def _fallback_detect(self, frame: np.ndarray, conf: float) -> list[Detection]:
        try:
            t0 = time.perf_counter()
            res = self._fallback.predict(
                frame, conf=conf, iou=0.45, imgsz=640, verbose=False,
                device=self.mm.get(self.registry_name).device,
            )[0]
            self.mm.get(self.registry_name).latency_ms = (time.perf_counter() - t0) * 1000
            boxes = getattr(res, "boxes", None)
            if boxes is None or boxes.data is None or len(boxes) == 0:
                return []
            out: list[Detection] = []
            for b in boxes.data.cpu().numpy():
                x1, y1, x2, y2, c, cls = b[:6]
                cls = int(cls)
                name = self._fallback_names.get(cls, str(cls))
                if name not in COCO_ITEM_CLASSES:
                    continue
                out.append(Detection(
                    bbox=(float(x1), float(y1), float(x2), float(y2)),
                    confidence=float(c), class_id=cls, class_name=name,
                ))
            return out
        except Exception as exc:
            logger.error("COCO fallback inference failed: %s", exc)
            return []

    def detect(self, frame: np.ndarray, conf_override: float | None = None) -> list[Detection]:
        conf = conf_override if conf_override is not None else getattr(settings, self.conf_setting)
        dets = super().detect(frame, conf_override=conf)
        if self._load_fallback():
            fb_conf = max(ITEM_OVERRIDE_FLOOR, min(conf, 0.3))
            dets = dets + self._fallback_detect(frame, fb_conf)
        return dets


class RackDetector(_YoloCustomDetector):
    """Model E — rack localization."""

    registry_name = "RACK_MODEL"
    conf_setting = "rack_confidence"
    iou_setting = "person_iou"
    size_setting = "person_input_size"


class ShelfDetector(_YoloCustomDetector):
    """Model E — shelf row localization."""

    registry_name = "SHELF_MODEL"
    conf_setting = "shelf_confidence"
    iou_setting = "person_iou"
    size_setting = "person_input_size"
