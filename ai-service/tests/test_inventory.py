"""Unit tests: inventory engine (facing count, low-stock, OOS confirmation)."""
from __future__ import annotations

import time

from app.inventory.engine import InventoryEngine
from app.models.detections import Detection


def make_engine(store_cfg) -> InventoryEngine:
    store_cfg.upsert_rack("RACK_01")
    # shelf polygon: x 100-500, y 100-200
    poly = [[100, 100], [500, 100], [500, 200], [100, 200]]
    store_cfg.upsert_shelf("RACK_01_SHELF_01", "RACK_01", poly)
    store_cfg.upsert_product({
        "product_id": "coke_500ml", "sku": "COKE500", "name": "Coca-Cola 500ml",
        "expected_facing": 8, "minimum_facing": 3, "maximum_facing": 16,
    })
    store_cfg.upsert_planogram_item({
        "rack_id": "RACK_01", "shelf_id": "RACK_01_SHELF_01", "position": 1,
        "product_id": "coke_500ml", "expected_facing": 8,
    })
    return InventoryEngine("cam_test")


def det(x: float, y: float, cls: str = "product") -> Detection:
    return Detection(bbox=(x, y, x + 40, y + 40), confidence=0.9, class_id=0,
                     class_name=cls)


def test_shelf_mapping(store_cfg):
    eng = make_engine(store_cfg)
    dets = [det(150, 130), det(200, 130), det(450, 130)]
    eng.observe(dets, recognized={0: "coke_500ml", 1: "coke_500ml", 2: "coke_500ml"})
    status = {s.product_id: s for s in eng.product_status()}
    assert status["coke_500ml"].detected_facing == 3
    assert status["coke_500ml"].shelf_id == "RACK_01_SHELF_01"
    assert status["coke_500ml"].rack_id == "RACK_01"


def test_facing_counts_only_within_shelf(store_cfg):
    eng = make_engine(store_cfg)
    # one inside shelf, one outside (x=600 beyond polygon)
    eng.observe([det(150, 130), det(620, 130)],
                recognized={0: "coke_500ml", 1: "coke_500ml"})
    status = {s.product_id: s for s in eng.product_status()}
    assert status["coke_500ml"].detected_facing == 1


def test_low_stock_classification(store_cfg):
    eng = make_engine(store_cfg)
    # expected 8, minimum 3 → 3 detected = LOW_STOCK
    eng.observe([det(150 + i * 45, 130) for i in range(3)],
                recognized={i: "coke_500ml" for i in range(3)})
    status = {s.product_id: s for s in eng.product_status()}
    assert status["coke_500ml"].status == "LOW_STOCK"


def test_replenishment_required(store_cfg):
    eng = make_engine(store_cfg)
    eng.observe([det(150 + i * 45, 130) for i in range(5)],
                recognized={i: "coke_500ml" for i in range(5)})
    status = {s.product_id: s for s in eng.product_status()}
    assert status["coke_500ml"].status == "REPLENISHMENT_REQUIRED"


def test_normal_when_fully_stocked(store_cfg):
    eng = make_engine(store_cfg)
    eng.observe([det(150 + i * 45, 130) for i in range(8)],
                recognized={i: "coke_500ml" for i in range(8)})
    status = {s.product_id: s for s in eng.product_status()}
    assert status["coke_500ml"].status == "NORMAL"


def test_out_of_stock_temporal_confirmation(store_cfg):
    eng = make_engine(store_cfg)
    # product detected once → then absent frames; OOS only after confirmation window
    eng.observe([det(150, 130)], recognized={0: "coke_500ml"})
    events = eng.observe([], {})  # absent frame 1
    assert not any(e["type"] == "OUT_OF_STOCK" for e in events)
    time.sleep(0.6)  # > OUT_OF_STOCK_CONFIRMATION_SECONDS (0.5 in test env)
    events = eng.observe([], {})
    assert any(e["type"] == "OUT_OF_STOCK" and e["product_id"] == "coke_500ml"
               for e in events)


def test_no_oos_without_prior_observation(store_cfg):
    eng = make_engine(store_cfg)
    # never seen: must NOT confirm OOS immediately (scan age < window)
    events = eng.observe([], {})
    assert not any(e["type"] == "OUT_OF_STOCK" for e in events)


def test_occupancy_ratio_computed(store_cfg):
    eng = make_engine(store_cfg)
    eng.observe([det(150, 130), det(200, 130)], recognized={0: "coke_500ml", 1: "coke_500ml"})
    gaps = eng.shelf_gap_summary()
    assert gaps[0]["occupancy_ratio"] is not None
    assert 0.0 < gaps[0]["occupancy_ratio"] <= 1.0


def test_planogram_wrong_product(store_cfg):
    eng = make_engine(store_cfg)
    eng.observe([det(150, 130)], recognized={0: "pepsi_500ml"})
    vs = eng.planogram_violations([], {})
    # rebuild observed from current detections
    vs = eng.planogram_violations([det(150, 130)], {0: "pepsi_500ml"})
    types = {v["violation_type"] for v in vs}
    assert "WRONG_PRODUCT" in types
    assert "MISSING_PRODUCT" in types
