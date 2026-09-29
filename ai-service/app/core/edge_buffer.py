"""Edge/offline buffer: SQLite storage of events+alerts when backend is unreachable.

The primary AI inference never requires the cloud. When DATABASE write or backend
sync fails, records land here and are flushed on connectivity recovery.
"""
from __future__ import annotations

import json
import sqlite3
import threading
import time
from pathlib import Path

from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger(__name__)


class EdgeBuffer:
    def __init__(self, path: Path | None = None) -> None:
        self.path = Path(path or settings.edge_sqlite_path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._init_db()

    def _init_db(self) -> None:
        with self._conn() as c:
            c.execute("""CREATE TABLE IF NOT EXISTS buffer (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                kind TEXT NOT NULL,
                payload TEXT NOT NULL,
                created_at REAL NOT NULL,
                synced INTEGER DEFAULT 0
            )""")

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path, timeout=10)
        conn.execute("PRAGMA journal_mode=WAL")
        return conn

    # --------------------------------------------------------------- write
    def put_alert(self, alert: dict) -> None:
        self._put("alert", alert)

    def put_event(self, event: dict) -> None:
        self._put("event", event)

    def put_metrics(self, metrics: dict) -> None:
        self._put("metrics", metrics)

    def put_queue_observation(self, obs: dict) -> None:
        self._put("queue_observation", obs)

    def _put(self, kind: str, payload: dict) -> None:
        with self._lock:
            with self._conn() as c:
                c.execute("INSERT INTO buffer (kind, payload, created_at) VALUES (?, ?, ?)",
                          (kind, json.dumps(payload), time.time()))

    # ---------------------------------------------------------------- sync
    def pending_count(self) -> int:
        with self._conn() as c:
            return c.execute("SELECT COUNT(*) FROM buffer WHERE synced=0").fetchone()[0]

    def flush(self, sender) -> int:
        """Send unsynced rows via `sender(kind, payload) -> bool`; marks synced on success."""
        sent = 0
        with self._lock:
            with self._conn() as c:
                rows = c.execute(
                    "SELECT id, kind, payload FROM buffer WHERE synced=0 ORDER BY id").fetchall()
                for rid, kind, payload in rows:
                    try:
                        if sender(kind, json.loads(payload)):
                            c.execute("UPDATE buffer SET synced=1 WHERE id=?", (rid,))
                            sent += 1
                    except Exception as exc:
                        logger.warning("flush failed for %s#%s: %s", kind, rid, exc)
                        break
            # retention: drop synced rows older than retention window
            cutoff = time.time() - settings.privacy_retention_days * 86400
            with self._conn() as c2:
                c2.execute("DELETE FROM buffer WHERE synced=1 AND created_at < ?", (cutoff,))
        return sent

    def stats(self) -> dict:
        with self._conn() as c:
            total = c.execute("SELECT COUNT(*) FROM buffer").fetchone()[0]
            pending = c.execute("SELECT COUNT(*) FROM buffer WHERE synced=0").fetchone()[0]
        return {"total": total, "pending_sync": pending, "path": str(self.path)}


_edge_buffer: EdgeBuffer | None = None


def get_edge_buffer() -> EdgeBuffer:
    global _edge_buffer
    if _edge_buffer is None:
        _edge_buffer = EdgeBuffer()
    return _edge_buffer
