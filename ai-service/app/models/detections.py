"""Detection dataclasses shared by models, trackers, and analytics."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class Detection:
    bbox: tuple[float, float, float, float]  # x1, y1, x2, y2 (pixels)
    confidence: float
    class_id: int
    class_name: str
    track_id: int | None = None
    embedding: list[float] | None = None
    attributes: dict[str, Any] = field(default_factory=dict)

    @property
    def width(self) -> float:
        return self.bbox[2] - self.bbox[0]

    @property
    def height(self) -> float:
        return self.bbox[3] - self.bbox[1]


@dataclass
class Track:
    track_id: int
    bbox: tuple[float, float, float, float]
    confidence: float
    class_name: str
    center_x: float
    center_y: float
    velocity_x: float = 0.0
    velocity_y: float = 0.0
    age_s: float = 0.0
    timestamp: float = 0.0
