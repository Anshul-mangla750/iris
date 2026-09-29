"""FastAPI routes for RetailEdge AI."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, File, HTTPException, Query, UploadFile
from fastapi.responses import StreamingResponse

from app.alerts.engine import AlertEngine
from app.analytics.queue import QueueAnalytics  # noqa: F401  (docs)
from app.core.config import settings
from app.core.logging_config import get_logger
from app.core.store_config import get_store_config
from app.database.models import (QueueObservation, QueueEvent, get_database)
from app.models.model_manager import get_model_manager
from app.pipelines.live_camera import get_pipeline_manager
from app.pipelines.video import get_video_pipeline
from app.queue.model import get_queue_model
from app.schemas import (
    AlertListResponse, AlertResolveRequest, AlertOut, CameraResponse,
    CameraRegisterRequest, CameraStartRequest, CameraStatusResponse, ConfigResponse,
    GeometryListResponse, HealthResponse, HeatmapResponse, InventoryStatusResponse,
    ModelStatusList, PolygonUpdate, ProductInventoryStatus, QueuePredictionOut,
    QueueStatusResponse, RackOut, ShelfOut, ShopperMetrics, VideoProcessRequest,
    VideoStatusResponse, VideoUploadResponse, ZoneListResponse, ZoneMetrics,
)

logger = get_logger(__name__)
router = APIRouter()


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _live_pipeline():
    """Live pipeline only when it has actually processed frames — otherwise the
    API must report DATA_NOT_AVAILABLE (spec §36: never present zeros as data)."""
    pm = get_pipeline_manager()
    if pm.live is not None and pm.live.frames_processed > 0:
        return pm.live
    return None


def _ts(v) -> datetime:
    if isinstance(v, datetime):
        return v
    return datetime.fromtimestamp(float(v), tz=timezone.utc)


# --------------------------------------------------------------------- health
@router.get("/health", response_model=HealthResponse)
def health() -> Any:
    pm = get_pipeline_manager()
    mm = get_model_manager()
    ready, total = mm.ready_count()
    device = settings.resolve_device()
    return HealthResponse(
        status="OK" if pm.live_status()["status"] != "ERROR" else "DEGRADED",
        time=_now(), device=device,
        camera_status=pm.live_status()["status"],
        models_ready=ready, models_total=total,
    )


@router.get("/models/status", response_model=ModelStatusList)
def models_status() -> Any:
    return ModelStatusList(models=[m for m in get_model_manager().status()])


# -------------------------------------------------------------------- camera
@router.post("/camera/start", response_model=CameraResponse)
def camera_start(req: CameraStartRequest) -> Any:
    source: int | str | None = None
    if req.source is not None:
        source = int(req.source) if req.source.isdigit() else req.source
    ok, msg = get_pipeline_manager().start_live(source, camera_id=req.camera_id)
    return CameraResponse(ok=ok, status=get_pipeline_manager().live_status(req.camera_id)["status"],
                          detail=msg)


@router.post("/camera/stop", response_model=CameraResponse)
def camera_stop(camera_id: str | None = None) -> Any:
    get_pipeline_manager().stop_live(camera_id)
    return CameraResponse(ok=True, status="STOPPED", detail="camera stopped")


@router.get("/camera/status", response_model=CameraStatusResponse)
def camera_status(camera_id: str | None = None) -> Any:
    return CameraStatusResponse(**get_pipeline_manager().live_status(camera_id))


@router.get("/cameras")
def cameras_list() -> Any:
    """Registered cameras (store config) + live runtime status for each."""
    pm = get_pipeline_manager()
    registered = [{**c, "runtime": pm.live_status(c["camera_id"])}
                  for c in get_store_config().get_cameras()]
    active = pm.status_all()
    return {"registered": registered, "active": active}


@router.post("/cameras")
def camera_register(req: CameraRegisterRequest) -> Any:
    return get_store_config().upsert_camera(
        req.camera_id, source=req.source, role=req.role,
        name=req.name, enabled=req.enabled)


@router.post("/cameras/start-all")
def cameras_start_all() -> Any:
    results = get_pipeline_manager().start_registered()
    if not results:
        return CameraResponse(ok=False, status="STOPPED",
                              detail="no cameras registered (POST /cameras first)")
    ok = all(r["ok"] for r in results)
    return CameraResponse(ok=ok, status="RUNNING" if ok else "ERROR",
                          detail="; ".join(f"{r['camera_id']}: {r['detail']}" for r in results))


@router.get("/camera/frame")
def camera_frame(camera_id: str | None = None) -> Any:
    """Latest clean frame (no overlays) as JPEG — for dataset capture/annotation."""
    from fastapi import Response

    pm = get_pipeline_manager()
    p = pm.pipelines.get(camera_id) if camera_id else pm.live
    if p is None or p.frames_processed == 0:
        raise HTTPException(409, "camera not running — start it first")
    frame = p.latest_frame()
    if frame is None:
        raise HTTPException(503, "no frame available yet")
    import cv2

    ok, buf = cv2.imencode(".jpg", frame,
                           [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    if not ok:
        raise HTTPException(500, "jpeg encode failed")
    return Response(content=buf.tobytes(), media_type="image/jpeg",
                    headers={"Cache-Control": "no-store"})


@router.get("/camera/stream")
def camera_stream(camera_id: str | None = None) -> Any:
    pm = get_pipeline_manager()

    def pipe():
        return pm.pipelines.get(camera_id) if camera_id else pm.live

    def gen():
        boundary = b"--frame\r\n"
        while True:
            p = pipe()
            jpeg = p.mjpeg_frame() if p else None
            if jpeg is None:
                import time as _t

                placeholder = _placeholder_frame("camera not running")
                yield boundary + b"Content-Type: image/jpeg\r\n\r\n" + placeholder + b"\r\n"
                _t.sleep(0.5)
                continue
            yield (boundary + b"Content-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n")

    return StreamingResponse(gen(), media_type="multipart/x-mixed-replace; boundary=frame")


def _placeholder_frame(text: str) -> bytes:
    import cv2
    import numpy as np

    img = np.zeros((360, 640, 3), dtype=np.uint8)
    cv2.putText(img, text, (90, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                (200, 200, 200), 2, cv2.LINE_AA)
    ok, buf = cv2.imencode(".jpg", img)
    return buf.tobytes()


# --------------------------------------------------------------------- video
@router.post("/video/upload", response_model=VideoUploadResponse)
async def video_upload(file: UploadFile = File(...)) -> Any:
    content = await file.read()
    if not content:
        raise HTTPException(400, "empty file")
    result = get_video_pipeline().upload(file.filename or "video.mp4", content)
    if not result.get("ok"):
        raise HTTPException(400, result.get("error", "upload failed"))
    job = result["job"]
    dur = (job["frames_total"] / job["fps_source"]) if job["fps_source"] else None
    return VideoUploadResponse(video_id=job["video_id"], filename=job["filename"],
                               size_bytes=job["size_bytes"], duration_estimate_s=dur)


@router.post("/video/process")
def video_process(req: VideoProcessRequest) -> Any:
    result = get_video_pipeline().process(req.video_id, req.frame_skip,
                                          req.confidence_override)
    if not result.get("ok"):
        raise HTTPException(400, result.get("error", "cannot process"))
    return result


@router.get("/video/status/{video_id}", response_model=VideoStatusResponse)
def video_status(video_id: str) -> Any:
    job = get_video_pipeline().status(video_id)
    if job is None:
        raise HTTPException(404, "unknown video_id")
    return VideoStatusResponse(video_id=job["video_id"], status=job["status"],
                               frames_processed=job.get("frames_processed", 0),
                               frames_total=job.get("frames_total"),
                               error=job.get("error"))


# ------------------------------------------------------------------- shopper
@router.get("/shopper/metrics", response_model=ShopperMetrics)
def shopper_metrics() -> Any:
    live = _live_pipeline()
    if live is None:
        return ShopperMetrics(timestamp=_now(), entries=0, exits=0, current_inside=0,
                              active_tracks=0, footfall_1h=0, avg_dwell_s=0.0,
                              data_status="DATA_NOT_AVAILABLE")
    m = live.shopper.metrics()
    return ShopperMetrics(timestamp=_ts(m["timestamp"]), entries=m["entries"],
                          exits=m["exits"], current_inside=m["current_inside"],
                          active_tracks=m["active_tracks"],
                          footfall_1h=m["footfall_1h"], avg_dwell_s=m["avg_dwell_s"])


@router.get("/shopper/heatmap", response_model=HeatmapResponse)
def shopper_heatmap() -> Any:
    live = _live_pipeline()
    if live is None:
        return HeatmapResponse(format="DATA_NOT_AVAILABLE",
                               note="camera not running / no frames processed yet")
    data = live.shopper.heatmap_png_base64()
    return HeatmapResponse(**data)


@router.get("/shopper/zones", response_model=ZoneListResponse)
def shopper_zones() -> Any:
    live = _live_pipeline()
    if live is None:
        return ZoneListResponse(zones=[])
    return ZoneListResponse(zones=[ZoneMetrics(**z) for z in live.shopper.zone_metrics()])


# ----------------------------------------------------------------- inventory
@router.get("/inventory/status", response_model=InventoryStatusResponse)
def inventory_status() -> Any:
    live = _live_pipeline()
    rows = []
    if live is not None:
        rows = [ProductInventoryStatus(
            product_id=s.product_id, name=_product_name(s.product_id),
            rack_id=s.rack_id, shelf_id=s.shelf_id, expected_facing=s.expected_facing,
            minimum_facing=s.minimum_facing, detected_facing=s.detected_facing,
            occupancy_ratio=s.occupancy_ratio, status=s.status,
            last_seen=_ts_now(s.seconds_since_seen),
        ) for s in live.inventory.product_status()]
    return InventoryStatusResponse(store_id=settings.store_id, timestamp=_now(),
                                   products=rows,
                                   data_status="OK" if rows else "NO_DATA")


def _product_name(pid: str) -> str:
    for p in get_store_config().get_products():
        if p["product_id"] == pid:
            return p.get("name", pid)
    return pid


def _ts_now(seconds: float | None) -> datetime | None:
    if seconds is None:
        return None
    return datetime.fromtimestamp(datetime.now(timezone.utc).timestamp() - seconds,
                                  tz=timezone.utc)


@router.get("/inventory/products")
def inventory_products() -> Any:
    return {"products": get_store_config().get_products()}


@router.get("/inventory/alerts", response_model=AlertListResponse)
def inventory_alerts(limit: int = 50) -> Any:
    return _alerts_filtered(limit)


def _alerts_filtered(limit: int) -> AlertListResponse:
    engine = AlertEngine()
    rows = engine.recent(limit=limit)
    alerts = []
    for r in rows:
        r = dict(r)
        r["timestamp"] = _ts(r["timestamp"])
        if r.get("resolved_at"):
            r["resolved_at"] = _ts(r["resolved_at"])
        alerts.append(AlertOut(**r))
    return AlertListResponse(alerts=alerts,
                             open_count=sum(1 for a in alerts if a.status == "OPEN"))


# ------------------------------------------------------------- shelves/racks
@router.get("/shelves")
def shelves() -> Any:
    cfg = get_store_config()
    return {"shelves": cfg.get_shelves()}


@router.get("/racks", response_model=GeometryListResponse)
def racks() -> Any:
    cfg = get_store_config()
    shelf_to_rack: dict[str, list[ShelfOut]] = {}
    unassigned: list[ShelfOut] = []
    for s in cfg.get_shelves():
        so = ShelfOut(shelf_id=s["shelf_id"], rack_id=s["rack_id"],
                      polygon=s.get("polygon"), source="CONFIGURED")
        shelf_to_rack.setdefault(s["rack_id"], []).append(so)
    rack_out = []
    for r in cfg.get_racks():
        rack_out.append(RackOut(rack_id=r["rack_id"], name=r.get("name"),
                                bbox=r.get("bbox"),
                                shelves=shelf_to_rack.get(r["rack_id"], []),
                                source="CONFIGURED"))
    return GeometryListResponse(racks=rack_out,
                                unassigned_shelves=unassigned)


# -------------------------------------------------------------------- queue
@router.get("/queue/status", response_model=QueueStatusResponse)
def queue_status() -> Any:
    live = _live_pipeline()
    rows = live.queue.metrics() if live else []
    out = []
    for q in rows:
        out.append({
            "queue_id": q["queue_id"], "counter_id": q["counter_id"],
            "queue_length": q["queue_length"],
            "arrival_rate_per_min": q["arrival_rate_per_min"],
            "service_rate_per_min": q["service_rate_per_min"],
            "average_wait_s": q["average_wait_s"],
            "estimated_wait_s": q["estimated_wait_s"],
            "occupancy": q["occupancy"], "timestamp": _ts(q["timestamp"]),
        })
    return QueueStatusResponse(queues=out,
                               data_status="OK" if out else "NO_QUEUES_CONFIGURED")


@router.get("/queue/metrics")
def queue_metrics() -> Any:
    return queue_status()


@router.get("/queue/prediction", response_model=QueuePredictionOut)
def queue_prediction() -> Any:
    live = _live_pipeline()
    model = get_queue_model()
    if live is None:
        return QueuePredictionOut(queue_id="unknown", prediction="DATA_NOT_AVAILABLE")
    feats = live.queue.observation_features(settings.store_id)
    if feats is None:
        return QueuePredictionOut(queue_id="unknown", prediction="DATA_NOT_AVAILABLE")
    result = model.predict(feats)
    return QueuePredictionOut(queue_id=feats["queue_id"],
                              prediction=result["prediction"],
                              confidence=result["confidence"],
                              probabilities=result["probabilities"],
                              features={k: feats[k] for k in
                                        ("queue_length", "arrival_rate", "service_rate",
                                         "active_counters", "average_wait", "hour",
                                         "day_of_week") if k in feats},
                              model_version=result["model_version"])


@router.post("/queue/train")
def queue_train(min_observations: int = 30) -> Any:
    """Train the congestion model from REAL collected queue observations."""
    db = get_database()
    with db.session() as s:
        rows_q = s.query(QueueObservation).order_by(QueueObservation.timestamp).all()
    rows = [{
        "queue_length": r.queue_length, "arrival_rate": r.arrival_rate,
        "service_rate": r.service_rate, "active_counters": r.active_counters,
        "average_wait": r.average_wait_s, "rolling_queue_5m": r.rolling_queue_5m,
        "rolling_queue_10m": r.rolling_queue_10m, "hour": r.hour,
        "day_of_week": r.day_of_week, "label": r.label,
    } for r in rows_q]
    if not rows:
        return {"ok": False,
                "error": "no real queue observations collected yet; start the camera with "
                         "a configured queue polygon and let it run"}
    return get_queue_model().train(rows)


# -------------------------------------------------------------------- alerts
@router.get("/alerts", response_model=AlertListResponse)
def alerts(limit: int = 100, open_only: bool = False) -> Any:
    return _alerts_filtered(limit)


@router.post("/alerts/{alert_id}/resolve")
def alert_resolve(alert_id: str, req: AlertResolveRequest) -> Any:
    ok = AlertEngine().resolve(alert_id, req.resolved_by)
    if not ok:
        raise HTTPException(404, "alert not found")
    return ConfigResponse(ok=True, detail="resolved")


# -------------------------------------------------------------- live metrics
@router.get("/metrics/live")
def metrics_live() -> Any:
    live = _live_pipeline()
    if live is None:
        return {"status": "DATA_NOT_AVAILABLE", "detail": "camera not started or no frames processed yet"}
    return live.live_metrics()


# ----------------------------------------------------------------- geometry
@router.post("/config/geometry", response_model=ConfigResponse)
def config_geometry(req: PolygonUpdate) -> Any:
    try:
        get_store_config().set_geometry(req.kind, req.id, req.points,
                                        req.name, req.counter_id, req.camera_id)
        return ConfigResponse(ok=True, detail=f"{req.kind} {req.id} saved")
    except Exception as exc:
        raise HTTPException(400, str(exc))


@router.get("/config")
def get_config() -> Any:
    return get_store_config().data


@router.delete("/config/geometry")
def delete_geometry(kind: str, id_: str = Query(alias="id")) -> Any:
    result = get_store_config().delete_geometry(kind, id_)
    if not result.get("ok"):
        raise HTTPException(404, result.get("detail", "not found"))
    return ConfigResponse(ok=True, detail=result.get("detail"))


@router.post("/config/products")
def config_products(product: dict) -> Any:
    required = ("product_id", "name")
    if not all(k in product for k in required):
        raise HTTPException(400, f"missing fields; required: {required}")
    product.setdefault("expected_facing", 0)
    product.setdefault("minimum_facing", 0)
    product.setdefault("maximum_facing", 0)
    get_store_config().upsert_product(product)
    return ConfigResponse(ok=True, detail=f"product {product['product_id']} saved")


@router.post("/config/planogram")
def config_planogram(item: dict) -> Any:
    required = ("rack_id", "shelf_id", "position", "product_id", "expected_facing")
    if not all(k in item for k in required):
        raise HTTPException(400, f"missing fields; required: {required}")
    get_store_config().upsert_planogram_item(item)
    return ConfigResponse(ok=True, detail="planogram item saved")


@router.post("/config/racks")
def config_racks(rack: dict) -> Any:
    if "rack_id" not in rack:
        raise HTTPException(400, "missing rack_id")
    get_store_config().upsert_rack(rack["rack_id"], rack.get("name", ""),
                                   rack.get("bbox"), rack.get("camera_id"))
    return ConfigResponse(ok=True, detail=f"rack {rack['rack_id']} saved")


@router.post("/config/shelves")
def config_shelves(shelf: dict) -> Any:
    if "shelf_id" not in shelf or "rack_id" not in shelf:
        raise HTTPException(400, "missing shelf_id/rack_id")
    get_store_config().upsert_shelf(shelf["shelf_id"], shelf["rack_id"],
                                    shelf.get("polygon"), shelf.get("order_index", 0))
    return ConfigResponse(ok=True, detail=f"shelf {shelf['shelf_id']} saved")


@router.post("/config/calibration")
def config_calibration(body: dict) -> Any:
    frame_size = body.get("frame_size")
    if not frame_size or len(frame_size) != 2:
        raise HTTPException(400, "frame_size [w,h] required")
    return get_store_config().set_calibration(frame_size)


# --------------------------------------------------------------- edge status
@router.get("/edge/status")
def edge_status() -> Any:
    from app.core.edge_buffer import get_edge_buffer

    return get_edge_buffer().stats()
