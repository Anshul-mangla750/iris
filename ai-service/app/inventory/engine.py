"""Inventory Intelligence Engine.

Concept separation (important):
- VISIBLE_FACINGS:  count of detected product instances on a shelf (camera-observable)
- SHELF_OCCUPANCY:  visible product area / shelf area (geometric estimate)
- EXPECTED_FACING:  planogram-configured facings
- STATUS:           NORMAL | LOW_STOCK | OUT_OF_STOCK | REPLENISHMENT_REQUIRED | NO_DATA

Out-of-stock uses TEMPORAL CONFIRMATION: a product is OOS only after it has not been
observed for out_of_stock_confirmation_seconds of shelf scans (config), not one frame.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any

from app.core.config import settings
from app.core.geometry import point_in_polygon
from app.core.logging_config import get_logger
from app.core.store_config import get_store_config
from app.models.detections import Detection

logger = get_logger(__name__)


@dataclass
class ShelfState:
    shelf_id: str
    rack_id: str
    polygon: list | None = None
    # per-product observation
    last_seen: dict[str, float] = field(default_factory=dict)   # pid -> ts of last detection
    facing_samples: dict[str, list[int]] = field(default_factory=dict)  # pid -> recent counts
    occupancy_samples: list[float] = field(default_factory=list)
    oos_alerted: dict[str, bool] = field(default_factory=dict)   # pid -> alert currently open
    low_occ_alerted: bool = False
    last_scan: float = 0.0
    first_scan_ts: float = 0.0
    last_seen_any_ts: float = 0.0


@dataclass
class ProductShelfStatus:
    product_id: str
    shelf_id: str
    rack_id: str
    detected_facing: int
    expected_facing: int | None
    minimum_facing: int | None
    occupancy_ratio: float | None
    seconds_since_seen: float | None
    status: str

    def to_dict(self) -> dict:
        return {
            "product_id": self.product_id,
            "shelf_id": self.shelf_id,
            "rack_id": self.rack_id,
            "detected_facing": self.detected_facing,
            "expected_facing": self.expected_facing,
            "minimum_facing": self.minimum_facing,
            "occupancy_ratio": self.occupancy_ratio,
            "seconds_since_seen": self.seconds_since_seen,
            "status": self.status,
        }


class InventoryEngine:
    """Stateful inventory logic per camera. Consumes shelf polygons + product detections."""

    def __init__(self, camera_id: str = "cam_0") -> None:
        self.camera_id = camera_id
        self.store_config = get_store_config()
        self.shelves: dict[str, ShelfState] = {}
        self._rebuild_shelves()

    # ------------------------------------------------------------ shelves
    def _rebuild_shelves(self) -> None:
        for s in self.store_config.get_shelves():
            if s["shelf_id"] not in self.shelves:
                self.shelves[s["shelf_id"]] = ShelfState(
                    shelf_id=s["shelf_id"], rack_id=s["rack_id"], polygon=s.get("polygon"),
                )
            else:
                self.shelves[s["shelf_id"]].polygon = s.get("polygon")

    def product_catalog(self) -> dict[str, dict]:
        return {p["product_id"]: p for p in self.store_config.get_products()}

    def planogram_index(self) -> dict[tuple[str, str], list[dict]]:
        """(rack_id, shelf_id) -> planogram items."""
        idx: dict[tuple[str, str], list[dict]] = {}
        for item in self.store_config.get_planogram():
            idx.setdefault((item["rack_id"], item["shelf_id"]), []).append(item)
        return idx

    # ------------------------------------------------------- observation
    def observe(self, product_detections: list[Detection],
                recognized: dict[int, str] | None = None,
                frame_size: tuple[int, int] = (1280, 720)) -> list[dict]:
        """Feed one shelf-scan frame. recognized maps detection index -> product_id.

        Returns list of inventory events (LOW_STOCK / OUT_OF_STOCK / status changes).
        """
        self._rebuild_shelves()
        now = time.time()
        recognized = recognized or {}
        events: list[dict] = []

        # counts per shelf per product
        shelf_counts: dict[str, dict[str, int]] = {}
        shelf_occupied_width: dict[str, float] = {}
        for i, det in enumerate(product_detections):
            cx = (det.bbox[0] + det.bbox[2]) / 2.0
            cy = (det.bbox[1] + det.bbox[3]) / 2.0
            shelf_id = self._locate_shelf(cx, cy)
            if shelf_id is None:
                # rack-level fallback: product inside a configured rack but not
                # on any shelf polygon still counts toward that rack's shelves
                shelf_id = self._locate_rack_shelf(cx, cy)
            pid = recognized.get(i)
            if shelf_id is not None:
                shelf_occupied_width[shelf_id] = shelf_occupied_width.get(shelf_id, 0.0) + det.width
                if pid is not None:
                    shelf_counts.setdefault(shelf_id, {})
                    shelf_counts[shelf_id][pid] = shelf_counts[shelf_id].get(pid, 0) + 1

        for shelf_id, st in self.shelves.items():
            if st.first_scan_ts == 0:
                st.first_scan_ts = now
            st.last_scan = now
            counts = shelf_counts.get(shelf_id, {})
            n_on_shelf = sum(counts.values())
            if n_on_shelf > 0:
                st.last_seen_any_ts = now
            # shelf occupancy (width-based; segmentation refines when available)
            occupied_w = shelf_occupied_width.get(shelf_id, 0.0)
            poly = st.polygon
            if poly and len(poly) >= 3:
                xs = [p[0] for p in poly]
                shelf_w = max(max(xs) - min(xs), 1.0)
                occ = min(occupied_w / shelf_w, 1.0)
                st.occupancy_samples.append(occ)
                if len(st.occupancy_samples) > 60:
                    st.occupancy_samples.pop(0)
                # ---- empty / getting-empty temporal events (restock workflow) ----
                self._check_empty_conditions(shelf_id, st, occ, now, events)

            # update last-seen + rolling facing counts
            for pid, n in counts.items():
                st.last_seen[pid] = now
                st.facing_samples.setdefault(pid, []).append(n)
                if len(st.facing_samples[pid]) > 10:
                    st.facing_samples[pid].pop(0)

            # per planogram product: temporal confirmation of absence
            for item in self._planogram_for_shelf(shelf_id):
                pid = item["product_id"]
                if pid in counts:
                    if st.oos_alerted.get(pid):
                        st.oos_alerted[pid] = False
                        events.append({"type": "OOS_CLEARED", "shelf_id": shelf_id,
                                       "product_id": pid, "timestamp": now})
                    continue
                last = st.last_seen.get(pid)
                absent_s = (now - last) if last is not None else None
                confirmed = (absent_s is not None and
                             absent_s >= settings.out_of_stock_confirmation_seconds)
                never_seen_confirmed = (last is None and st.last_scan > 0 and
                                        self._shelf_scan_age(st) >=
                                        settings.out_of_stock_confirmation_seconds)
                if (confirmed or never_seen_confirmed) and not st.oos_alerted.get(pid):
                    st.oos_alerted[pid] = True
                    events.append({
                        "type": "OUT_OF_STOCK", "shelf_id": shelf_id,
                        "rack_id": st.rack_id, "product_id": pid, "timestamp": now,
                        "absent_seconds": absent_s if absent_s is not None else -1,
                        "expected_facing": item.get("expected_facing", 1),
                    })
        return events

    def _check_empty_conditions(self, shelf_id: str, st: "ShelfState",
                                occ: float, now: float, events: list[dict]) -> None:
        """Temporal empty/'getting-empty' detection per shelf (debounced in AlertEngine)."""
        confirm_s = settings.out_of_stock_confirmation_seconds
        occupancy_avg = (sum(st.occupancy_samples) / len(st.occupancy_samples)
                         if st.occupancy_samples else occ)
        empty = occupancy_avg < settings.empty_shelf_occupancy_threshold
        low = (not empty and occupancy_avg < settings.low_occupancy_threshold)
        if empty and not st.low_occ_alerted:
            if st.last_seen_any_ts > 0:
                # shelf had products earlier → truly went empty mid-observation
                if now - st.last_seen_any_ts >= confirm_s:
                    st.low_occ_alerted = True
                    events.append({
                        "type": "EMPTY_SHELF", "shelf_id": shelf_id,
                        "rack_id": st.rack_id, "timestamp": now,
                        "occupancy_ratio": round(occupancy_avg, 3),
                        "free_capacity": self._free_capacity(st),
                    })
            else:
                # never observed with products; fire once once monitoring has
                # run long enough (first_scan_ts, NOT inter-scan gap)
                if st.first_scan_ts > 0 and now - st.first_scan_ts >= confirm_s:
                    st.low_occ_alerted = True
                    events.append({
                        "type": "EMPTY_SHELF", "shelf_id": shelf_id,
                        "rack_id": st.rack_id, "timestamp": now,
                        "occupancy_ratio": round(occupancy_avg, 3),
                        "free_capacity": self._free_capacity(st),
                    })
        elif low and not st.low_occ_alerted:
            st.low_occ_alerted = True
            events.append({
                "type": "SHELF_LOW_OCCUPANCY", "shelf_id": shelf_id,
                "rack_id": st.rack_id, "timestamp": now,
                "occupancy_ratio": round(occupancy_avg, 3),
                "free_capacity": self._free_capacity(st),
            })
        elif not empty and not low and st.low_occ_alerted:
            st.low_occ_alerted = False
            events.append({
                "type": "SHELF_RESTOCKED", "shelf_id": shelf_id,
                "rack_id": st.rack_id, "timestamp": now,
                "occupancy_ratio": round(occupancy_avg, 3),
                "free_capacity": self._free_capacity(st),
            })

    def _free_capacity(self, st: "ShelfState") -> int | None:
        """Estimated free product slots = expected facings - currently detected."""
        expected = sum(item.get("expected_facing", 1)
                       for item in self._planogram_for_shelf(st.shelf_id))
        if expected <= 0:
            return None
        detected = sum((s[-1] if s else 0)
                       for pid, s in st.facing_samples.items()
                       if pid in {i["product_id"] for i in self._planogram_for_shelf(st.shelf_id)})
        return max(expected - detected, 0)

    def _shelf_scan_age(self, st: ShelfState) -> float:
        return time.time() - st.last_scan if st.last_scan > 0 else 0.0

    def _locate_shelf(self, cx: float, cy: float) -> str | None:
        for s in self.store_config.get_shelves():
            poly = s.get("polygon")
            if poly and len(poly) >= 3 and point_in_polygon((cx, cy), poly):
                return s["shelf_id"]
        return None

    def _locate_rack_shelf(self, cx: float, cy: float) -> str | None:
        """Map a point to the first shelf of the rack whose bbox contains it.

        Lets rack-level detections (no shelf polygon hit) still drive inventory
        counts for the rack's shelves.
        """
        for r in self.store_config.get_racks():
            bbox = r.get("bbox")
            if not bbox or len(bbox) != 4:
                continue
            x1, y1, x2, y2 = bbox
            if x1 <= cx <= x2 and y1 <= cy <= y2:
                rack_shelves = [s for s in self.store_config.get_shelves()
                                if s.get("rack_id") == r["rack_id"]]
                if rack_shelves:
                    return rack_shelves[0]["shelf_id"]
        return None

    def _planogram_for_shelf(self, shelf_id: str) -> list[dict]:
        return [it for it in self.store_config.get_planogram() if it["shelf_id"] == shelf_id]

    # ------------------------------------------------------------ status
    def product_status(self) -> list[ProductShelfStatus]:
        """Current per-product inventory status (facts only)."""
        self._rebuild_shelves()  # pick up newly configured shelves/planograms
        now = time.time()
        catalog = self.product_catalog()
        out: list[ProductShelfStatus] = []
        for item in self.store_config.get_planogram():
            pid, shelf_id = item["product_id"], item["shelf_id"]
            st = self.shelves.get(shelf_id)
            if st is None:
                continue
            samples = st.facing_samples.get(pid, [])
            detected = samples[-1] if samples else 0
            expected = item.get("expected_facing",
                                catalog.get(pid, {}).get("expected_facing", 0))
            minimum = (catalog.get(pid, {}).get("minimum_facing")
                       if pid in catalog else None)
            occupancy = (round(sum(st.occupancy_samples) / len(st.occupancy_samples), 3)
                         if st.occupancy_samples else None)
            last = st.last_seen.get(pid)
            secs = (now - last) if last is not None else None
            if st.last_scan == 0:
                # shelf never scanned by the camera — honest NO_DATA, not OUT_OF_STOCK
                status = "NO_DATA"
            else:
                status = self._classify(pid, detected, expected, minimum,
                                        st.oos_alerted.get(pid, False))
            out.append(ProductShelfStatus(
                product_id=pid, shelf_id=shelf_id, rack_id=st.rack_id,
                detected_facing=detected, expected_facing=expected,
                minimum_facing=minimum, occupancy_ratio=occupancy,
                seconds_since_seen=secs, status=status,
            ))
        return out

    @staticmethod
    def _classify(pid: str, detected: int, expected: int | None,
                  minimum: int | None, oos_open: bool) -> str:
        if oos_open:
            return "OUT_OF_STOCK"
        if expected is None or expected <= 0:
            return "NO_DATA" if detected == 0 else "NORMAL"
        if detected == 0:
            return "OUT_OF_STOCK"
        if minimum is not None and detected <= minimum:
            return "LOW_STOCK"
        if detected < expected:
            return "REPLENISHMENT_REQUIRED"
        if expected > 0 and detected > expected * 2 and expected > 2:
            return "OVERSTOCKED"
        return "NORMAL"

    # ---------------------------------------------------------- planogram
    def planogram_violations(self, product_detections: list[Detection],
                             recognized: dict[int, str]) -> list[dict]:
        """Compare expected planogram vs observed shelf. Requires recognition data."""
        violations: list[dict] = []
        now = time.time()
        if not self.store_config.get_planogram():
            return violations
        # observed: shelf -> product counts (recognized only)
        observed: dict[str, dict[str, int]] = {}
        for i, det in enumerate(product_detections):
            pid = recognized.get(i)
            if pid is None:
                continue
            cx, cy = (det.bbox[0] + det.bbox[2]) / 2.0, (det.bbox[1] + det.bbox[3]) / 2.0
            shelf_id = self._locate_shelf(cx, cy)
            if shelf_id is None:
                continue
            observed.setdefault(shelf_id, {})
            observed[shelf_id][pid] = observed[shelf_id].get(pid, 0) + 1

        for item in self.store_config.get_planogram():
            shelf_id, exp_pid = item["shelf_id"], item["product_id"]
            obs = observed.get(shelf_id, {})
            exp_count = item.get("expected_facing", 1)
            if exp_pid not in obs:
                violations.append({
                    "rack_id": item["rack_id"], "shelf_id": shelf_id,
                    "expected_product": exp_pid, "observed_product": None,
                    "violation_type": "MISSING_PRODUCT", "confidence": 0.9,
                    "timestamp": now,
                })
            else:
                if obs[exp_pid] < exp_count:
                    violations.append({
                        "rack_id": item["rack_id"], "shelf_id": shelf_id,
                        "expected_product": exp_pid, "observed_product": exp_pid,
                        "violation_type": "INCORRECT_FACING_COUNT", "confidence": 0.8,
                        "timestamp": now, "expected": exp_count, "observed": obs[exp_pid],
                    })
            # wrong product present on this shelf
            for obs_pid, n in obs.items():
                if obs_pid != exp_pid:
                    violations.append({
                        "rack_id": item["rack_id"], "shelf_id": shelf_id,
                        "expected_product": exp_pid, "observed_product": obs_pid,
                        "violation_type": "WRONG_PRODUCT", "confidence": 0.75,
                        "timestamp": now, "observed_facing": n,
                    })
        return violations

    # -------------------------------------------------------- empty gaps
    def shelf_gap_summary(self) -> list[dict]:
        """Per-shelf occupancy summary (width-based, real measurements)."""
        self._rebuild_shelves()
        out = []
        for s in self.store_config.get_shelves():
            st = self.shelves.get(s["shelf_id"])
            if st is None or not st.occupancy_samples:
                out.append({"shelf_id": s["shelf_id"], "rack_id": s["rack_id"],
                            "occupancy_ratio": None, "status": "NO_DATA", "free_capacity": None})
                continue
            occ = sum(st.occupancy_samples) / len(st.occupancy_samples)
            status = ("EMPTY_SHELF" if occ < settings.empty_shelf_occupancy_threshold
                      else "NORMAL" if occ >= 0.6 else "PARTIALLY_EMPTY")
            out.append({"shelf_id": s["shelf_id"], "rack_id": s["rack_id"],
                        "occupancy_ratio": round(occ, 3), "status": status,
                        "free_capacity": self._free_capacity(st),
                        "last_product_seen_ago_s": (round(time.time() - st.last_seen_any_ts, 1)
                                                    if st.last_seen_any_ts > 0 else None)})
        return out
