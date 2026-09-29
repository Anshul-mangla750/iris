# RetailEdge AI — Shopper Analytics AI/ML Handoff Specification

This document details the interface expectations between the AI / Computer Vision / Edge processing pipeline and the RetailEdge AI Shopper Analytics frontend (`/shopper`).

---

## 1. Core Architecture Boundary

```
┌─────────────────────────────────────────────────────────────┐
│ Edge Device / CCTV Cameras / OpenCV / YOLOv8 / ByteTrack   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ AI / ML Ingestion Engine (Object Tracking & Zone Heatmaps)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend API Gateway & Socket.IO Broadcaster                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend UI Components (/shopper)                           │
│ - Strict Presentation & Interactive Visualizations          │
│ - Zero Computer Vision / Detection Logic in Browser         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Expected AI Pipeline Payloads

### A. Live Camera People Tracking & Counting
The `LiveCameraAnalytics` component expects the edge processor to emit aggregated metrics per camera feed:

```json
{
  "camera_id": "cam-entrance-01",
  "store_id": "store-001",
  "timestamp": "2026-09-24T15:24:12Z",
  "people_in_frame": 12,
  "entering_count": 7,
  "exiting_count": 5,
  "detections": [
    {
      "tracking_id": 1042,
      "class": "person",
      "confidence": 0.94,
      "bbox": [120, 45, 60, 180]
    }
  ]
}
```

### B. Store Floor Plan Heatmap
The `ShopperStoreHeatmap` component visualizes traffic density generated from spatial tracking points:

```json
{
  "store_id": "store-001",
  "timestamp": "2026-09-24T15:24:00Z",
  "zones": [
    { "zone_id": "z1", "zone_name": "Aisle 1 Center", "density": 85, "traffic_level": "High" },
    { "zone_id": "z2", "zone_name": "Aisle 2 Endcap", "density": 78, "traffic_level": "High" },
    { "zone_id": "z3", "zone_name": "Fresh Produce", "density": 65, "traffic_level": "Medium" },
    { "zone_id": "z4", "zone_name": "Entrance Corridor", "density": 40, "traffic_level": "Low" }
  ]
}
```

### C. Customer Path Traversal Analysis
The `PathAnalysis` component consumes normalized path segments identified through multi-camera re-identification (ReID):

```json
{
  "store_id": "store-001",
  "paths": [
    {
      "path_type": "ENTRY",
      "label": "Entry",
      "color": "#10B981",
      "start_zone": "Entrance",
      "end_zone": "Fresh Produce"
    },
    {
      "path_type": "MAIN_PATH",
      "label": "Main Path",
      "color": "#2563EB",
      "waypoints": ["Produce", "Beverages", "Snacks", "Checkout"]
    },
    {
      "path_type": "POPULAR_PATH",
      "label": "Popular Path",
      "color": "#F59E0B",
      "waypoints": ["Produce", "Bakery", "Personal Care", "Checkout"]
    },
    {
      "path_type": "EXIT",
      "label": "Exit",
      "color": "#EF4444",
      "terminal_zone": "Checkout Area"
    }
  ]
}
```

### D. Zone Dwell Time & Engagement
The `TrafficByZone` and `DwellTimeDistribution` components expect dwell statistics computed across shopper journey tracks:

```json
{
  "store_id": "store-001",
  "period": "today",
  "zones": [
    { "zone_id": "z-produce", "zone_name": "Fresh Produce", "footfall": 320, "avg_dwell_minutes": 6.2 },
    { "zone_id": "z-beverages", "zone_name": "Beverages", "footfall": 245, "avg_dwell_minutes": 5.1 },
    { "zone_id": "z-snacks", "zone_name": "Snacks", "footfall": 198, "avg_dwell_minutes": 4.8 }
  ],
  "dwell_time_buckets": [
    { "range": "0-2 min", "percentage": 28 },
    { "range": "2-5 min", "percentage": 32 },
    { "range": "5-10 min", "percentage": 20 },
    { "range": "10-20 min", "percentage": 12 },
    { "range": "> 20 min", "percentage": 8 }
  ]
}
```

---

## 3. Privacy & Compliance Mandates
- **No Face Recognition**: The frontend strictly displays aggregated demographics (gender and broad age groups) and trajectory counts.
- **No Biometrics or PII**: Personal identities, facial embeddings, and individual tracking records must remain sequestered within local edge processing nodes and not emitted over public WebSocket or REST APIs.
