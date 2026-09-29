"""Geometry helpers: polygons, centers, line crossing, IoU."""
from __future__ import annotations

import math
from typing import Sequence

Point = tuple[float, float]


def bbox_center(bbox: Sequence[float]) -> Point:
    x1, y1, x2, y2 = bbox[:4]
    return ((x1 + x2) / 2.0, (y1 + y2) / 2.0)


def bbox_bottom_center(bbox: Sequence[float]) -> Point:
    """Feet position — more stable than center for entry/exit crossing."""
    x1, _, x2, y2 = bbox[:4]
    return ((x1 + x2) / 2.0, y2)


def bbox_iou(a: Sequence[float], b: Sequence[float]) -> float:
    ax1, ay1, ax2, ay2 = a[:4]
    bx1, by1, bx2, by2 = b[:4]
    ix1, iy1 = max(ax1, bx1), max(ay1, by1)
    ix2, iy2 = min(ax2, bx2), min(ay2, by2)
    iw, ih = max(0.0, ix2 - ix1), max(0.0, iy2 - iy1)
    inter = iw * ih
    if inter <= 0:
        return 0.0
    area_a = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)
    area_b = max(0.0, bx2 - bx1) * max(0.0, by2 - by1)
    union = area_a + area_b - inter
    return inter / union if union > 0 else 0.0


def point_in_polygon(pt: Point, polygon: Sequence[Sequence[float]]) -> bool:
    """Ray casting point-in-polygon."""
    if len(polygon) < 3:
        return False
    x, y = pt
    inside = False
    n = len(polygon)
    j = n - 1
    for i in range(n):
        xi, yi = float(polygon[i][0]), float(polygon[i][1])
        xj, yj = float(polygon[j][0]), float(polygon[j][1])
        if (yi > y) != (yj > y):
            x_cross = (xj - xi) * (y - yi) / (yj - yi) + xi
            if x < x_cross:
                inside = not inside
        j = i
    return inside


def polygon_area(polygon: Sequence[Sequence[float]]) -> float:
    """Shoelace formula, absolute value."""
    if len(polygon) < 3:
        return 0.0
    s = 0.0
    n = len(polygon)
    for i in range(n):
        x1, y1 = polygon[i][0], polygon[i][1]
        x2, y2 = polygon[(i + 1) % n][0], polygon[(i + 1) % n][1]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2.0


def segment_side(p: Point, a: Point, b: Point) -> float:
    """Sign of which side of segment a→b point p lies on (cross product)."""
    return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])


def crossed_line(prev: Point, curr: Point, a: Point, b: Point) -> bool:
    """True when segment prev→curr crosses the infinite line a→b with direction change."""
    d1 = segment_side(prev, a, b)
    d2 = segment_side(curr, a, b)
    if d1 == 0.0 and d2 == 0.0:
        return False
    return (d1 > 0 and d2 < 0) or (d1 < 0 and d2 > 0)


def line_direction(prev: Point, curr: Point, a: Point, b: Point) -> int:
    """+1 if crossing happened moving a→b side to b→a side... Returns sign of side change."""
    d1 = segment_side(prev, a, b)
    d2 = segment_side(curr, a, b)
    if d2 > d1:
        return 1
    if d2 < d1:
        return -1
    return 0


def distance(a: Point, b: Point) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def polygon_centroid(polygon: Sequence[Sequence[float]]) -> Point:
    xs = [float(p[0]) for p in polygon]
    ys = [float(p[1]) for p in polygon]
    return (sum(xs) / len(xs), sum(ys) / len(ys)) if xs else (0.0, 0.0)


def polygon_bounds(polygon: Sequence[Sequence[float]]) -> tuple[float, float, float, float]:
    xs = [float(p[0]) for p in polygon]
    ys = [float(p[1]) for p in polygon]
    return min(xs), min(ys), max(xs), max(ys)
