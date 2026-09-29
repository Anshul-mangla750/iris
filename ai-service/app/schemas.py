"""Pydantic API schemas for RetailEdge AI."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

# --------------------------------------------------------------------- health


class HealthResponse(BaseModel):
    status: str
    time: datetime
    version: str = "1.0.0"
    device: str
    camera_status: str
    models_ready: int
    models_total: int


# ---------------------------------------------------------------- model status


class ModelStatus(BaseModel):
    name: str
    role: str
    status: Literal["READY", "NOT_TRAINED", "LOADING", "ERROR", "DISABLED"]
    path: str | None = None
    device: str | None = None
    latency_ms: float | None = None
    last_loaded: datetime | None = None
    version: str | None = None
    detail: str | None = None


class ModelStatusList(BaseModel):
    models: list[ModelStatus]


# --------------------------------------------------------------------- camera


class CameraStartRequest(BaseModel):
    source: str | None = Field(default=None, description="Override camera source (index/URL/file)")
    width: int | None = None
    height: int | None = None
    camera_id: str | None = Field(default=None, description="Named camera for multi-camera stores")


class CameraRegisterRequest(BaseModel):
    camera_id: str = Field(min_length=1)
    source: str = Field(default="0", description="int index, RTSP/HTTP URL, or file path")
    role: Literal["shelf", "entrance", "queue"] = "shelf"
    name: str = ""
    enabled: bool = True


class CameraStatusResponse(BaseModel):
    status: Literal["RUNNING", "STOPPED", "CAMERA_OFFLINE", "ERROR"]
    source: str | None = None
    fps: float = 0.0
    inference_latency_ms: float = 0.0
    preprocess_latency_ms: float = 0.0
    postprocess_latency_ms: float = 0.0
    frame_count: int = 0
    error: str | None = None


class CameraResponse(BaseModel):
    ok: bool
    status: str
    detail: str | None = None


# ---------------------------------------------------------------------- video


class VideoProcessRequest(BaseModel):
    video_id: str
    frame_skip: int = Field(default=1, ge=1)
    confidence_override: float | None = None


class VideoUploadResponse(BaseModel):
    video_id: str
    filename: str
    size_bytes: int
    duration_estimate_s: float | None = None


class VideoStatusResponse(BaseModel):
    video_id: str
    status: Literal["UPLOADED", "PROCESSING", "COMPLETED", "FAILED"]
    frames_processed: int = 0
    frames_total: int | None = None
    error: str | None = None


# -------------------------------------------------------------------- shopper


class ShopperMetrics(BaseModel):
    timestamp: datetime
    entries: int
    exits: int
    current_inside: int
    active_tracks: int
    footfall_1h: int
    avg_dwell_s: float
    data_status: str = "OK"


class ZoneMetrics(BaseModel):
    zone_id: str
    name: str
    unique_visitors: int
    current_occupancy: int
    average_dwell_s: float
    maximum_dwell_s: float
    visits: int


class ZoneListResponse(BaseModel):
    zones: list[ZoneMetrics]


class HeatmapResponse(BaseModel):
    format: Literal["png_base64", "DATA_NOT_AVAILABLE"]
    image: str | None = None
    resolution: list[int] | None = None
    period: str = "live"
    note: str | None = None


# ------------------------------------------------------------------ inventory


class ProductInventoryStatus(BaseModel):
    product_id: str
    name: str
    rack_id: str | None = None
    shelf_id: str | None = None
    expected_facing: int | None = None
    minimum_facing: int | None = None
    detected_facing: int
    occupancy_ratio: float | None = None
    status: Literal[
        "NO_DATA", "NORMAL", "LOW_STOCK", "OUT_OF_STOCK", "REPLENISHMENT_REQUIRED", "OVERSTOCKED"
    ]
    last_seen: datetime | None = None


class InventoryStatusResponse(BaseModel):
    store_id: str
    timestamp: datetime
    products: list[ProductInventoryStatus]
    data_status: str = "OK"


class AlertOut(BaseModel):
    alert_id: str
    store_id: str
    camera_id: str | None = None
    rack_id: str | None = None
    shelf_id: str | None = None
    product_id: str | None = None
    alert_type: str
    severity: str
    confidence: float | None = None
    timestamp: datetime
    evidence_frame: str | None = None
    status: Literal["OPEN", "RESOLVED"]
    detail: str | None = None
    resolved_at: datetime | None = None


class AlertListResponse(BaseModel):
    alerts: list[AlertOut]
    open_count: int


class AlertResolveRequest(BaseModel):
    resolved_by: str = "operator"
    note: str | None = None


# -------------------------------------------------------------- shelves/racks


class ShelfOut(BaseModel):
    shelf_id: str
    rack_id: str
    name: str | None = None
    polygon: list[list[float]] | None = None
    source: Literal["CONFIGURED", "DETECTED"]
    confidence: float | None = None


class RackOut(BaseModel):
    rack_id: str
    name: str | None = None
    bbox: list[float] | None = None
    shelves: list[ShelfOut] = []
    source: Literal["CONFIGURED", "DETECTED"]


class GeometryListResponse(BaseModel):
    racks: list[RackOut]
    unassigned_shelves: list[ShelfOut] = []


# --------------------------------------------------------------------- queue


class QueueMetricsOut(BaseModel):
    queue_id: str
    counter_id: str | None = None
    queue_length: int
    arrival_rate_per_min: float
    service_rate_per_min: float
    average_wait_s: float
    estimated_wait_s: float
    occupancy: int
    timestamp: datetime


class QueueStatusResponse(BaseModel):
    queues: list[QueueMetricsOut]
    data_status: str = "OK"


class QueuePredictionOut(BaseModel):
    queue_id: str
    prediction: Literal["NORMAL", "WARNING", "HIGH", "MODEL_NOT_TRAINED", "DATA_NOT_AVAILABLE"]
    confidence: float | None = None
    probabilities: dict[str, float] | None = None
    features: dict[str, Any] | None = None
    model_version: str | None = None


# --------------------------------------------------------------------- events


class PlanogramViolation(BaseModel):
    rack_id: str
    shelf_id: str
    expected_product: str | None = None
    observed_product: str | None = None
    violation_type: str
    confidence: float
    timestamp: datetime


# ------------------------------------------------------------------ geometry


class PolygonUpdate(BaseModel):
    kind: Literal["entry_line", "exit_line", "zone", "queue"]
    id: str
    points: list[list[float]]
    name: str | None = None
    counter_id: str | None = None
    camera_id: str | None = Field(default=None, description="assign queue to one camera (multi-camera)")


class ConfigResponse(BaseModel):
    ok: bool
    detail: str
