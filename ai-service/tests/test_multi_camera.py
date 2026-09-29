"""Multi-camera upgrade tests: per-camera queue filter, camera registry, manager lifecycle."""
from __future__ import annotations

from pathlib import Path

import pytest


@pytest.fixture()
def isolated_store_config(tmp_path, monkeypatch):
    """Point StoreConfig at a temp JSON so tests never touch real store config.

    Patches BOTH the defining module and every importer that bound the name at
    import time (queue.py, live_camera.py) — order-independent isolation.
    """
    from app.core import store_config as sc

    cfg = sc.StoreConfig(path=tmp_path / "store_config.json")
    monkeypatch.setattr(sc, "get_store_config", lambda: cfg)
    import app.analytics.queue as qmod
    import app.pipelines.live_camera as lcmod

    monkeypatch.setattr(qmod, "get_store_config", lambda: cfg, raising=False)
    monkeypatch.setattr(lcmod, "get_store_config", lambda: cfg, raising=False)
    yield cfg


def test_queue_filter_by_camera(isolated_store_config):
    """A queue assigned to cam_1 must not appear on cam_0's analytics (no double-count)."""
    from app.analytics.queue import QueueAnalytics
    from app.core.store_config import get_store_config

    get_store_config().set_geometry(
        "queue", "q_left", [[0, 0], [10, 0], [10, 10], [0, 10]],
        counter_id="c1", camera_id="cam_0")
    get_store_config().set_geometry(
        "queue", "q_right", [[20, 0], [30, 0], [30, 10], [20, 10]],
        counter_id="c2", camera_id="cam_1")
    get_store_config().set_geometry(
        "queue", "q_shared", [[40, 0], [50, 0], [50, 10], [40, 10]])  # unassigned

    a0 = QueueAnalytics(camera_id="cam_0")
    a1 = QueueAnalytics(camera_id="cam_1")
    assert {q.queue_id for q in a0.queues.values()} == {"q_left", "q_shared"}
    assert {q.queue_id for q in a1.queues.values()} == {"q_right", "q_shared"}


def test_camera_registry_roundtrip(isolated_store_config):
    from app.core.store_config import get_store_config

    get_store_config().upsert_camera("cam_1", source="rtsp://x", role="queue", name="Counter 1")
    get_store_config().upsert_camera("cam_2", source="1", role="shelf")
    cams = get_store_config().get_cameras()
    assert [c["camera_id"] for c in cams] == ["cam_1", "cam_2"]
    assert cams[0]["source"] == "rtsp://x"
    # upsert updates in place
    get_store_config().upsert_camera("cam_1", source="rtsp://y", role="queue")
    cams = get_store_config().get_cameras()
    assert len(cams) == 2 and cams[0]["source"] == "rtsp://y"


def test_pipeline_manager_multi_camera(isolated_store_config):
    """Manager holds per-camera pipelines; stop(None) stops all; live property works."""
    from app.pipelines.live_camera import PipelineManager

    pm = PipelineManager()
    assert pm.live is None

    # start two cameras on non-existent sources → pipelines registered, start fails honestly
    r1 = pm.start_live(source="definitely-not-a-source", camera_id="cam_0")
    r2 = pm.start_live(source="definitely-not-a-source", camera_id="cam_1")
    assert r1[0] is False and r2[0] is False  # honest CAMERA_OFFLINE
    assert set(pm.pipelines.keys()) == {"cam_0", "cam_1"}
    assert pm.live is pm.pipelines["cam_0"]  # backward-compat primary

    # per-camera status
    assert pm.live_status("cam_1")["status"] == "CAMERA_OFFLINE"
    assert pm.live_status("nope")["status"] == "STOPPED"
    assert {s["camera_id"] for s in pm.status_all()} == {"cam_0", "cam_1"}

    pm.stop_live("cam_1")
    assert pm.pipelines["cam_1"].status == "STOPPED"
    pm.stop_live(None)  # stop ALL
    assert all(p.status == "STOPPED" for p in pm.pipelines.values())
