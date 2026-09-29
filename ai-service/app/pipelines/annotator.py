"""Frame annotation: detection boxes, track IDs, configured geometry, HUD overlay."""
from __future__ import annotations

import cv2
import numpy as np

from app.core.config import settings
from app.core.store_config import get_store_config
from app.models.detections import Detection, Track

COLOR_PERSON = (80, 200, 120)
COLOR_PRODUCT = (60, 160, 255)
COLOR_SHELF = (255, 180, 60)
COLOR_ZONE = (200, 120, 255)
COLOR_QUEUE = (80, 80, 255)
COLOR_ENTRY = (80, 255, 80)
COLOR_EXIT = (80, 80, 255)


def _label(img, text, org, color=(30, 30, 30), bg=(255, 255, 255), scale=0.45):
    (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, 1)
    x, y = org
    cv2.rectangle(img, (x, y - th - 4), (x + tw + 4, y + 2), bg, -1)
    cv2.putText(img, text, (x + 2, y), cv2.FONT_HERSHEY_SIMPLEX, scale, color, 1,
                cv2.LINE_AA)


def draw_geometry(img: np.ndarray) -> None:
    cfg = get_store_config()
    for z in cfg.get_zones():
        pts = np.array(z["points"], dtype=np.int32)
        cv2.polylines(img, [pts], True, COLOR_ZONE, 1)
        _label(img, f"ZONE:{z['id']}", tuple(pts[0]), COLOR_ZONE, (250, 240, 255))
    for q in cfg.get_queues():
        pts = np.array(q["points"], dtype=np.int32)
        overlay = img.copy()
        cv2.fillPoly(overlay, [pts], COLOR_QUEUE)
        cv2.addWeighted(overlay, 0.15, img, 0.85, 0, img)
        cv2.polylines(img, [pts], True, COLOR_QUEUE, 2)
        _label(img, f"QUEUE:{q['id']}", tuple(pts[0]), (255, 255, 255), COLOR_QUEUE)
    for s in cfg.get_shelves():
        poly = s.get("polygon")
        if not poly or len(poly) < 3:
            continue
        pts = np.array(poly, dtype=np.int32)
        cv2.polylines(img, [pts], True, COLOR_SHELF, 1)
        _label(img, f"S:{s['shelf_id']}", tuple(pts[0]), (120, 60, 0), (255, 230, 180))
    entry = cfg.get_entry_line()
    if entry:
        a, b = (tuple(int(v) for v in entry["points"][0]),
                tuple(int(v) for v in entry["points"][1]))
        cv2.line(img, a, b, COLOR_ENTRY, 2)
        _label(img, "ENTRY", a, (0, 120, 0), COLOR_ENTRY)
    exit_line = cfg.get_exit_line()
    if exit_line:
        a, b = (tuple(int(v) for v in exit_line["points"][0]),
                tuple(int(v) for v in exit_line["points"][1]))
        cv2.line(img, a, b, COLOR_EXIT, 2)
        _label(img, "EXIT", a, (255, 255, 255), COLOR_EXIT)


def draw_tracks(img: np.ndarray, tracks: list[Track]) -> None:
    for tr in tracks:
        x1, y1, x2, y2 = (int(v) for v in tr.bbox)
        cv2.rectangle(img, (x1, y1), (x2, y2), COLOR_PERSON, 2)
        _label(img, f"{ANON}{tr.track_id} {tr.confidence:.2f}", (x1, max(y1 - 4, 12)),
               (255, 255, 255), (40, 90, 40))


ANON = "T"  # anonymous id prefix


def draw_detections(img: np.ndarray, dets: list[Detection], color, prefix: str,
                    show_class: bool = True) -> None:
    for d in dets:
        x1, y1, x2, y2 = (int(v) for v in d.bbox)
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 1)
        text = f"{prefix}:{d.class_name if show_class else ''} {d.confidence:.2f}"
        _label(img, text, (x1, max(y1 - 4, 12)), (30, 30, 30), color, scale=0.38)


def draw_hud(img: np.ndarray, lines: list[str]) -> None:
    x, y = 8, 22
    for line in lines:
        _label(img, line, (x, y), (255, 255, 255), (20, 20, 20), scale=0.5)
        y += 24
