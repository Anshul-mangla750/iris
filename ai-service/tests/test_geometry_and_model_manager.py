"""Unit tests: geometry, ModelManager honesty, queue labeling, edge buffer."""
from __future__ import annotations

from pathlib import Path

import pytest


# ------------------------------------------------------------------- geometry
def test_point_in_polygon():
    from app.core.geometry import point_in_polygon

    poly = [[0, 0], [10, 0], [10, 10], [0, 10]]
    assert point_in_polygon((5, 5), poly)
    assert not point_in_polygon((15, 5), poly)
    assert not point_in_polygon((5, -1), poly)


def test_crossed_line_direction():
    from app.core.geometry import crossed_line, line_direction

    a, b = (300, 0), (300, 720)
    assert crossed_line((250, 400), (350, 400), a, b)
    assert not crossed_line((250, 400), (290, 400), a, b)
    assert line_direction((250, 400), (350, 400), a, b) != 0


def test_polygon_area():
    from app.core.geometry import polygon_area

    assert polygon_area([[0, 0], [10, 0], [10, 10], [0, 10]]) == pytest.approx(100.0)


def test_bbox_iou():
    from app.core.geometry import bbox_iou

    assert bbox_iou((0, 0, 10, 10), (0, 0, 10, 10)) == pytest.approx(1.0)
    assert bbox_iou((0, 0, 10, 10), (20, 20, 30, 30)) == 0.0


# -------------------------------------------------------------- model manager
def test_model_manager_reports_not_trained(fresh_db, tmp_path, monkeypatch):
    from app.models.model_manager import get_model_manager

    mm = get_model_manager()
    info = mm.get("PRODUCT_MODEL")
    # point at a guaranteed-missing path so the NOT_TRAINED path is deterministic
    monkeypatch.setattr(info, "path", tmp_path / "missing_product.pt")
    info.status = "NOT_TRAINED"
    info.loaded_obj = None
    mm.load("PRODUCT_MODEL")  # weights do not exist at the patched path
    assert info.status == "NOT_TRAINED"
    assert info.loaded_obj is None
    assert "not found" in (info.detail or "")


def test_model_status_endpoint_honest(client):
    r = client.get("/models/status")
    assert r.status_code == 200
    models = r.json()["models"]
    by_name = {m["name"]: m for m in models}
    # person model may be READY (coco weights) or NOT_TRAINED — but must never lie
    assert by_name["PERSON_MODEL"]["status"] in ("READY", "NOT_TRAINED", "ERROR")
    assert by_name["PRODUCT_MODEL"]["status"] in ("READY", "NOT_TRAINED", "ERROR")
    # status must match reality: weights present → READY/ERROR, absent → NOT_TRAINED
    product = by_name["PRODUCT_MODEL"]
    weights_exist = Path(product["path"]).exists()
    if weights_exist:
        assert product["status"] in ("READY", "ERROR")
    else:
        assert product["status"] == "NOT_TRAINED"


# ------------------------------------------------------------------ queue ML
def test_queue_label_thresholds():
    from app.queue.model import label_from_thresholds

    assert label_from_thresholds(2, high=10, warning=5) == "NORMAL"
    assert label_from_thresholds(7, high=10, warning=5) == "WARNING"
    assert label_from_thresholds(12, high=10, warning=5) == "HIGH"


def test_queue_model_predicts_not_trained():
    from app.queue.model import QueueCongestionModel

    m = QueueCongestionModel()
    # ensure weights absent
    from app.core.config import settings

    if not settings.queue_model_path.exists():
        res = m.predict({"queue_length": 8, "arrival_rate": 3.0, "service_rate": 2.0,
                         "hour": 10, "day_of_week": 2})
        assert res["prediction"] == "MODEL_NOT_TRAINED"


def test_queue_model_refuses_single_class():
    from app.queue.model import QueueCongestionModel

    rows = [{"queue_length": i % 3, "arrival_rate": 1.0, "service_rate": 1.0,
             "active_counters": 1, "average_wait": 0.0, "rolling_queue_5m": 1.0,
             "rolling_queue_10m": 1.0, "hour": 9, "day_of_week": 1, "label": "NORMAL"}
            for i in range(40)]
    res = QueueCongestionModel().train(rows)
    assert res["ok"] is False
    assert "single label" in res["error"] or "one label" in res["error"]


def test_queue_model_trains_on_synthetic_two_class(tmp_path, monkeypatch):
    """Training sanity using generated TWO-CLASS rows (test-only fixture, clearly
    labeled as such; production training reads real queue_observations)."""
    from app.core.config import settings
    from app.queue.model import QueueCongestionModel

    # keep test artifacts inside tmp_path (never pollute repo models/)
    monkeypatch.setattr(settings, "queue_model_path", tmp_path / "queue.joblib")
    monkeypatch.setattr(settings, "queue_model_scaler_path", tmp_path / "queue_scaler.joblib")

    rows = []
    for i in range(60):
        long_queue = i % 2 == 0
        rows.append({
            "queue_length": 12 if long_queue else 1,
            "arrival_rate": 8.0 if long_queue else 0.5,
            "service_rate": 1.0, "active_counters": 1,
            "average_wait": 90.0 if long_queue else 5.0,
            "rolling_queue_5m": 11.0 if long_queue else 1.0,
            "rolling_queue_10m": 10.0 if long_queue else 1.0,
            "hour": 18 if long_queue else 11, "day_of_week": 4,
            "label": "HIGH" if long_queue else "NORMAL",
        })
    res = QueueCongestionModel().train(rows)
    assert res["ok"] is True
    assert res["metrics"]["accuracy"] >= 0.9  # trivially separable fixture


# ---------------------------------------------------------------- edge buffer
def test_edge_buffer_roundtrip(tmp_path):
    from app.core.edge_buffer import EdgeBuffer

    buf = EdgeBuffer(path=tmp_path / "edge.db")
    buf.put_alert({"alert_id": "a1"})
    buf.put_event({"type": "ENTRY"})
    assert buf.pending_count() == 2
    sent = []
    n = buf.flush(lambda kind, payload: (sent.append((kind, payload)) or True))
    assert n == 2 and len(sent) == 2
    assert buf.pending_count() == 0


# ---------------------------------------------------------------- recognizer
def test_recognizer_no_reference_data(store_cfg):
    from app.models.product_recognizer import ProductRecognizer

    import numpy as np

    rec = ProductRecognizer()
    img = np.zeros((60, 60, 3), dtype=np.uint8)
    res = rec.recognize(img)
    assert res.status in ("NO_REFERENCE_DATA", "BELOW_THRESHOLD")
    assert res.product_id is None  # never guesses
