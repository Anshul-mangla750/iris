"""Queue analytics: queue membership, length, arrival/service rates, wait estimation.

Only people actually detected inside configured queue polygons contribute.
Wait times come from ByteTrack track persistence inside the queue region.
"""
from __future__ import annotations

import time
from collections import defaultdict, deque
from dataclasses import dataclass, field

from app.core.config import settings
from app.core.geometry import bbox_bottom_center, point_in_polygon
from app.core.logging_config import get_logger
from app.core.store_config import get_store_config
from app.models.detections import Track

logger = get_logger(__name__)


@dataclass
class QueueMember:
    track_id: int
    joined_at: float
    last_seen: float


@dataclass
class QueueState:
    queue_id: str
    counter_id: str
    points: list
    members: dict[int, QueueMember] = field(default_factory=dict)
    served_intervals: deque = field(default_factory=lambda: deque(maxlen=50))  # wait durations
    join_times: deque = field(default_factory=lambda: deque(maxlen=100))
    length_history: deque = field(default_factory=lambda: deque(maxlen=300))  # (t, len)
    departure_log: deque = field(default_factory=lambda: deque(maxlen=100))

    # ------------------------------------------------------------ metrics
    def queue_length(self) -> int:
        return len(self.members)

    def arrival_rate_per_min(self, window_s: float = 120.0) -> float:
        now = time.time()
        joins = [t for t in self.join_times if now - t <= window_s]
        return round(len(joins) * 60.0 / window_s, 2)

    def service_rate_per_min(self, window_s: float = 300.0) -> float:
        now = time.time()
        deps = [t for t, _ in self.departure_log if now - t <= window_s]
        return round(len(deps) * 60.0 / window_s, 2)

    def average_wait_s(self) -> float:
        if self.served_intervals:
            return round(sum(self.served_intervals) / len(self.served_intervals), 1)
        return 0.0

    def estimated_wait_s(self) -> float:
        """Estimated wait = queue_length behind counter * average service time."""
        svc = self.service_rate_per_min()
        if svc <= 0:
            return 0.0
        return round(self.queue_length() * 60.0 / svc, 1)

    def rolling_avg(self, window_s: float) -> float:
        now = time.time()
        vals = [n for t, n in self.length_history if now - t <= window_s]
        return round(sum(vals) / len(vals), 2) if vals else 0.0


class QueueAnalytics:
    """Per-camera queue analytics over configured queue polygons."""

    def __init__(self, camera_id: str = "cam_0") -> None:
        self.camera_id = camera_id
        self.store_config = get_store_config()
        self.queues: dict[str, QueueState] = {}
        self._rebuild()

    def _rebuild(self) -> None:
        # Multi-camera: only queues assigned to THIS camera (or unassigned →
        # single-camera backward compat). Without the filter, every camera
        # would count the same physical queue and inflate queue_length.
        for q in self.store_config.get_queues():
            qcam = q.get("camera_id")
            if qcam not in (None, self.camera_id):
                continue
            if q["id"] not in self.queues:
                self.queues[q["id"]] = QueueState(
                    queue_id=q["id"],
                    counter_id=q.get("counter_id", f"{q['id']}_counter"),
                    points=q["points"],
                )

    def update(self, tracks: list[Track]) -> None:
        """Feed one frame of tracks; updates membership via entry/exit of polygons."""
        self._rebuild()
        now = time.time()
        for q in self.queues.values():
            current_ids: set[int] = set()
            for tr in tracks:
                foot = (tr.center_x, tr.bbox[3])
                if point_in_polygon(foot, q.points):
                    current_ids.add(tr.track_id)
                    if tr.track_id not in q.members:
                        q.members[tr.track_id] = QueueMember(tr.track_id, now, now)
                        q.join_times.append(now)
                    else:
                        q.members[tr.track_id].last_seen = now
            # departures (left polygon) or timeout (still present but stuck past service time)
            for tid in list(q.members):
                m = q.members[tid]
                if tid not in current_ids:
                    waited = now - m.joined_at
                    q.served_intervals.append(waited)
                    q.departure_log.append((now, waited))
                    del q.members[tid]
                elif now - m.last_seen > settings.queue_departure_timeout_s:
                    waited = now - m.joined_at
                    q.served_intervals.append(waited)
                    q.departure_log.append((now, waited))
                    del q.members[tid]
            q.length_history.append((now, q.queue_length()))

    def metrics(self) -> list[dict]:
        out = []
        now = None
        for q in self.queues.values():
            out.append({
                "queue_id": q.queue_id,
                "counter_id": q.counter_id,
                "queue_length": q.queue_length(),
                "arrival_rate_per_min": q.arrival_rate_per_min(),
                "service_rate_per_min": q.service_rate_per_min(),
                "average_wait_s": q.average_wait_s(),
                "estimated_wait_s": q.estimated_wait_s(),
                "occupancy": q.queue_length(),
                "rolling_queue_5m": q.rolling_avg(300),
                "rolling_queue_10m": q.rolling_avg(600),
                "timestamp": time.time(),
            })
        return out

    def observation_features(self, store_id: str) -> dict | None:
        """One training-feature row (from the first queue) for the ML dataset."""
        now = time.time()
        for q in self.queues.values():
            feats = {
                "store_id": store_id,
                "camera_id": self.camera_id,
                "queue_id": q.queue_id,
                "queue_length": q.queue_length(),
                "arrival_rate": q.arrival_rate_per_min(),
                "service_rate": q.service_rate_per_min(),
                "active_counters": 1,
                "average_wait": q.average_wait_s(),
                "rolling_queue_5m": q.rolling_avg(300),
                "rolling_queue_10m": q.rolling_avg(600),
                "hour": time.localtime(now).tm_hour,
                "day_of_week": time.localtime(now).tm_wday,
                "timestamp": now,
            }
            return feats
        return None
