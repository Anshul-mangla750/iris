# RetailEdge AI / IRIS — Model Architecture

This document describes the multi-stage vision and machine learning pipeline powering RetailEdge AI (IRIS).

## 1. Vision & Analytics Pipeline

```
Camera Input (Webcam / Android IP Stream / RTSP / MP4)
  │
  ├── Frame Capture Thread (OpenCV, bounded deque, auto-reconnect)
  │
  ├── 1. Person Detection & Multi-Object Tracking
  │     ├── Model: YOLOv11 nano (COCO-pretrained person class)
  │     └── Tracker: ByteTrack (continuous anonymous ID tracking)
  │
  ├── 2. Shopper Analytics Engine
  │     ├── Virtual Entry/Exit Crossing Lines (Footfall counting)
  │     ├── Store Department Polygons (Dwell time measurement)
  │     └── Density Grid (Heatmap coordinate projection)
  │
  ├── 3. Queue Intelligence Engine
  │     ├── Queue Polygon Membership (Active track counting)
  │     ├── Waiting Time & Service Rate Calculation
  │     └── Model G: Queue Congestion Classifier (XGBoost / HistGradientBoosting)
  │
  ├── 4. Shelf & Inventory Monitoring (Scheduled Interval)
  │     ├── Product Detection (Fine-tuned YOLO)
  │     ├── Shelf/Rack Boundary Detection (Polygon geometry)
  │     ├── Facing Counter vs Minimum Thresholds
  │     └── Temporal Out-of-Stock Confirmation
  │
  └── 5. Debounced Alert Engine
        └── SQLite Edge Buffer (Offline sync recovery)
```

## 2. Models Specification

| Identifier | Role | Framework | Input Resolution | Output |
|---|---|---|---|---|
| `PERSON_MODEL` | Person Detection | YOLOv11 (Ultralytics) | 640x640 | Bounding boxes (class 0) |
| `TRACKER` | Anonymous Tracking | ByteTrack / SORT | - | Track IDs (`PERSON_001`...) |
| `PRODUCT_MODEL` | Retail Facings | Fine-tuned YOLO | 640x640 / 960x960 | Product bounding boxes |
| `QUEUE_MODEL` | Queue Congestion | XGBoost / Sklearn | Tabular features | `NORMAL`, `WARNING`, `HIGH` |
| `SEGMENTATION_MODEL` | Shelf Masks | YOLO-Seg (Optional) | 640x640 | Polygon contours |

## 3. Graceful Degradation & Honesty Policy

- **No fake data:** When weights are missing, APIs strictly return `NOT_TRAINED` or `DATA_NOT_AVAILABLE`.
- **Zero-lag warmup:** When models load, a synthetic frame warm-up ensures the first live frame has zero latency spike.
