"""End-to-end integration: pipeline logic with real frames but no custom weights.

The person model (COCO) may load; product/rack/shelf weights don't exist in the
repo, so those detectors must return [] and analytics must stay honest (NO_DATA)
without crashing — the 'graceful degradation' requirement (spec §40, §42).
"""
from __future__ import annotations

import numpy as np
import pytest


@pytest.fixture()
def pipeline(store_cfg, fresh_db):
    from app.pipelines.live_camera import LiveCameraPipeline

    store_cfg.set_geometry("queue", "Q1", [[0, 0], [300, 0], [300, 300], [0, 300]])
    store_cfg.upsert_rack("R1")
    store_cfg.upsert_shelf("R1_S1", "R1", [[500, 100], [700, 100], [700, 200], [500, 200]])
    p = LiveCameraPipeline(camera_id="cam_test", source=0)
    yield p
    p.stop()


def test_pipeline_processes_synthetic_frame_without_models(pipeline):
    """Full annotate+analytics path on a plain synthetic frame.

    Uses the internal _annotate/update path (not the capture thread) so the test
    does not require a physical camera."""
    frame = np.zeros((720, 1280, 3), dtype=np.uint8)
    frame[200:400, 200:400] = (40, 40, 60)  # something to look at

    tracks, dets = pipeline.tracker.update(frame)
    # model may be READY (coco) or NOT_TRAINED (weights missing) — neither may crash
    assert isinstance(tracks, list) and isinstance(dets, list)

    events = pipeline.shopper.update(tracks)
    assert isinstance(events, list)
    pipeline.queue.update(tracks)

    product_dets = pipeline.product_detector.detect(frame)
    assert product_dets == []  # weights absent → no fabricated detections

    m = pipeline.live_metrics()
    assert m["camera"]["status"] in ("STOPPED", "RUNNING")
    assert m["detections"]["products"] == 0
    assert m["inventory"]["products"] == [] or isinstance(m["inventory"]["products"], list)


def test_inventory_flow_with_fake_detections(pipeline):
    """Inventory engine with real Detection objects (test-only synthetic boxes)."""
    from app.models.detections import Detection

    dets = [Detection(bbox=(520 + i * 40, 130, 550 + i * 40, 170), confidence=0.9,
                      class_id=0, class_name="product") for i in range(4)]
    recognized = {i: "coke_500ml" for i in range(4)}
    pipeline.store_config.upsert_product({
        "product_id": "coke_500ml", "sku": "COKE", "name": "Coke 500ml",
        "expected_facing": 8, "minimum_facing": 3, "maximum_facing": 16,
    })
    pipeline.store_config.upsert_planogram_item({
        "rack_id": "R1", "shelf_id": "R1_S1", "position": 1,
        "product_id": "coke_500ml", "expected_facing": 8,
    })
    events = pipeline.inventory.observe(dets, recognized, (1280, 720))
    assert isinstance(events, list)
    status = {s.product_id: s for s in pipeline.inventory.product_status()}
    assert status["coke_500ml"].detected_facing == 4
    # 4 > minimum(3) but < expected(8) → REPLENISHMENT_REQUIRED
    assert status["coke_500ml"].status == "REPLENISHMENT_REQUIRED"


def test_camera_open_failure_is_graceful(store_cfg, fresh_db):
    from app.pipelines.live_camera import LiveCameraPipeline

    p = LiveCameraPipeline(camera_id="cam_bad", source="/nonexistent/x.mp4")
    ok, msg = p.start()
    assert ok is False
    assert p.status == "CAMERA_OFFLINE"
    assert p.error  # error message present
    p.stop()
    assert p.status == "STOPPED"
