"""Structured logging setup for RetailEdge AI (console + rotating file)."""
from __future__ import annotations

import logging
import logging.handlers
import sys

from app.core.config import settings


def setup_logging(level: str | None = None) -> None:
    """Configure root logging once. Safe to call repeatedly."""
    level_name = (level or settings.log_level).upper()
    fmt = logging.Formatter(
        "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
    )

    root = logging.getLogger()
    if getattr(root, "_retailedge_configured", False):
        return
    root.setLevel(level_name)
    root._retailedge_configured = True  # type: ignore[attr-defined]

    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(fmt)
    root.addHandler(console)

    settings.log_dir.mkdir(parents=True, exist_ok=True)
    file_handler = logging.handlers.RotatingFileHandler(
        settings.log_dir / "retailedge.log", maxBytes=10 * 1024 * 1024, backupCount=5
    )
    file_handler.setFormatter(fmt)
    root.addHandler(file_handler)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
