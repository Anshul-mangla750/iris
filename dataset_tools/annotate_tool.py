"""Annotation tool helpers for bounding boxes and image collection."""
from __future__ import annotations

import shutil
from pathlib import Path


def yolo_to_px(box: tuple, img_w: int, img_h: int) -> tuple[int, int, int, int]:
    """Convert YOLO (cls, cx, cy, bw, bh) to (x1, y1, x2, y2) in pixel space."""
    _cls, cx, cy, bw, bh = box
    x1 = int(round((cx - bw / 2.0) * img_w))
    y1 = int(round((cy - bh / 2.0) * img_h))
    x2 = int(round((cx + bw / 2.0) * img_w))
    y2 = int(round((cy + bh / 2.0) * img_h))
    return (x1, y1, x2, y2)


def px_to_yolo(x1: float, y1: float, x2: float, y2: float,
               img_w: int, img_h: int) -> tuple[float, float, float, float]:
    """Convert pixel bounds (x1, y1, x2, y2) to normalized YOLO (cx, cy, bw, bh)."""
    # clip to canvas
    cx1 = max(0.0, min(float(img_w), float(x1)))
    cy1 = max(0.0, min(float(img_h), float(y1)))
    cx2 = max(0.0, min(float(img_w), float(x2)))
    cy2 = max(0.0, min(float(img_h), float(y2)))

    # degenerate check (< 2 px width or height)
    if (cx2 - cx1) < 2.0 or (cy2 - cy1) < 2.0:
        return (0.0, 0.0, 0.0, 0.0)

    bw = (cx2 - cx1) / float(img_w)
    bh = (cy2 - cy1) / float(img_h)
    cx = (cx1 + cx2) / 2.0 / float(img_w)
    cy = (cy1 + cy2) / 2.0 / float(img_h)
    return (cx, cy, bw, bh)


def save_boxes(path: Path, boxes: list[tuple]) -> None:
    """Save bounding boxes to a YOLO-formatted .txt file."""
    lines = [f"{int(b[0])} {b[1]} {b[2]} {b[3]} {b[4]}\n" for b in boxes]
    path.write_text("".join(lines))


def load_boxes(path: Path) -> list[tuple]:
    """Load boxes from a YOLO-formatted .txt file, skipping invalid rows."""
    if not path.exists():
        return []
    boxes = []
    for line in path.read_text().splitlines():
        parts = line.strip().split()
        if len(parts) == 5:
            try:
                boxes.append((int(parts[0]), float(parts[1]), float(parts[2]),
                              float(parts[3]), float(parts[4])))
            except ValueError:
                continue
    return boxes


def collect_images(dest_ds: Path, raw_dir: Path) -> list[Path]:
    """Copy raw images to dest_ds/all_images and return unique list of Paths."""
    dest = dest_ds / "all_images"
    dest.mkdir(parents=True, exist_ok=True)
    results: list[Path] = []
    seen = set()

    for ext in ("*.jpg", "*.jpeg", "*.png"):
        for f in raw_dir.rglob(ext):
            target = dest / f.name
            if not target.exists():
                shutil.copy2(f, target)
            if target not in seen:
                seen.add(target)
                results.append(target)
    return results
