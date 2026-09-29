"""Unit tests: shopper analytics (entry/exit, zones, dwell) + queue metrics."""
from __future__ import annotations

import time

from app.analytics.queue import QueueAnalytics
from app.analytics.shopper import ShopperAnalytics
from app.models.detections import Track


def track(tid: int, cx: float, cy: float) -> Track:
    """Person bbox whose FOOT (bottom-center) is exactly (cx, cy)."""
    return Track(track_id=tid, bbox=(cx - 30, cy - 160, cx + 30, cy), confidence=0.9,
                 class_name="person", center_x=cx, center_y=cy - 80, timestamp=time.time())


# --------------------------------------------------------------------- entry/exit
def test_entry_line_crossing(store_cfg):
    store_cfg.set_geometry("entry_line", "ENTRY_1", [[300, 0], [300, 720]])
    sa = ShopperAnalytics("cam_test")
    # walk from left to right across x=300
    for x in (250, 290, 320, 350):
        sa.update([track(7, x, 400)])
    assert sa.entries == 1


def test_no_double_count_same_direction(store_cfg):
    store_cfg.set_geometry("entry_line", "ENTRY_1", [[300, 0], [300, 720]])
    sa = ShopperAnalytics("cam_test")
    for x in (250, 320, 380, 420, 450):
        sa.update([track(7, x, 400)])
    assert sa.entries == 1


def test_no_count_without_crossing(store_cfg):
    store_cfg.set_geometry("entry_line", "ENTRY_1", [[300, 0], [300, 720]])
    sa = ShopperAnalytics("cam_test")
    for x in (100, 150, 200, 250):
        sa.update([track(7, x, 400)])
    assert sa.entries == 0


def test_exit_line_crossing(store_cfg):
    store_cfg.set_geometry("exit_line", "EXIT_1", [[300, 0], [300, 720]])
    sa = ShopperAnalytics("cam_test")
    for x in (350, 320, 290, 250):
        sa.update([track(9, x, 400)])
    assert sa.exits == 1


# -------------------------------------------------------------------------- zones
def test_zone_occupancy_and_dwell(store_cfg):
    store_cfg.set_geometry("zone", "ZONE_A",
                           [[0, 0], [400, 0], [400, 400], [0, 400]], name="Beverages")
    sa = ShopperAnalytics("cam_test")
    sa.update([track(1, 100, 100)])
    sa.update([track(1, 150, 150)])
    time.sleep(0.15)
    sa.update([track(1, 200, 200)])
    zones = {z["zone_id"]: z for z in sa.zone_metrics()}
    assert zones["ZONE_A"]["unique_visitors"] == 1
    assert zones["ZONE_A"]["current_occupancy"] == 1
    assert zones["ZONE_A"]["visits"] == 1


def test_zone_exit_reduces_occupancy(store_cfg):
    store_cfg.set_geometry("zone", "ZONE_A", [[0, 0], [400, 0], [400, 400], [0, 400]])
    sa = ShopperAnalytics("cam_test")
    sa.update([track(1, 100, 100)])
    sa.update([track(1, 700, 700)])  # left the zone
    zones = {z["zone_id"]: z for z in sa.zone_metrics()}
    assert zones["ZONE_A"]["current_occupancy"] == 0
    assert zones["ZONE_A"]["unique_visitors"] == 1


# -------------------------------------------------------------------------- queue
def test_queue_membership_by_polygon(store_cfg):
    store_cfg.set_geometry("queue", "Q1", [[0, 0], [400, 0], [400, 500], [0, 500]],
                           counter_id="C1")
    qa = QueueAnalytics("cam_test")
    qa.update([track(1, 100, 100), track(2, 150, 150), track(3, 700, 700)])
    m = {q["queue_id"]: q for q in qa.metrics()}["Q1"]
    assert m["queue_length"] == 2
    assert m["counter_id"] == "C1"


def test_queue_departure_records_wait(store_cfg):
    store_cfg.set_geometry("queue", "Q1", [[0, 0], [400, 0], [400, 500], [0, 500]])
    qa = QueueAnalytics("cam_test")
    qa.update([track(5, 100, 100)])
    time.sleep(0.05)
    qa.update([track(5, 100, 100)])
    qa.update([])  # person leaves
    m = qa.metrics()[0]
    assert m["queue_length"] == 0
    assert m["service_rate_per_min"] > 0  # one real departure observed


def test_queue_length_zero_when_empty(store_cfg):
    store_cfg.set_geometry("queue", "Q1", [[0, 0], [400, 0], [400, 500], [0, 500]])
    qa = QueueAnalytics("cam_test")
    qa.update([])
    assert qa.metrics()[0]["queue_length"] == 0
