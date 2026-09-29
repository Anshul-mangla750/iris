"""SKU-110K converter to YOLO layout with validation and reporting."""
from __future__ import annotations

import csv
import json
import shutil
from pathlib import Path

OUT_DIR = Path("datasets/processed/sku110k_yolo")


def _parse_row(parts: list[str]) -> tuple[str, float, float, float, float, int, int] | None:
    """Parse fixed release or legacy row format into (filename, x1, y1, x2, y2, img_w, img_h)."""
    if len(parts) < 8:
        return None
    fname = parts[0].strip()
    if not fname:
        return None

    # Check if legacy layout: filename, img_w, img_h, x1, y1, x2, y2, class
    try:
        w_candidate = float(parts[1])
        h_candidate = float(parts[2])
        x1_candidate = float(parts[3])
        y1_candidate = float(parts[4])
        x2_candidate = float(parts[5])
        y2_candidate = float(parts[6])
        # If w_candidate and h_candidate are positive and coordinates make sense
        if x2_candidate > x1_candidate and y2_candidate > y1_candidate and w_candidate > 0 and h_candidate > 0:
            return fname, x1_candidate, y1_candidate, x2_candidate, y2_candidate, int(w_candidate), int(h_candidate)
    except (ValueError, IndexError):
        pass

    # Check fixed release layout: filename, x1, y1, x2, y2, class, img_w, img_h
    try:
        x1 = float(parts[1])
        y1 = float(parts[2])
        x2 = float(parts[3])
        y2 = float(parts[4])
        img_w = int(float(parts[6]))
        img_h = int(float(parts[7]))
        if x2 > x1 and y2 > y1 and img_w > 0 and img_h > 0:
            return fname, x1, y1, x2, y2, img_w, img_h
    except (ValueError, IndexError):
        pass

    return None


def convert(sku_root: Path, limit_images: int | None = None) -> int:
    """Convert SKU110K dataset into YOLO format at OUT_DIR."""
    sku_root = Path(sku_root)
    out = Path(OUT_DIR)
    out.mkdir(parents=True, exist_ok=True)

    images_src = sku_root / "images"
    annotations_src = sku_root / "annotations"

    splits_data = {"train": {"boxes": 0, "skipped_rows": 0},
                   "val": {"boxes": 0, "skipped_rows": 0},
                   "test": {"boxes": 0, "skipped_rows": 0}}

    for split in ("train", "val", "test"):
        split_img_dir = out / split / "images"
        split_lbl_dir = out / split / "labels"
        split_img_dir.mkdir(parents=True, exist_ok=True)
        split_lbl_dir.mkdir(parents=True, exist_ok=True)

        csv_file = annotations_src / f"annotations_{split}.csv"
        if not csv_file.exists():
            continue

        images_copied = 0
        boxes_by_image: dict[str, list[str]] = {}

        with open(csv_file, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.reader(f)
            for row in reader:
                parsed = _parse_row(row)
                if parsed is None:
                    splits_data[split]["skipped_rows"] += 1
                    continue

                fname, x1, y1, x2, y2, img_w, img_h = parsed
                cx = ((x1 + x2) / 2.0) / img_w
                cy = ((y1 + y2) / 2.0) / img_h
                bw = (x2 - x1) / img_w
                bh = (y2 - y1) / img_h

                cx = max(0.0, min(1.0, cx))
                cy = max(0.0, min(1.0, cy))
                bw = max(0.0, min(1.0, bw))
                bh = max(0.0, min(1.0, bh))

                line = f"0 {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}"
                boxes_by_image.setdefault(fname, []).append(line)
                splits_data[split]["boxes"] += 1

        # Copy images and write labels
        for fname, lines in boxes_by_image.items():
            if limit_images is not None and images_copied >= limit_images:
                break

            src_img = images_src / fname
            if src_img.exists():
                shutil.copy2(src_img, split_img_dir / fname)
                lbl_file = split_lbl_dir / f"{Path(fname).stem}.txt"
                lbl_file.write_text("\n".join(lines) + "\n")
                images_copied += 1

    # Write data.yaml
    yaml_content = f"""path: {out.resolve()}
train: train/images
val: val/images
test: test/images

names:
  0: product
"""
    (out / "data.yaml").write_text(yaml_content)

    # Write dataset_report.json
    report = {
        "splits": splits_data,
        "issues": [],
    }
    (out / "dataset_report.json").write_text(json.dumps(report, indent=2))
    return 0
