"""
Store configuration persistence.

Geometry and catalogue live in data/store_config.json (edit via API wizard or file),
and are mirrored into the primary database (racks/shelves/planograms/products).
"""
from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Any

from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger(__name__)

CONFIG_PATH = settings.log_dir.parent / "data" / "store_config.json"


class StoreConfig:
    """Thread-safe accessor for zones/lines/queues/racks/shelves/planogram/catalog."""

    def __init__(self, path: Path = CONFIG_PATH):
        self.path = path
        self._lock = threading.RLock()
        self._data: dict[str, Any] = {}
        self._load()

    # ------------------------------------------------------------------ io
    def _load(self) -> None:
        with self._lock:
            if self.path.exists():
                try:
                    self._data = json.loads(self.path.read_text(encoding="utf-8"))
                except Exception as exc:  # corrupt config: keep defaults, log loudly
                    logger.error("store_config corrupt (%s); using defaults", exc)
                    self._data = {}
            self._data.setdefault("store_id", settings.store_id)
            self._data.setdefault("entry_line", None)
            self._data.setdefault("exit_line", None)
            self._data.setdefault("zones", [])
            self._data.setdefault("queues", [])
            self._data.setdefault("racks", [])
            self._data.setdefault("shelves", [])
            self._data.setdefault("planogram", [])
            self._data.setdefault("products", [])
            self._data.setdefault("calibration", {"done": False, "frame_size": None})

    def save(self) -> None:
        with self._lock:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            tmp = self.path.with_suffix(".tmp")
            tmp.write_text(json.dumps(self._data, indent=2), encoding="utf-8")
            tmp.replace(self.path)

    # ------------------------------------------------------------- getters
    @property
    def data(self) -> dict[str, Any]:
        with self._lock:
            return self._data

    def get_entry_line(self) -> list[list[float]] | None:
        return self._data.get("entry_line")

    def get_exit_line(self) -> list[list[float]] | None:
        return self._data.get("exit_line")

    def get_zones(self) -> list[dict]:
        return self._data.get("zones", [])

    def get_queues(self) -> list[dict]:
        return self._data.get("queues", [])

    def get_racks(self) -> list[dict]:
        return self._data.get("racks", [])

    def get_shelves(self) -> list[dict]:
        return self._data.get("shelves", [])

    def get_planogram(self) -> list[dict]:
        return self._data.get("planogram", [])

    def get_products(self) -> list[dict]:
        return self._data.get("products", [])

    # ------------------------------------------------------------- setters
    def set_geometry(self, kind: str, id_: str, points: list[list[float]], name: str | None = None,
                     counter_id: str | None = None, camera_id: str | None = None) -> dict:
        with self._lock:
            if kind == "entry_line":
                self._data["entry_line"] = {"id": id_, "points": points}
            elif kind == "exit_line":
                self._data["exit_line"] = {"id": id_, "points": points}
            elif kind == "zone":
                zones = self._data.setdefault("zones", [])
                for z in zones:
                    if z["id"] == id_:
                        z.update({"points": points, "name": name or z.get("name")})
                        break
                else:
                    zones.append({"id": id_, "name": name or id_, "points": points})
            elif kind == "queue":
                queues = self._data.setdefault("queues", [])
                for q in queues:
                    if q["id"] == id_:
                        q.update({"points": points, "name": name or q.get("name"),
                                  "counter_id": counter_id or q.get("counter_id"),
                                  "camera_id": camera_id or q.get("camera_id")})
                        break
                else:
                    queues.append({
                        "id": id_, "name": name or id_, "points": points,
                        "counter_id": counter_id or f"{id_}_counter",
                        "camera_id": camera_id,
                    })
            else:
                raise ValueError(f"unknown geometry kind: {kind}")
            self.save()
            return {"ok": True}

    def upsert_camera(self, camera_id: str, source: str = "0", role: str = "shelf",
                      name: str = "", enabled: bool = True) -> dict:
        """Register a camera (multi-store aisles/counters need many cameras)."""
        with self._lock:
            cams = self._data.setdefault("cameras", [])
            for c in cams:
                if c["camera_id"] == camera_id:
                    c.update({"source": source, "role": role, "name": name or c.get("name", ""),
                              "enabled": enabled})
                    break
            else:
                cams.append({"camera_id": camera_id, "source": source, "role": role,
                             "name": name or camera_id, "enabled": enabled})
            self.save()
            return {"ok": True, "camera_id": camera_id}

    def get_cameras(self) -> list[dict]:
        return self._data.get("cameras", [])

    def delete_geometry(self, kind: str, id_: str) -> dict:
        """Remove one configured polygon/line by kind+id (used by the UI editor)."""
        with self._lock:
            list_key = {"zone": "zones", "queue": "queues"}.get(kind)
            if list_key:
                before = len(self._data[list_key])
                self._data[list_key] = [g for g in self._data[list_key] if g["id"] != id_]
                if len(self._data[list_key]) == before:
                    return {"ok": False, "detail": f"{kind} {id_} not found"}
            elif kind in ("entry_line", "exit_line") and self._data.get(kind, {}).get("id") == id_:
                self._data[kind] = None
            else:
                return {"ok": False, "detail": f"unknown kind or id: {kind}/{id_}"}
            self.save()
            return {"ok": True, "detail": f"{kind} {id_} deleted"}

    def upsert_rack(self, rack_id: str, name: str = "", bbox: list[float] | None = None,
                    camera_id: str | None = None) -> dict:
        with self._lock:
            racks = self._data.setdefault("racks", [])
            for r in racks:
                if r["rack_id"] == rack_id:
                    r.update({"name": name or r.get("name", ""), "bbox": bbox or r.get("bbox"),
                              "camera_id": camera_id or r.get("camera_id")})
                    break
            else:
                racks.append({"rack_id": rack_id, "name": name or rack_id,
                              "bbox": bbox, "camera_id": camera_id})
            self.save()
            return {"ok": True}

    def upsert_shelf(self, shelf_id: str, rack_id: str, polygon: list[list[float]] | None = None,
                     order_index: int = 0) -> dict:
        with self._lock:
            shelves = self._data.setdefault("shelves", [])
            for s in shelves:
                if s["shelf_id"] == shelf_id:
                    s.update({"rack_id": rack_id, "polygon": polygon or s.get("polygon"),
                              "order_index": order_index})
                    break
            else:
                shelves.append({"shelf_id": shelf_id, "rack_id": rack_id,
                                "polygon": polygon, "order_index": order_index})
            self.save()
            return {"ok": True}

    def upsert_product(self, product: dict) -> dict:
        with self._lock:
            products = self._data.setdefault("products", [])
            pid = product["product_id"]
            for p in products:
                if p["product_id"] == pid:
                    p.update(product)
                    break
            else:
                products.append(product)
            self.save()
            return {"ok": True}

    def upsert_planogram_item(self, item: dict) -> dict:
        with self._lock:
            items = self._data.setdefault("planogram", [])
            key = (item["rack_id"], item["shelf_id"], item["position"])
            for it in items:
                if (it["rack_id"], it["shelf_id"], it["position"]) == key:
                    it.update(item)
                    break
            else:
                items.append(item)
            self.save()
            return {"ok": True}

    def set_calibration(self, frame_size: list[int]) -> dict:
        with self._lock:
            self._data["calibration"] = {"done": True, "frame_size": frame_size}
            self.save()
            return {"ok": True}

    def reset(self) -> dict:
        with self._lock:
            self._data = {
                "store_id": settings.store_id,
                "entry_line": None, "exit_line": None,
                "zones": [], "queues": [], "racks": [], "shelves": [],
                "planogram": [], "products": [],
                "calibration": {"done": False, "frame_size": None},
            }
            self.save()
            return {"ok": True}


_store_config: StoreConfig | None = None


def get_store_config() -> StoreConfig:
    global _store_config
    if _store_config is None:
        _store_config = StoreConfig()
    return _store_config
