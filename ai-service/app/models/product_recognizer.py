"""Model D — Product/SKU recognition layer.

Pipeline: detected crop → embedding → catalog reference matching → product_id.

Design: adding a new SKU requires only adding catalog reference embeddings
(`POST /config/products` with reference_image) — no detector retraining.

Recognition is performed ONLY for catalog products that have reference embeddings;
crops without any catalog match above threshold return None (not guessed).
Embedding model: ORB feature matching for MVP determinism on CPU (no heavy deps),
with the same interface an embedding-net would expose.
"""
from __future__ import annotations

import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from app.core.config import settings
from app.core.logging_config import get_logger
from app.core.store_config import get_store_config

logger = get_logger(__name__)

MATCH_THRESHOLD = 30.0  # minimum ORB good-match score to accept an identity


@dataclass
class RecognitionResult:
    product_id: str | None
    confidence: float
    status: str  # MATCHED | NO_REFERENCE_DATA | BELOW_THRESHOLD


class ProductRecognizer:
    """Catalog-backed product recognition from crops."""

    def __init__(self) -> None:
        self._orb = cv2.ORB_create(nfeatures=500)
        self._matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        self._references: dict[str, list[np.ndarray | None]] = {}  # pid -> [descriptors]
        self._lock = threading.Lock()
        self.reload_references()

    # ------------------------------------------------------------- catalog
    def reload_references(self) -> None:
        """(Re)build reference descriptors from configured products."""
        cfg = get_store_config()
        refs: dict[str, list[np.ndarray | None]] = {}
        for p in cfg.get_products():
            pid = p["product_id"]
            img_path = p.get("reference_image_path")
            desc = None
            if img_path and Path(img_path).exists():
                img = cv2.imread(str(img_path), cv2.IMREAD_GRAYSCALE)
                if img is not None:
                    _, desc = self._orb.detectAndCompute(img, None)
            refs[pid] = [desc]
        with self._lock:
            self._references = refs
        n_with = sum(1 for v in refs.values() if v[0] is not None)
        logger.info("product recognizer: %d catalog products, %d with reference data",
                    len(refs), n_with)

    @property
    def has_reference_data(self) -> bool:
        with self._lock:
            return any(d is not None for v in self._references.values() for d in v)

    # --------------------------------------------------------- recognition
    def recognize(self, crop: np.ndarray) -> RecognitionResult:
        """Recognize a product crop. Honest statuses, no guessing."""
        if crop is None or crop.size == 0:
            return RecognitionResult(None, 0.0, "BELOW_THRESHOLD")
        if not self.has_reference_data:
            return RecognitionResult(None, 0.0, "NO_REFERENCE_DATA")

        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        gray = cv2.resize(gray, (160, 160))
        _, desc = self._orb.detectAndCompute(gray, None)
        if desc is None or len(desc) < 8:
            return RecognitionResult(None, 0.0, "BELOW_THRESHOLD")

        best_pid: str | None = None
        best_score = 0.0
        with self._lock:
            items = list(self._references.items())
        for pid, desc_list in items:
            for ref_desc in desc_list:
                if ref_desc is None or len(ref_desc) < 8:
                    continue
                matches = self._matcher.match(desc, ref_desc)
                if not matches:
                    continue
                # normalized good-match score (mean distance, lower=better → invert)
                mean_d = float(np.mean([m.distance for m in matches]))
                score = max(0.0, 100.0 - mean_d)
                if score > best_score:
                    best_score, best_pid = score, pid

        if best_pid is not None and best_score >= MATCH_THRESHOLD:
            return RecognitionResult(best_pid, min(best_score / 100.0, 1.0), "MATCHED")
        return RecognitionResult(None, best_score / 100.0, "BELOW_THRESHOLD")
