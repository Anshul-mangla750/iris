"""
RetailEdge AI — centralized configuration.

All operational thresholds are configurable (no hardcoded operational values in code).
Values are read from environment variables (see .env.example) with documented defaults.
"""
from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # ------------------------------------------------------------------ store
    store_id: str = Field(default="STORE_001")
    store_name: str = Field(default="RetailEdge Demo Store")
    store_timezone: str = Field(default="Asia/Kolkata")

    # ----------------------------------------------------------------- camera
    camera_source: str = Field(default="0", description="int index, URL (IP/RTSP), or file path")
    camera_width: int = Field(default=1280)
    camera_height: int = Field(default=720)
    camera_fps: float = Field(default=25.0)
    camera_reconnect_delay_s: float = Field(default=2.0)
    camera_jpeg_quality: int = Field(default=70)
    camera_draw_overlays: bool = Field(default=True)
    privacy_blur_faces: bool = Field(
        default=False, description="Blur person head regions in the annotated output stream."
    )
    privacy_retention_days: int = Field(default=7)
    max_frame_queue_size: int = Field(default=8)

    # ----------------------------------------------------------------- device
    model_device: str = Field(default="auto", description="auto | cpu | cuda:0 ...")

    # ----------------------------------------------------------------- models
    models_dir: Path = Field(default=PROJECT_ROOT / "models")
    person_model_path: Path = Field(default=PROJECT_ROOT / "models" / "person" / "yolo11n.pt")
    product_model_path: Path = Field(default=PROJECT_ROOT / "models" / "product" / "product_yolo.pt")
    rack_model_path: Path = Field(default=PROJECT_ROOT / "models" / "rack" / "rack_yolo.pt")
    shelf_model_path: Path = Field(default=PROJECT_ROOT / "models" / "shelf" / "shelf_yolo.pt")
    segmentation_model_path: Path = Field(
        default=PROJECT_ROOT / "models" / "segmentation" / "shelf_seg.pt"
    )
    queue_model_path: Path = Field(default=PROJECT_ROOT / "models" / "queue" / "queue_congestion.joblib")
    queue_model_scaler_path: Path = Field(
        default=PROJECT_ROOT / "models" / "queue" / "queue_scaler.joblib"
    )

    # ------------------------------------------------------- person detection
    person_confidence: float = Field(default=0.45)
    person_iou: float = Field(default=0.45)
    person_input_size: int = Field(default=640)
    person_enabled: bool = Field(default=True)

    # ------------------------------------------------------ product detection
    product_confidence: float = Field(default=0.45)
    product_iou: float = Field(default=0.45)
    product_input_size: int = Field(default=960)
    product_enabled: bool = Field(default=True)
    product_inference_interval_s: float = Field(
        default=1.0, description="Product/shelf inference interval on the live pipeline."
    )

    product_coco_fallback_enabled: bool = Field(
        default=True,
        description="Detect loose everyday items (bottle, phone, cup...) via stock COCO weights.",
    )

    # -------------------------------------------------------- rack/shelf/conf
    rack_confidence: float = Field(default=0.4)
    shelf_confidence: float = Field(default=0.4)
    shelf_enabled: bool = Field(default=True)
    segmentation_enabled: bool = Field(default=False, description="Optional shelf segmentation.")

    # ----------------------------------------------------------------- queues
    queue_enabled: bool = Field(default=True)
    queue_metrics_interval_s: float = Field(default=2.0)
    queue_warning_threshold: float = Field(default=5.0)
    queue_high_threshold: float = Field(default=10.0)
    queue_departure_timeout_s: float = Field(
        default=45.0, description="Person still in queue region after N s is assumed served."
    )
    queue_prediction_interval_s: float = Field(default=10.0)

    # -------------------------------------------------------------- inventory
    out_of_stock_confirmation_seconds: float = Field(default=10.0)
    low_stock_margin_facings: int = Field(default=2, description="min_facings <= expected - margin → LOW_STOCK")
    empty_shelf_occupancy_threshold: float = Field(
        default=0.30, description="Shelf occupancy below this is EMPTY_SHELF candidate."
    )
    low_occupancy_threshold: float = Field(
        default=0.5, description="Occupancy below this (but above empty) → SHELF_LOW_OCCUPANCY 'getting empty' alert."
    )
    shelf_scan_interval_s: float = Field(default=1.0)
    alert_debounce_seconds: float = Field(default=30.0)
    min_facing_confidence: float = Field(default=0.35)

    # --------------------------------------------------------------- tracking
    tracker_type: str = Field(default="bytetrack.yaml")
    track_max_age_s: float = Field(default=5.0)

    # ---------------------------------------------------------------- heatmap
    heatmap_decay: float = Field(default=0.98)
    heatmap_resolution: tuple[int, int] = Field(default=(256, 144))

    # ------------------------------------------------------------- edge/offline
    edge_mode: bool = Field(default=False)
    edge_sqlite_path: Path = Field(default=PROJECT_ROOT / "data" / "edge_buffer.db")
    sync_backend_url: str = Field(default="")
    sync_interval_s: float = Field(default=60.0)

    # ----------------------------------------------------------------- server
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8100)
    log_level: str = Field(default="INFO")
    log_dir: Path = Field(default=PROJECT_ROOT / "logs")
    inference_log_enabled: bool = Field(default=True)

    # --------------------------------------------------------------- database
    database_url: str = Field(
        default=f"sqlite:///{(PROJECT_ROOT / 'data' / 'retailedge.db').as_posix()}"
    )

    # ------------------------------------------------------------- validation
    @field_validator("camera_source")
    @classmethod
    def _normalize_camera_source(cls, v: str) -> str:
        return v.strip()

    @property
    def camera_source_value(self) -> int | str:
        """Int index for local cameras, else the URL/path string."""
        return int(self.camera_source) if self.camera_source.isdigit() else self.camera_source

    def resolve_device(self, requested: str | None = None) -> str:
        """Resolve 'auto' to cuda when available, else cpu."""
        device = requested or self.model_device
        if device != "auto":
            return device
        try:
            import torch  # heavy import; done lazily

            return "cuda:0" if torch.cuda.is_available() else "cpu"
        except Exception:
            return "cpu"


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor (FastAPI dependency)."""
    for d in (PROJECT_ROOT / "data", PROJECT_ROOT / "logs"):
        d.mkdir(parents=True, exist_ok=True)
    return Settings()


settings = get_settings()
