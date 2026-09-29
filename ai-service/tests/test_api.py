"""API integration tests: endpoints respond factually without real models/cameras."""
from __future__ import annotations


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] in ("OK", "DEGRADED")
    assert body["device"] in ("cpu",) or body["device"].startswith("cuda")


def test_camera_lifecycle(client):
    # stop (idempotent)
    r = client.post("/camera/stop")
    assert r.status_code == 200
    assert r.json()["status"] == "STOPPED"

    # status
    r = client.get("/camera/status")
    assert r.status_code == 200
    assert r.json()["status"] in ("STOPPED", "RUNNING", "CAMERA_OFFLINE", "ERROR")

    # start with a source that cannot exist on CI → must fail gracefully
    r = client.post("/camera/start", json={"source": "/nonexistent/nope.mp4"})
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is False or body["status"] in ("CAMERA_OFFLINE", "ERROR")
    # server still alive
    assert client.get("/health").status_code == 200


def test_stream_placeholder(client):
    """The stream is an infinite MJPEG response; verify wiring via OpenAPI
    without consuming the infinite body."""
    r = client.get("/openapi.json")
    assert r.status_code == 200
    paths = r.json()["paths"]
    assert "/camera/stream" in paths
    assert "/camera/start" in paths and "/camera/stop" in paths
    assert "/metrics/live" in paths and "/queue/prediction" in paths


def test_shopper_metrics_no_camera(client):
    r = client.get("/shopper/metrics")
    assert r.status_code == 200
    body = r.json()
    assert body["data_status"] == "DATA_NOT_AVAILABLE"  # honest, not zeros-pretending


def test_shopper_heatmap_no_data(client):
    r = client.get("/shopper/heatmap")
    assert r.status_code == 200
    body = r.json()
    assert body["format"] == "DATA_NOT_AVAILABLE"


def test_inventory_status_empty(client, store_cfg):
    r = client.get("/inventory/status")
    assert r.status_code == 200
    body = r.json()
    assert body["data_status"] == "NO_DATA"
    assert body["products"] == []


def test_inventory_status_with_planogram(client, store_cfg):
    """Planogram configured but camera never processed frames → honest NO_DATA."""
    store_cfg.upsert_rack("R1")
    store_cfg.upsert_shelf("R1_S1", "R1", [[0, 0], [100, 0], [100, 50], [0, 50]])
    store_cfg.upsert_planogram_item({"rack_id": "R1", "shelf_id": "R1_S1",
                                     "position": 1, "product_id": "P1",
                                     "expected_facing": 5})
    r = client.get("/inventory/status")
    assert r.status_code == 200
    body = r.json()
    assert body["data_status"] == "NO_DATA"
    assert body["products"] == []  # no camera frames yet — never fabricate rows


def test_queue_prediction_untrained(client, store_cfg):
    r = client.get("/queue/prediction")
    assert r.status_code == 200
    body = r.json()
    assert body["prediction"] in ("MODEL_NOT_TRAINED", "DATA_NOT_AVAILABLE")


def test_queue_train_without_data(client):
    r = client.post("/queue/train")
    body = r.json()
    # no observations in fresh DB → honest refusal
    assert body["ok"] is False
    assert "observation" in body.get("error", "").lower() or "no real" in body.get("error", "").lower()


def test_config_endpoints(client, store_cfg):
    r = client.post("/config/geometry", json={
        "kind": "zone", "id": "Z1", "points": [[0, 0], [10, 0], [10, 10], [0, 10]],
        "name": "Test Zone"})
    assert r.status_code == 200
    r = client.get("/config")
    assert any(z["id"] == "Z1" for z in r.json()["zones"])

    r = client.post("/config/racks", json={"rack_id": "R1", "name": "Beverages"})
    assert r.status_code == 200
    r = client.post("/config/shelves", json={
        "shelf_id": "R1_S1", "rack_id": "R1",
        "polygon": [[0, 0], [10, 0], [10, 10], [0, 10]]})
    assert r.status_code == 200
    r = client.get("/racks")
    assert r.status_code == 200
    assert r.json()["racks"][0]["rack_id"] == "R1"

    r = client.post("/config/products", json={
        "product_id": "P1", "name": "Test Product", "expected_facing": 8,
        "minimum_facing": 3})
    assert r.status_code == 200
    r = client.post("/config/planogram", json={
        "rack_id": "R1", "shelf_id": "R1_S1", "position": 1, "product_id": "P1",
        "expected_facing": 8})
    assert r.status_code == 200


def test_alerts_flow(client, store_cfg, fresh_db):
    from app.alerts.engine import AlertEngine

    eng = AlertEngine(store_id="STORE_001")
    eng.fire("OUT_OF_STOCK", shelf_id="R1_S1", product_id="P1")
    r = client.get("/alerts")
    assert r.status_code == 200
    body = r.json()
    assert body["open_count"] >= 1
    alert_id = body["alerts"][0]["alert_id"]
    r = client.post(f"/alerts/{alert_id}/resolve", json={"resolved_by": "test"})
    assert r.status_code == 200
    r = client.get("/alerts")
    assert r.json()["open_count"] == 0


def test_metrics_live_no_camera(client):
    r = client.get("/metrics/live")
    assert r.status_code == 200
    assert r.json()["status"] == "DATA_NOT_AVAILABLE"


def test_video_unknown_id(client):
    r = client.get("/video/status/doesnotexist")
    assert r.status_code == 404
