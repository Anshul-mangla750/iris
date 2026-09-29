"""RetailEdge AI — FastAPI application entrypoint (models loaded)."""
from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

from app.api.routes import router
from app.core.config import settings
from app.core.logging_config import get_logger, setup_logging
from app.database.models import get_database

REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIST = REPO_ROOT / "frontend" / "dist"

setup_logging()
logger = get_logger(__name__)

# CPU inference throughput: allow torch to use more of the machine (Windows default
# is often 4 of 8 logical cores). Person/product YOLO latency dominates the live
# pipeline; +2 threads measurably cuts it. Tuned via env TORCH_NUM_THREADS.
import os  # noqa: E402
import torch  # noqa: E402

torch.set_num_threads(int(os.getenv("TORCH_NUM_THREADS", "6")))


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("RetailEdge AI starting (store=%s device=%s)",
                settings.store_id, settings.resolve_device())
    get_database()  # create tables
    # models load lazily on first use; PRE-LOAD the queue model so status is honest
    from app.models.model_manager import get_model_manager

    mm = get_model_manager()
    mm.load_all()
    logger.info("model status: %s",
                {m["name"]: m["status"] for m in mm.status()})
    yield
    logger.info("RetailEdge AI shutting down")
    pm = _pipeline_manager_ref()
    if pm is not None and pm.live is not None:
        pm.stop_live()


def _pipeline_manager_ref():
    from app.pipelines.live_camera import get_pipeline_manager

    try:
        return get_pipeline_manager()
    except Exception:
        return None


app = FastAPI(
    title="RetailEdge AI",
    description="Real-time retail analytics: shopper, inventory, shelf, and queue "
                "intelligence from actual camera inference. No fabricated data.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root() -> Any:
    # Production single-origin mode: serve the built SPA from the same port.
    if (FRONTEND_DIST / "index.html").exists():
        return FileResponse(FRONTEND_DIST / "index.html")
    return {
        "service": "RetailEdge AI",
        "docs": "/docs",
        "health": "/health",
        "stream": "/camera/stream",
    }


# SPA serving must be registered LAST so API routes always match first.
# - Real files (assets/*, favicon) are served from frontend/dist.
# - Unknown client-side routes (e.g. /geometry) fall through to index.html.
# - Unknown API paths stay JSON 404 (matching the vite dev proxy prefixes).
_API_PREFIXES = ("/camera", "/health", "/models", "/shopper", "/inventory",
                 "/shelves", "/racks", "/queue", "/alerts", "/metrics",
                 "/video", "/config", "/edge")


if (FRONTEND_DIST / "index.html").exists():
    @app.api_route("/{path:path}", methods=["GET", "HEAD"], include_in_schema=False)
    def spa_fallback(path: str) -> Any:
        full = "/" + path  # path param arrives WITHOUT the leading slash
        if full.startswith(_API_PREFIXES):
            raise HTTPException(404, "Not Found")
        dist = FRONTEND_DIST.resolve()
        candidate = (dist / path).resolve()
        if path and candidate.is_relative_to(dist) and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(FRONTEND_DIST / "index.html")
