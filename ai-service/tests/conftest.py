"""Pytest fixtures: isolated DB + store config per test session."""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "ai-service"))

# Isolated environment BEFORE app imports.
# DATABASE_URL must be ABSOLUTE: sqlite cannot create missing parent dirs, and a
# relative path breaks whenever the cwd (or ./data) doesn't exist — e.g. pipeline
# start paths that write an alert row during tests.
_TEST_DIR = Path(tempfile.mkdtemp(prefix="retailedge_test_"))
_TEST_DIR.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("DATABASE_URL", f"sqlite:///{(_TEST_DIR / 'test_retailedge.db').as_posix()}")
os.environ.setdefault("ALERT_DEBOUNCE_SECONDS", "1")
os.environ.setdefault("OUT_OF_STOCK_CONFIRMATION_SECONDS", "0.5")


@pytest.fixture()
def store_cfg(tmp_path):
    """Fresh StoreConfig in a temp dir."""
    from app.core import store_config as sc

    cfg = sc.StoreConfig(path=tmp_path / "store_config.json")
    old = sc._store_config
    sc._store_config = cfg
    yield cfg
    sc._store_config = old


@pytest.fixture()
def fresh_db(tmp_path, monkeypatch):
    """Isolated database per test."""
    from app.core.config import settings
    from app.database import models as dbm

    url = f"sqlite:///{tmp_path / 'test.db'}"
    db = dbm.Database(url)
    db.create_all()
    monkeypatch.setattr(dbm, "_database", db)
    yield db
    db.engine.dispose()


@pytest.fixture()
def client(store_cfg, fresh_db):
    """FastAPI TestClient with isolated state."""
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        yield c
