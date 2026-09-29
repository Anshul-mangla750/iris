"""Dataset validation for YOLO splits, coordinate ranges, and leakage."""
from __future__ import annotations

import hashlib
from pathlib import Path


def validate_split(split_dir: Path) -> dict:
    """Validate a single dataset split (images/ + labels/)."""
    images_dir = split_dir / "images"
    labels_dir = split_dir / "labels"
    invalid_boxes: list[tuple[str, str]] = []
    missing_labels: list[str] = []
    hashes: set[str] = set()

    if not images_dir.exists():
        return {"invalid_boxes": [], "missing_labels": [], "hashes": set()}

    for img_path in sorted(images_dir.glob("*.jpg")):
        data = img_path.read_bytes()
        hashes.add(hashlib.md5(data).hexdigest())

        lbl_path = labels_dir / f"{img_path.stem}.txt"
        if not lbl_path.exists():
            missing_labels.append(img_path.name)
            continue

        for line in lbl_path.read_text().splitlines():
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) == 5:
                try:
                    vals = [float(v) for v in parts[1:]]
                    if any(v < 0.0 or v > 1.0 for v in vals):
                        invalid_boxes.append((lbl_path.name, line))
                except ValueError:
                    invalid_boxes.append((lbl_path.name, line))

    return {
        "invalid_boxes": invalid_boxes,
        "missing_labels": missing_labels,
        "hashes": hashes,
    }
