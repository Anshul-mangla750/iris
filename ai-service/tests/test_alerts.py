"""Unit tests: alert engine (debounce, persistence, resolution)."""
from __future__ import annotations

import time


def test_alert_fires_and_persists(store_cfg, fresh_db):
    from app.alerts.engine import AlertEngine

    eng = AlertEngine(store_id="STORE_T")
    a = eng.fire("OUT_OF_STOCK", shelf_id="S1", product_id="P1", severity="CRITICAL")
    assert a is not None
    assert a.status == "OPEN"
    rows = eng.recent()
    assert any(r["alert_id"] == a.alert_id for r in rows)


def test_alert_debounce_same_key(store_cfg, fresh_db):
    from app.alerts.engine import AlertEngine

    eng = AlertEngine(store_id="STORE_T")
    a1 = eng.fire("LOW_STOCK", shelf_id="S1", product_id="P1")
    a2 = eng.fire("LOW_STOCK", shelf_id="S1", product_id="P1")  # within debounce
    assert a1 is not None and a2 is None


def test_alert_debounce_different_keys(store_cfg, fresh_db):
    from app.alerts.engine import AlertEngine

    eng = AlertEngine(store_id="STORE_T")
    a1 = eng.fire("LOW_STOCK", shelf_id="S1", product_id="P1")
    a2 = eng.fire("LOW_STOCK", shelf_id="S2", product_id="P1")
    assert a1 is not None and a2 is not None


def test_alert_debounce_expiry(store_cfg, fresh_db, monkeypatch):
    from app.alerts import engine as alert_engine_mod

    # shrink debounce window via settings
    from app.core.config import settings as cfg

    monkeypatch.setattr(cfg, "alert_debounce_seconds", 0.05)
    eng = alert_engine_mod.AlertEngine(store_id="STORE_T")
    a1 = eng.fire("EMPTY_SHELF", shelf_id="S9")
    time.sleep(0.1)
    a2 = eng.fire("EMPTY_SHELF", shelf_id="S9")
    assert a1 is not None and a2 is not None


def test_resolve_alert(store_cfg, fresh_db):
    from app.alerts.engine import AlertEngine

    eng = AlertEngine(store_id="STORE_T")
    a = eng.fire("OUT_OF_STOCK", shelf_id="S1", product_id="P1")
    assert eng.resolve(a.alert_id, resolved_by="tester")
    rows = eng.recent()
    assert all(r["status"] == "RESOLVED" for r in rows if r["alert_id"] == a.alert_id)


def test_auto_resolve_oos(store_cfg, fresh_db):
    from app.alerts.engine import AlertEngine

    eng = AlertEngine(store_id="STORE_T")
    eng.fire("OUT_OF_STOCK", shelf_id="S1", product_id="P1")
    n = eng.auto_resolve("OUT_OF_STOCK", shelf_id="S1", product_id="P1")
    assert n == 1


def test_oos_event_bridging(store_cfg, fresh_db):
    from app.alerts.engine import AlertEngine

    eng = AlertEngine(store_id="STORE_T")
    a = eng.fire_from_inventory_event({
        "type": "OUT_OF_STOCK", "shelf_id": "S2", "rack_id": "R1",
        "product_id": "P2", "absent_seconds": 12, "expected_facing": 4,
    })
    assert a is not None and a.alert_type == "OUT_OF_STOCK"
