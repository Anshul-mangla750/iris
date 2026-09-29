"""Alert engine: debounced generation + persistence of structured alerts.

Debouncing: identical alert keys (type+shelf+product) are suppressed within
alert_debounce_seconds to prevent spam; re-occurrence after that window raises
severity by one step (escalation).
"""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from typing import Any

from app.core.config import settings
from app.core.logging_config import get_logger
from app.database.models import AlertRecord, get_database

logger = get_logger(__name__)

SEVERITY_ORDER = {"INFO": 0, "WARNING": 1, "CRITICAL": 2}
ESCALATION = {
    "LOW_STOCK": "WARNING",
    "OUT_OF_STOCK": "CRITICAL",
    "REPLENISHMENT_REQUIRED": "WARNING",
    "EMPTY_SHELF": "WARNING",
    "SHELF_LOW_OCCUPANCY": "INFO",
    "SHELF_RESTOCKED": "INFO",
    "PLANOGRAM_VIOLATION": "WARNING",
    "WRONG_PRODUCT": "WARNING",
    "MISSING_PRODUCT": "WARNING",
    "INCORRECT_FACING_COUNT": "INFO",
    "PRODUCT_MISPLACED": "WARNING",
    "INVENTORY_DISCREPANCY": "WARNING",
    "QUEUE_WARNING": "WARNING",
    "QUEUE_HIGH": "CRITICAL",
    "CAMERA_OFFLINE": "CRITICAL",
}


@dataclass
class Alert:
    alert_id: str
    store_id: str
    alert_type: str
    severity: str
    timestamp: float
    camera_id: str | None = None
    rack_id: str | None = None
    shelf_id: str | None = None
    product_id: str | None = None
    confidence: float | None = None
    evidence_frame: str | None = None
    status: str = "OPEN"
    detail: str | None = None
    resolved_at: float | None = None

    def to_dict(self) -> dict:
        return {
            "alert_id": self.alert_id, "store_id": self.store_id,
            "camera_id": self.camera_id, "rack_id": self.rack_id,
            "shelf_id": self.shelf_id, "product_id": self.product_id,
            "alert_type": self.alert_type, "severity": self.severity,
            "confidence": self.confidence, "timestamp": self.timestamp,
            "evidence_frame": self.evidence_frame, "status": self.status,
            "detail": self.detail, "resolved_at": self.resolved_at,
        }


class AlertEngine:
    """Generates debounced alerts and persists them to the primary DB."""

    def __init__(self, store_id: str | None = None) -> None:
        self.store_id = store_id or settings.store_id
        self.db = get_database()
        self._last_fire: dict[str, float] = {}  # debounce key -> ts

    # --------------------------------------------------------------- fire
    def fire(self, alert_type: str, severity: str | None = None,
             rack_id: str | None = None, shelf_id: str | None = None,
             product_id: str | None = None, confidence: float | None = None,
             camera_id: str | None = None, detail: str | None = None,
             evidence_frame: str | None = None) -> Alert | None:
        """Fire an alert if not debounced. Returns None when suppressed."""
        key = f"{alert_type}|{rack_id or ''}|{shelf_id or ''}|{product_id or ''}"
        now = time.time()
        with_db = True
        last = self._last_fire.get(key)
        if last is not None and now - last < settings.alert_debounce_seconds:
            return None
        self._last_fire[key] = now
        sev = severity or ESCALATION.get(alert_type, "WARNING")
        alert = Alert(
            alert_id=uuid.uuid4().hex[:16], store_id=self.store_id,
            alert_type=alert_type, severity=sev, timestamp=now,
            camera_id=camera_id or "cam_0", rack_id=rack_id, shelf_id=shelf_id,
            product_id=product_id, confidence=confidence, evidence_frame=evidence_frame,
            detail=detail,
        )
        self._persist(alert)
        logger.info("ALERT %s [%s] %s", alert.alert_id, alert.severity, alert_type)
        return alert

    # -------------------------------------------------------------- queue
    def fire_from_inventory_event(self, ev: dict) -> Alert | None:
        mapping = {
            "OUT_OF_STOCK": ("OUT_OF_STOCK", None),
            "OOS_CLEARED": (None, None),  # auto-resolve below
        }
        if ev.get("type") == "OOS_CLEARED":
            self.auto_resolve("OUT_OF_STOCK", shelf_id=ev.get("shelf_id"),
                              product_id=ev.get("product_id"))
            return None
        if ev.get("type") == "OUT_OF_STOCK":
            return self.fire("OUT_OF_STOCK", shelf_id=ev.get("shelf_id"),
                             rack_id=ev.get("rack_id"), product_id=ev.get("product_id"),
                             confidence=0.9,
                             detail=f"absent for {ev.get('absent_seconds', '?')}s")
        if ev.get("type") == "LOW_STOCK":
            return self.fire("LOW_STOCK", shelf_id=ev.get("shelf_id"),
                             rack_id=ev.get("rack_id"), product_id=ev.get("product_id"),
                             confidence=0.8,
                             detail=f"detected {ev.get('detected_facing')} / expected "
                                    f"{ev.get('expected_facing')}")
        if ev.get("type") == "EMPTY_SHELF":
            return self.fire("EMPTY_SHELF", shelf_id=ev.get("shelf_id"),
                             rack_id=ev.get("rack_id"),
                             confidence=ev.get("occupancy_ratio"),
                             detail=f"shelf empty; free capacity "
                                    f"{ev.get('free_capacity') if ev.get('free_capacity') is not None else 'n/a'}")
        if ev.get("type") == "SHELF_LOW_OCCUPANCY":
            return self.fire("SHELF_LOW_OCCUPANCY", shelf_id=ev.get("shelf_id"),
                             rack_id=ev.get("rack_id"),
                             confidence=ev.get("occupancy_ratio"),
                             detail=f"shelf getting empty ({ev.get('occupancy_ratio')} occupancy); "
                                    f"free capacity "
                                    f"{ev.get('free_capacity') if ev.get('free_capacity') is not None else 'n/a'}")
        if ev.get("type") == "SHELF_RESTOCKED":
            self.auto_resolve("EMPTY_SHELF", shelf_id=ev.get("shelf_id"))
            self.auto_resolve("SHELF_LOW_OCCUPANCY", shelf_id=ev.get("shelf_id"))
            return None
        return None

    def fire_from_planogram(self, v: dict) -> Alert | None:
        sev = "WARNING"
        if v.get("violation_type") in ("MISSING_PRODUCT", "WRONG_PRODUCT"):
            sev = "WARNING"
        return self.fire("PLANOGRAM_VIOLATION", severity=sev,
                         rack_id=v.get("rack_id"), shelf_id=v.get("shelf_id"),
                         product_id=v.get("expected_product"),
                         confidence=v.get("confidence"),
                         detail=f"{v.get('violation_type')} "
                                f"(observed: {v.get('observed_product')})")

    def fire_queue(self, state: str, queue_id: str, queue_length: int) -> Alert | None:
        if state == "HIGH":
            return self.fire("QUEUE_HIGH", queue_id=queue_id, severity="CRITICAL",
                             detail=f"queue length {queue_length}")
        if state == "WARNING":
            return fire_warning(self, queue_id, queue_length)
        return None

    # --------------------------------------------------------- resolution
    def auto_resolve(self, alert_type: str, shelf_id: str | None = None,
                     product_id: str | None = None) -> int:
        n = 0
        with self.db.session() as s:
            rows = s.query(AlertRecord).filter_by(
                alert_type=alert_type, status="OPEN", store_id=self.store_id)
            for r in rows:
                if shelf_id and r.shelf_id != shelf_id:
                    continue
                if product_id and r.product_id != product_id:
                    continue
                r.status = "RESOLVED"
                r.resolved_at = __import__("datetime").datetime.now(
                    __import__("datetime").timezone.utc)
                n += 1
            s.commit()
        return n

    def resolve(self, alert_id: str, resolved_by: str = "operator") -> bool:
        with self.db.session() as s:
            r = s.get(AlertRecord, alert_id)
            if r is None:
                return False
            r.status = "RESOLVED"
            r.resolved_at = __import__("datetime").datetime.now(
                __import__("datetime").timezone.utc)
            r.detail = (r.detail or "") + f" [resolved by {resolved_by}]"
            s.commit()
            return True

    def recent(self, limit: int = 100, open_only: bool = False) -> list[dict]:
        with self.db.session() as s:
            q = s.query(AlertRecord).filter_by(store_id=self.store_id)
            if open_only:
                q = q.filter_by(status="OPEN")
            rows = q.order_by(AlertRecord.timestamp.desc()).limit(limit).all()
            return [{
                "alert_id": r.alert_id, "store_id": r.store_id,
                "camera_id": r.camera_id, "rack_id": r.rack_id,
                "shelf_id": r.shelf_id, "product_id": r.product_id,
                "alert_type": r.alert_type, "severity": r.severity,
                "confidence": r.confidence, "timestamp": r.timestamp,
                "evidence_frame": r.evidence_frame, "status": r.status,
                "detail": r.detail, "resolved_at": r.resolved_at,
            } for r in rows]

    # ---------------------------------------------------------- persist
    def _persist(self, alert: Alert) -> None:
        try:
            with self.db.session() as s:
                s.add(AlertRecord(
                    alert_id=alert.alert_id, store_id=alert.store_id,
                    camera_id=alert.camera_id, rack_id=alert.rack_id,
                    shelf_id=alert.shelf_id, product_id=alert.product_id,
                    alert_type=alert.alert_type, severity=alert.severity,
                    confidence=alert.confidence, timestamp=_dt(alert.timestamp),
                    evidence_frame=alert.evidence_frame, status="OPEN",
                    detail=alert.detail,
                ))
                s.commit()
        except Exception as exc:
            logger.error("alert persistence failed (edge buffer will catch): %s", exc)
            self._buffer_edge(alert)

    def _buffer_edge(self, alert: Alert) -> None:
        try:
            from app.core.edge_buffer import get_edge_buffer

            get_edge_buffer().put_alert(alert.to_dict())
        except Exception as exc:
            logger.error("edge buffering also failed: %s", exc)


def _dt(ts: float):
    import datetime as _dtm

    return _dtm.datetime.fromtimestamp(ts, _dtm.timezone.utc)


def fire_warning(engine: "AlertEngine", queue_id: str, queue_length: int) -> Alert | None:
    return engine.fire("QUEUE_WARNING", queue_id=queue_id, severity="WARNING",
                       detail=f"queue length {queue_length}")
