"""ModelManager: centralized model loading, status, device selection, and warmup.

Status values are factual:
- READY:        model file exists and loaded successfully
- NOT_TRAINED:  model file does not exist (never fake READY)
- ERROR:        file exists but loading/inference failed
- DISABLED:     disabled via configuration
"""
from __future__ import annotations

import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger(__name__)


@dataclass
class ModelInfo:
    name: str
    role: str
    path: Path
    loader: Callable[[], Any] | None = None
    status: str = "NOT_TRAINED"
    device: str | None = None
    loaded_obj: Any = None
    latency_ms: float | None = None
    last_loaded: float | None = None
    version: str | None = None
    detail: str | None = None
    lock: threading.Lock = field(default_factory=threading.Lock)


class ModelManager:
    """Loads and supervises all models. Never fabricates availability."""

    def __init__(self) -> None:
        self._models: dict[str, ModelInfo] = {}
        self._lock = threading.RLock()
        self._register_all()

    # ------------------------------------------------------------ registry
    def _register_all(self) -> None:
        defs: list[tuple[str, str, Path, Callable[[], Any] | None, bool]] = [
            ("PERSON_MODEL", "person_detection", settings.person_model_path,
             self._load_yolo, True),
            ("PRODUCT_MODEL", "product_detection", settings.product_model_path,
             self._load_yolo, settings.product_enabled),
            ("RACK_MODEL", "rack_detection", settings.rack_model_path,
             self._load_yolo, settings.shelf_enabled),
            ("SHELF_MODEL", "shelf_detection", settings.shelf_model_path,
             self._load_yolo, settings.shelf_enabled),
            ("SEGMENTATION_MODEL", "shelf_segmentation", settings.segmentation_model_path,
             self._load_yolo, settings.segmentation_enabled),
            ("QUEUE_MODEL", "queue_congestion", settings.queue_model_path,
             self._load_joblib, True),
        ]
        with self._lock:
            for name, role, path, loader, enabled in defs:
                self._models[name] = ModelInfo(
                    name=name, role=role, path=path, loader=loader,
                    status="DISABLED" if not enabled else "NOT_TRAINED",
                )

    def _load_yolo(self) -> Any:
        from ultralytics import YOLO  # deferred: heavy import

        return YOLO

    def _load_joblib(self) -> Any:
        import joblib

        return joblib

    # -------------------------------------------------------------- status
    def status(self) -> list[dict[str, Any]]:
        with self._lock:
            # Auto-detect if any NOT_TRAINED model now has its weights present on disk
            for m in list(self._models.values()):
                if m.status == "NOT_TRAINED" and m.path and Path(m.path).exists():
                    self.load(m.name)

            out = []
            for m in self._models.values():
                out.append({
                    "name": m.name,
                    "role": m.role,
                    "status": m.status,
                    "path": str(m.path) if m.path else None,
                    "device": m.device,
                    "latency_ms": m.latency_ms,
                    "last_loaded": m.last_loaded,
                    "version": m.version,
                    "detail": m.detail,
                })
            return out

    def get(self, name: str) -> ModelInfo | None:
        return self._models.get(name)

    def ready_count(self) -> tuple[int, int]:
        with self._lock:
            ready = sum(1 for m in self._models.values() if m.status == "READY")
            return ready, len(self._models)

    # -------------------------------------------------------------- load
    def load(self, name: str) -> ModelInfo:
        """Load one model by registry name. Returns ModelInfo with factual status."""
        info = self._models[name]
        with info.lock:
            if info.status == "DISABLED":
                return info
            if not Path(info.path).exists():
                info.status = "NOT_TRAINED"
                info.detail = f"model file not found: {info.path}"
                logger.warning("%s %s", name, info.detail)
                return info
            try:
                t0 = time.perf_counter()
                module = info.loader()  # module-level loader (YOLO class or joblib)
                if info.role == "queue_congestion":
                    obj = module.load(str(info.path))
                else:
                    obj = module(str(info.path))  # instantiate YOLO(weights)
                load_s = time.perf_counter() - t0
                device = settings.resolve_device()
                if hasattr(obj, "to"):  # torch module
                    obj.to(device)
                info.loaded_obj = obj
                info.device = device
                info.status = "READY"
                info.last_loaded = time.time()
                info.detail = f"loaded in {load_s:.2f}s"
                logger.info("%s READY on %s (%.2fs)", name, device, load_s)
            except Exception as exc:
                info.status = "ERROR"
                info.detail = str(exc)[:300]
                logger.exception("%s failed to load: %s", name, exc)
            return info

    def load_all(self) -> None:
        for name in list(self._models):
            self.load(name)

    def warm(self, name: str, input_size: int = 640) -> None:
        """Run one dummy inference to warm up the model (avoids first-frame lag)."""
        info = self._models.get(name)
        if not info or info.status != "READY" or info.role == "queue_congestion":
            return
        try:
            import numpy as np

            dummy = np.zeros((input_size, input_size, 3), dtype=np.uint8)
            t0 = time.perf_counter()
            info.loaded_obj.predict(dummy, verbose=False, device=info.device)
            info.latency_ms = (time.perf_counter() - t0) * 1000
            logger.info("%s warmed (%.0f ms)", name, info.latency_ms)
        except Exception as exc:
            logger.warning("%s warmup failed: %s", name, exc)

    def set_version(self, name: str, version: str) -> None:
        info = self._models.get(name)
        if info:
            info.version = version


_model_manager: ModelManager | None = None
_mm_lock = threading.Lock()


def get_model_manager() -> ModelManager:
    global _model_manager
    with _mm_lock:
        if _model_manager is None:
            _model_manager = ModelManager()
        return _model_manager
