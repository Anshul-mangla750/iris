"""Database models (SQLAlchemy ORM).

Two databases:
- Primary: PostgreSQL or SQLite (config DATABASE_URL) for stores/cameras/catalog/planograms.
- Edge:    SQLite buffer (data/edge_buffer.db) for offline event storage, synced later.
"""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    create_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker

from app.core.config import settings


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


# ------------------------------------------------------------------ catalogue


class Store(Base):
    __tablename__ = "stores"

    store_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    timezone: Mapped[str] = mapped_column(String(64), default="UTC")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Camera(Base):
    __tablename__ = "cameras"

    camera_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    store_id: Mapped[str] = mapped_column(ForeignKey("stores.store_id"), index=True)
    name: Mapped[str] = mapped_column(String(255), default="")
    source: Mapped[str] = mapped_column(String(512), default="0")
    role: Mapped[str] = mapped_column(String(32), default="shelf")  # shelf | entrance | queue
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    config: Mapped[dict] = mapped_column(JSON, default=dict)


class Rack(Base):
    __tablename__ = "racks"

    rack_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    name: Mapped[str] = mapped_column(String(255), default="")
    camera_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    bbox: Mapped[list | None] = mapped_column(JSON, nullable=True)  # [x1,y1,x2,y2]


class Shelf(Base):
    __tablename__ = "shelves"

    shelf_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    rack_id: Mapped[str] = mapped_column(ForeignKey("racks.rack_id"), index=True)
    name: Mapped[str] = mapped_column(String(255), default="")
    polygon: Mapped[list | None] = mapped_column(JSON, nullable=True)  # [[x,y], ...]
    order_index: Mapped[int] = mapped_column(Integer, default=0)


class Product(Base):
    __tablename__ = "products"

    product_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    sku: Mapped[str] = mapped_column(String(64), index=True)
    name: Mapped[str] = mapped_column(String(255))
    brand: Mapped[str] = mapped_column(String(128), default="")
    category: Mapped[str] = mapped_column(String(128), default="")
    # facing thresholds (configurable per product)
    expected_facing: Mapped[int] = mapped_column(Integer, default=0)
    minimum_facing: Mapped[int] = mapped_column(Integer, default=0)
    maximum_facing: Mapped[int] = mapped_column(Integer, default=0)
    default_shelf_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    reference_image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    reference_embedding: Mapped[list | None] = mapped_column(JSON, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class PlanogramItem(Base):
    __tablename__ = "planograms"
    __table_args__ = (UniqueConstraint("store_id", "rack_id", "shelf_id", "position"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    rack_id: Mapped[str] = mapped_column(String(64))
    shelf_id: Mapped[str] = mapped_column(String(64))
    position: Mapped[int] = mapped_column(Integer)
    product_id: Mapped[str] = mapped_column(String(64))
    expected_facing: Mapped[int] = mapped_column(Integer, default=1)


# -------------------------------------------------------------------- events


class ShopperEvent(Base):
    __tablename__ = "shopper_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    camera_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    track_id: Mapped[int] = mapped_column(Integer, index=True)
    event_type: Mapped[str] = mapped_column(String(32), index=True)  # ENTRY|EXIT|ZONE_ENTER|ZONE_EXIT
    zone_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    extra: Mapped[dict] = mapped_column(JSON, default=dict)


class TrackRecord(Base):
    __tablename__ = "tracks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    camera_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    track_id: Mapped[int] = mapped_column(Integer)
    first_seen: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    last_seen: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    total_dwell_s: Mapped[float] = mapped_column(Float, default=0.0)
    zones_visited: Mapped[list] = mapped_column(JSON, default=list)

    __table_args__ = (UniqueConstraint("store_id", "camera_id", "track_id"),)


class InventoryEvent(Base):
    __tablename__ = "inventory_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    camera_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    rack_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    shelf_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    product_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    event_type: Mapped[str] = mapped_column(String(48), index=True)
    detected_facing: Mapped[int] = mapped_column(Integer, default=0)
    expected_facing: Mapped[int] = mapped_column(Integer, default=0)
    occupancy_ratio: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    detail: Mapped[dict] = mapped_column(JSON, default=dict)


class QueueEvent(Base):
    __tablename__ = "queue_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    camera_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    queue_id: Mapped[str] = mapped_column(String(64), index=True)
    queue_length: Mapped[int] = mapped_column(Integer, default=0)
    arrival_rate: Mapped[float] = mapped_column(Float, default=0.0)
    service_rate: Mapped[float] = mapped_column(Float, default=0.0)
    average_wait_s: Mapped[float] = mapped_column(Float, default=0.0)
    active_counters: Mapped[int] = mapped_column(Integer, default=1)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class AlertRecord(Base):
    __tablename__ = "alerts"

    alert_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    camera_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    rack_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    shelf_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    product_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    alert_type: Mapped[str] = mapped_column(String(48), index=True)
    severity: Mapped[str] = mapped_column(String(16), default="INFO")
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    evidence_frame: Mapped[str | None] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="OPEN")  # OPEN | RESOLVED
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class DailyMetric(Base):
    __tablename__ = "daily_metrics"
    __table_args__ = (UniqueConstraint("date", "store_id", "metric"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(10), index=True)  # YYYY-MM-DD
    store_id: Mapped[str] = mapped_column(String(64))
    metric: Mapped[str] = mapped_column(String(64))
    value: Mapped[float] = mapped_column(Float, default=0.0)


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    name: Mapped[str] = mapped_column(String(64), primary_key=True)
    version: Mapped[str] = mapped_column(String(32), default="v1")
    path: Mapped[str] = mapped_column(String(512), default="")
    status: Mapped[str] = mapped_column(String(24), default="NOT_TRAINED")
    device: Mapped[str] = mapped_column(String(32), default="cpu")
    metrics: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class QueueObservation(Base):
    """Training observation row for the queue congestion model (real, from cameras)."""

    __tablename__ = "queue_observations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    store_id: Mapped[str] = mapped_column(String(64), index=True)
    camera_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    queue_id: Mapped[str] = mapped_column(String(64), index=True)
    queue_length: Mapped[int] = mapped_column(Integer)
    arrival_rate: Mapped[float] = mapped_column(Float)
    service_rate: Mapped[float] = mapped_column(Float)
    active_counters: Mapped[int] = mapped_column(Integer, default=1)
    average_wait_s: Mapped[float] = mapped_column(Float, default=0.0)
    rolling_queue_5m: Mapped[float] = mapped_column(Float, default=0.0)
    rolling_queue_10m: Mapped[float] = mapped_column(Float, default=0.0)
    hour: Mapped[int] = mapped_column(Integer)
    day_of_week: Mapped[int] = mapped_column(Integer)
    label: Mapped[str] = mapped_column(String(16))  # NORMAL | WARNING | HIGH (documented rule)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class SyncState(Base):
    __tablename__ = "sync_state"

    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    last_sync: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


# ---------------------------------------------------------------- engine setup


class Database:
    """Primary database handle (PostgreSQL or SQLite via DATABASE_URL)."""

    def __init__(self, url: str | None = None):
        self.url = url or settings.database_url
        self.engine = create_engine(
            self.url,
            connect_args={"check_same_thread": False} if self.url.startswith("sqlite") else {},
        )
        self.SessionLocal = sessionmaker(bind=self.engine, expire_on_commit=False)

    def create_all(self) -> None:
        Base.metadata.create_all(self.engine)

    def session(self):
        return self.SessionLocal()


_database: Database | None = None


def get_database() -> Database:
    global _database
    if _database is None:
        _database = Database()
        _database.create_all()
    return _database
