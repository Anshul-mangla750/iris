"""Shopper analytics: entry/exit counting, zones, dwell, footfall, heatmap.

All values derive from actual ByteTrack track history. Track IDs are anonymous.
"""
from __future__ import annotations

import base64
import time
from collections import defaultdict, deque
from dataclasses import dataclass, field

import cv2
import numpy as np

from app.core.config import settings
from app.core.geometry import bbox_bottom_center, segment_side, point_in_polygon
from app.core.logging_config import get_logger
from app.core.store_config import get_store_config
from app.models.detections import Track

logger = get_logger(__name__)


@dataclass
class TrackState:
    track_id: int
    first_seen: float
    last_seen: float
    prev_point: tuple[float, float]
    zones: set[str] = field(default_factory=set)
    dwell_s: float = 0.0
    entries_counted: bool = False
    exits_counted: bool = False
    entry_side: int = 0
    exit_side: int = 0
    points: deque = field(default_factory=lambda: deque(maxlen=300))
    entered_store: bool = False


@dataclass
class ZoneStat:
    zone_id: str
    name: str
    visitors: set[int] = field(default_factory=set)
    current_occupancy: set[int] = field(default_factory=set)
    dwell_samples: list[float] = field(default_factory=list)
    visits: int = 0

    def summary(self) -> dict:
        return {
            "zone_id": self.zone_id,
            "name": self.name,
            "unique_visitors": len(self.visitors),
            "current_occupancy": len(self.current_occupancy),
            "average_dwell_s": round(sum(self.dwell_samples) / len(self.dwell_samples), 1)
            if self.dwell_samples else 0.0,
            "maximum_dwell_s": round(max(self.dwell_samples), 1) if self.dwell_samples else 0.0,
            "visits": self.visits,
        }


class ShopperAnalytics:
    """Stateful per-camera shopper analytics driven by real tracker output."""

    def __init__(self, camera_id: str = "cam_0") -> None:
        self.camera_id = camera_id
        self.store_config = get_store_config()
        self.tracks: dict[int, TrackState] = {}
        self.zone_stats: dict[str, ZoneStat] = {}
        self._rebuild_zone_stats()
        self.entries = 0
        self.exits = 0
        self.entry_times: deque = deque()  # for hourly footfall
        self.heatmap = np.zeros(settings.heatmap_resolution, dtype=np.float32)
        self._heatmap_h, self._heatmap_w = settings.heatmap_resolution
        self._events: list[dict] = []  # outbound events for persistence
        self._last_decay = time.time()

    def _rebuild_zone_stats(self) -> None:
        for z in self.store_config.get_zones():
            if z["id"] not in self.zone_stats:
                self.zone_stats[z["id"]] = ZoneStat(z["id"], z.get("name", z["id"]))

    # ------------------------------------------------------------- update
    def update(self, tracks: list[Track]) -> list[dict]:
        """Feed one frame's tracks; returns generated events (entry/exit/zone)."""
        now = time.time()
        self._decay_heatmap(now)
        self._rebuild_zone_stats()
        entry_line = self.store_config.get_entry_line()
        exit_line = self.store_config.get_exit_line()

        seen_now: set[int] = set()
        for tr in tracks:
            st = self.tracks.get(tr.track_id)
            if st is None:
                st = TrackState(track_id=tr.track_id, first_seen=now, last_seen=now,
                                prev_point=(tr.center_x, tr.bbox[3]))
                self.tracks[tr.track_id] = st
            seen_now.add(tr.track_id)

            foot = (tr.center_x, tr.bbox[3])
            st.points.append((now, foot))
            dt = now - st.last_seen
            if 0 < dt < 2.0:
                st.dwell_s += dt
            st.last_seen = now

            # ---- zones
            for z in self.store_config.get_zones():
                inside = point_in_polygon(foot, z["points"])
                zs = self.zone_stats[z["id"]]
                if inside and tr.track_id not in zs.current_occupancy:
                    zs.current_occupancy.add(tr.track_id)
                    zs.visitors.add(tr.track_id)
                    zs.visits += 1
                    if z["id"] not in st.zones:
                        st.zones.add(z["id"])
                        self._events.append({
                            "type": "ZONE_ENTER", "track_id": tr.track_id,
                            "zone_id": z["id"], "timestamp": now,
                        })
                elif not inside and tr.track_id in zs.current_occupancy:
                    zs.current_occupancy.discard(tr.track_id)
                    zs.dwell_samples.append(st.dwell_s)

            # ---- entry line crossing (once per track; any direction)
            # The virtual line is crossed when the sign of the cross product against
            # the a→b vector flips between consecutive positions.
            if entry_line and not st.entries_counted:
                a, b = entry_line["points"][0], entry_line["points"][1]
                d1 = segment_side(st.prev_point, a, b)
                d2 = segment_side(foot, a, b)
                if (d1 > 0 > d2) or (d1 < 0 < d2):
                    self.entries += 1
                    self.entry_times.append(now)
                    st.entries_counted = True
                    st.entered_store = True
                    self._events.append({
                        "type": "ENTRY", "track_id": tr.track_id, "timestamp": now,
                        "direction": 1 if d2 > 0 else -1,
                    })

            if exit_line and not st.exits_counted:
                a, b = exit_line["points"][0], exit_line["points"][1]
                d1 = segment_side(st.prev_point, a, b)
                d2 = segment_side(foot, a, b)
                if (d1 > 0 > d2) or (d1 < 0 < d2):
                    self.exits += 1
                    st.exits_counted = True
                    st.entered_store = False
                    self._events.append({
                        "type": "EXIT", "track_id": tr.track_id, "timestamp": now,
                        "direction": 1 if d2 > 0 else -1,
                    })

            # ---- heatmap accumulation at foot position
            self._accumulate_heatmap(foot)

            st.prev_point = foot

        # expire stale tracks
        timeout = settings.track_max_age_s
        for tid in list(self.tracks):
            if now - self.tracks[tid].last_seen > timeout:
                st = self.tracks.pop(tid)
                for zs in self.zone_stats.values():
                    zs.current_occupancy.discard(tid)

        events, self._events = self._events, []
        return events

    # ------------------------------------------------------------ heatmap
    def _decay_heatmap(self, now: float) -> None:
        dt = now - self._last_decay
        if dt >= 1.0:
            self.heatmap *= float(settings.heatmap_decay)
            self._last_decay = now

    def _accumulate_heatmap(self, foot: tuple[float, float]) -> None:
        # frame size unknown here; normalize with calibration frame_size or 1280x720
        fw, fh = self.store_config.data.get("calibration", {}).get("frame_size") or [1280, 720]
        x = int(np.clip(foot[0] / max(fw, 1) * self._heatmap_w, 0, self._heatmap_w - 1))
        y = int(np.clip(foot[1] / max(fh, 1) * self._heatmap_h, 0, self._heatmap_h - 1))
        self.heatmap[y, x] += 1.0

    def heatmap_png_base64(self, overlay: np.ndarray | None = None) -> dict:
        if self.heatmap.sum() < 1.0:
            return {"format": "DATA_NOT_AVAILABLE",
                    "note": "no tracked movement accumulated yet"}
        norm = self.heatmap / max(self.heatmap.max(), 1e-6)
        colored = cv2.applyColorMap((norm * 255).astype(np.uint8), cv2.COLORMAP_JET)
        if overlay is not None:
            colored = cv2.addWeighted(overlay, 0.6, colored, 0.4, 0)
        ok, buf = cv2.imencode(".png", colored)
        if not ok:
            return {"format": "DATA_NOT_AVAILABLE", "note": "encode failed"}
        return {
            "format": "png_base64",
            "image": base64.b64encode(buf.tobytes()).decode(),
            "resolution": [self._heatmap_w, self._heatmap_h],
        }

    # ------------------------------------------------------------ metrics
    def metrics(self) -> dict:
        now = time.time()
        inside = sum(1 for st in self.tracks.values() if st.entered_store and st.exits_counted is False)
        footfall_1h = sum(1 for t in self.entry_times if now - t <= 3600)
        dwells = [st.dwell_s for st in self.tracks.values()]
        while self.entry_times and now - self.entry_times[0] > 7200:
            self.entry_times.popleft()
        return {
            "timestamp": now,
            "entries": self.entries,
            "exits": self.exits,
            "current_inside": inside,
            "active_tracks": len(self.tracks),
            "footfall_1h": footfall_1h,
            "avg_dwell_s": round(sum(dwells) / len(dwells), 1) if dwells else 0.0,
        }

    def zone_metrics(self) -> list[dict]:
        return [zs.summary() for zs in self.zone_stats.values()]
