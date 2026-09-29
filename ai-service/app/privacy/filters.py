"""Privacy-by-design utilities.

- No face recognition anywhere in the system.
- Track IDs are anonymous integers (no identity inference, no PII attached).
- Optional face-region blurring on the annotated stream.
- Retention windows applied to buffered data.
"""
from __future__ import annotations

import cv2
import numpy as np

from app.core.logging_config import get_logger

logger = get_logger(__name__)


def blur_person_head(frame: np.ndarray, bbox: tuple[float, float, float, float],
                     strength: int = 21) -> np.ndarray:
    """Blur the top ~28% of a person bbox (head region) in place. No detection of
    identity is performed — this is pure pixel filtering."""
    x1, y1, x2, y2 = (int(v) for v in bbox[:4])
    h = y2 - y1
    head_h = max(int(h * 0.28), 8)
    roi = frame[y1:y1 + head_h, x1:x2]
    if roi.size == 0:
        return frame
    k = strength | 1  # must be odd
    frame[y1:y1 + head_h, x1:x2] = cv2.GaussianBlur(roi, (k, k), 30)
    return frame


ANONYMOUS_ID_PREFIX = "T"  # IDs are surfaced as T<number>; never linked to identity
