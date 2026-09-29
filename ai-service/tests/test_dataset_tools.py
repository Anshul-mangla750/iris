"""Tests for dataset tools: SKU-110K converter, annotation conversion, validation."""
from __future__ import annotations

import csv
import sys
from pathlib import Path

import cv2
import numpy as np
import pytest

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))
sys.path.insert(0, str(REPO / "dataset_tools"))


@pytest.fixture()
def fake_sku110k(tmp_path):
    """SKU110K_fixed-shaped fixture: images/ + headerless annotation CSVs."""
    root = tmp_path / "SKU110K_fixed"
    (root / "images").mkdir(parents=True)
    (root / "annotations").mkdir(parents=True)

    rng = np.random.default_rng(7)
    for i in range(6):
        img = rng.integers(0, 255, (96, 128, 3), dtype=np.uint8)
        cv2.imwrite(str(root / "images" / f"img_{i}.jpg"), img)

    def write_rows(split, rows):
        with open(root / "annotations" / f"annotations_{split}.csv", "w", newline="") as f:
            csv.writer(f).writerows(rows)

    # fixed-release row layout: filename,x1,y1,x2,y2,class,img_w,img_h
    train_rows = []
    for i in range(4):
        train_rows += [
            [f"img_{i}.jpg", 10, 10, 40, 50, "object", 128, 96],
            [f"img_{i}.jpg", 50, 20, 90, 60, "object", 128, 96],
        ]
    write_rows("train", train_rows)
    write_rows("val", [[f"img_4.jpg", 5, 5, 60, 80, "object", 128, 96]])
    write_rows("test", [[f"img_5.jpg", 8, 8, 64, 88, "object", 128, 96]])
    return root


@pytest.fixture()
def out_dir(tmp_path, monkeypatch):
    """Isolated converter output dir per test (never the repo datasets/)."""
    from dataset_tools import prepare_sku110k as prep

    out = tmp_path / "sku110k_yolo"
    monkeypatch.setattr(prep, "OUT_DIR", out)
    return out


def test_sku110k_convert_full(fake_sku110k, out_dir):
    from dataset_tools import prepare_sku110k as prep

    rc = prep.convert(fake_sku110k)
    assert rc == 0

    yaml_text = (out_dir / "data.yaml").read_text()
    assert "0: product" in yaml_text and "test: test/images" in yaml_text

    # train: 4 images × 2 boxes
    labels = sorted((out_dir / "train" / "labels").glob("*.txt"))
    assert len(labels) == 4
    assert sum(len(l.read_text().splitlines()) for l in labels) == 8
    first = labels[0].read_text().splitlines()[0].split()
    assert first[0] == "0" and len(first) == 5
    vals = [float(v) for v in first[1:]]
    assert all(0.0 <= v <= 1.0 for v in vals)

    # val/test present
    assert len(list((out_dir / "val" / "labels").glob("*.txt"))) == 1
    assert len(list((out_dir / "test" / "labels").glob("*.txt"))) == 1

    # report written and clean
    report = __import__("json").loads((out_dir / "dataset_report.json").read_text())
    assert report["splits"]["train"]["boxes"] == 8
    assert report["issues"] == []

    # images hardlinked or copied, readable
    img = cv2.imread(str(next((out_dir / "train" / "images").glob("*.jpg"))))
    assert img is not None


def test_sku110k_convert_handles_bad_rows(fake_sku110k, out_dir):
    from dataset_tools import prepare_sku110k as prep

    bad = fake_sku110k / "annotations" / "annotations_val.csv"
    bad.write_text(
        "img_4.jpg,5,5,60,80,object,128,96\n"        # good (fixed release)
        "img_4.jpg,128,96,5,5,60,80,product\n"       # legacy layout → parsed
        "img_4.jpg,128,96,x1,bad,,,,\n"              # malformed → skipped
        "img_4.jpg,50,50,40,60,object,128,96\n"      # x2<x1 → skipped
        ",128,96,1,1,2,2,product\n"                  # empty name → skipped
    )
    rc = prep.convert(fake_sku110k)
    assert rc == 0
    labels = list((out_dir / "val" / "labels").glob("*.txt"))
    assert len(labels) == 1
    lines = labels[0].read_text().splitlines()
    assert len(lines) == 2  # one box from each layout row
    report = __import__("json").loads((out_dir / "dataset_report.json").read_text())
    assert report["splits"]["val"]["skipped_rows"] == 3


def test_sku110k_convert_legacy_row_layout(fake_sku110k, out_dir):
    """Legacy headerless layout (filename,w,h,x1,y1,x2,y2,class) still parses."""
    from dataset_tools import prepare_sku110k as prep

    (fake_sku110k / "annotations" / "annotations_val.csv").write_text(
        "img_4.jpg,128,96,5,5,60,80,product\n"
        "img_4.jpg,128,96,10,10,40,50,product\n"
    )
    rc = prep.convert(fake_sku110k)
    assert rc == 0
    labels = list((out_dir / "val" / "labels").glob("*.txt"))
    assert len(labels) == 1
    lines = labels[0].read_text().splitlines()
    assert len(lines) == 2
    cx, cy, bw, bh = (float(v) for v in lines[0].split()[1:])
    assert abs(cx - 32.5 / 128) < 1e-6 and abs(cy - 42.5 / 96) < 1e-6
    assert abs(bw - 55 / 128) < 1e-6 and abs(bh - 75 / 96) < 1e-6


def test_sku110k_limit_images(fake_sku110k, out_dir):
    from dataset_tools import prepare_sku110k as prep

    prep.convert(fake_sku110k, limit_images=2)
    assert len(list((out_dir / "train" / "images").glob("*.jpg"))) == 2


def test_validate_dataset_report(tmp_path):
    """validate_dataset.py catches invalid boxes, missing labels and leakage."""
    sys.path.insert(0, str(REPO / "dataset_tools"))
    import validate_dataset as vd

    ds = tmp_path / "ds"
    for split in ("train", "val"):
        (ds / split / "images").mkdir(parents=True)
        (ds / split / "labels").mkdir(parents=True)
        cv2.imwrite(str(ds / split / "images" / "a.jpg"), np.zeros((32, 32, 3), np.uint8))
        cv2.imwrite(str(ds / split / "images" / "b.jpg"), np.zeros((32, 32, 3), np.uint8))
    (ds / "train" / "labels" / "a.txt").write_text("0 0.5 0.5 0.2 0.2\n")
    (ds / "train" / "labels" / "b.txt").write_text("0 1.5 0.5 0.2 0.2\n")  # out of range
    # b.jpg in val duplicates train/b.jpg and has no label → leakage + missing label
    (ds / "val" / "images" / "b.jpg").write_bytes(
        (ds / "train" / "images" / "b.jpg").read_bytes())

    report_train = vd.validate_split(ds / "train")
    assert report_train["invalid_boxes"], "out-of-range box must be flagged"

    # val: images copied from train with no labels → missing labels
    report_val = vd.validate_split(ds / "val")
    assert set(report_val["missing_labels"]) == {"a.jpg", "b.jpg"}

    # leakage: identical image hash across splits (b.jpg duplicated)
    assert set(report_train["hashes"]) & set(report_val["hashes"]), \
        "identical image must produce identical hash for leakage detection"


# ------------------------------------------------------- annotate_tool (Model E)
def test_annotate_tool_box_roundtrip(tmp_path):
    sys.path.insert(0, str(REPO / "dataset_tools"))
    import annotate_tool as at

    lbl = tmp_path / "img_1.txt"
    boxes = [(0, 0.1, 0.2, 0.3, 0.4), (1, 0.5, 0.5, 0.25, 0.25)]
    at.save_boxes(lbl, boxes)
    loaded = at.load_boxes(lbl)
    assert loaded == boxes
    # malformed lines are skipped on load
    lbl.write_text("0 0.1 0.2 0.3 0.4\ngarbage line\n1 0.5 0.5 0.25\n")
    assert len(at.load_boxes(lbl)) == 1


def test_annotate_tool_px_yolo_mapping():
    sys.path.insert(0, str(REPO / "dataset_tools"))
    import annotate_tool as at

    # YOLO center-format → pixel corners on a 200x100 canvas
    assert at.yolo_to_px((0, 0.5, 0.5, 0.5, 0.5), 200, 100) == (50, 25, 150, 75)
    # inverse mapping
    cx, cy, bw, bh = at.px_to_yolo(50, 25, 150, 75, 200, 100)
    assert (round(cx, 6), round(cy, 6), round(bw, 6), round(bh, 6)) == (0.5, 0.5, 0.5, 0.5)
    # degenerate (<2 px) boxes are rejected
    assert at.px_to_yolo(10, 10, 11, 10, 200, 100) == (0.0, 0.0, 0.0, 0.0)
    # out-of-canvas drags are clipped to the image
    assert at.px_to_yolo(-10, -10, 300, 300, 200, 100) == (0.5, 0.5, 1.0, 1.0)


def test_annotate_tool_collect_images(tmp_path):
    sys.path.insert(0, str(REPO / "dataset_tools"))
    import annotate_tool as at

    raw = tmp_path / "raw"
    (raw / "rack").mkdir(parents=True)
    for i in range(3):
        cv2.imwrite(str(raw / "rack" / f"p{i}.jpg"), np.zeros((32, 32, 3), np.uint8))
    (raw / "notes.txt").write_text("ignore me")
    imgs = at.collect_images(tmp_path / "ds", raw)
    assert len(imgs) == 3
    assert all(p.parent.name == "all_images" for p in imgs)
    # second call must not duplicate copies
    assert len(at.collect_images(tmp_path / "ds", raw)) == 3
