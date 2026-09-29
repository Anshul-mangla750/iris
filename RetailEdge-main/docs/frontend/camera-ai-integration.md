# Camera AI / ML Integration Architecture

This guide explains how AI/ML computer vision pipelines connect to the RetailEdge AI frontend console (`/cameras`).

---

## 1. System Integration Flow

```
Edge CCTV Cameras (RTSP/ONVIF)
  │
  ▼
Edge Computing Box (NVIDIA Jetson / Local Server running YOLO / OpenCV / ByteTrack)
  │
  ▼
RetailEdge AI Integration Gateway (Python/FastAPI Service)
  │
  ▼
Core Backend Services (/api/cameras/*)
  │
  ▼
Frontend cameraService.ts
  │
  ▼
Camera Management UI (/cameras)
```

---

## 2. Decoupled Architecture Principles

1. **Frontend Has Zero Model Dependencies**:
   - The UI never calls OpenCV, YOLO, WebRTC direct sockets, or PyTorch inference servers directly.
   - All computer vision outputs are normalized into clean JSON contracts.
2. **Anonymous Aggregates Only**:
   - The AI pipeline computes spatial bounding boxes, counts, and tracklets on the edge.
   - Bounding boxes are converted to numbers (`peopleInFrame`, `queueCount`, `heatmap.intensity`) before reaching the API layer.
3. **No Direct RTSP In Browser**:
   - Edge devices stream via RTSP locally; for browser viewing, the backend proxies via HLS or WebRTC gateway.

---

## 3. Expected AI-Derived Outputs

| AI Output Metric | Expected Type | Example Value | Destination UI Component |
|------------------|---------------|---------------|--------------------------|
| `peopleInFrame` | `number` | `12` | `CameraAnalyticsModal`, `StoreCameraMap` popup |
| `entering` | `number` (15m window) | `7` | `CameraAnalyticsModal` |
| `exiting` | `number` (15m window) | `5` | `CameraAnalyticsModal` |
| `trafficLevel` | `'Low' \| 'Medium' \| 'High'` | `'High'` | `CameraAnalyticsModal`, `StoreCameraMap` popup |
| `avgDwellMinutes` | `number` | `6.4` | `CameraAnalyticsModal` |
| `queueCount` | `number` | `4` | `CameraAnalyticsModal` |
| `zoneIntensity` | `number` (0.0 to 1.0) | `0.92` | `FootfallHeatmap` |
| `emptyShelfDetected` | `boolean` | `true` | `CameraInsights`, Central `/alerts` |
| `unusualActivity` | `boolean` | `true` | `CameraInsights`, Central `/alerts` |
| `aiProcessingStatus` | `'ACTIVE' \| 'INACTIVE' \| 'ERROR'` | `'ACTIVE'` | `CameraDetailsDrawer` |

---

## 4. How the AI/ML Team Connects Real Models

1. **Pushing Inference Telemetry**:
   The edge server publishes inference results via Kafka/MQTT or HTTP POST:
   ```json
   POST /api/cameras/CAM001/telemetry
   {
     "peopleCount": 12,
     "entriesLast15m": 7,
     "exitsLast15m": 5,
     "averageDwellSec": 384,
     "fps": 30.0,
     "aiStatus": "ACTIVE"
   }
   ```
2. **Triggering AI Insights & Alerts**:
   When an inference rule triggers (e.g. queue length > 8 or shelf empty for > 10m):
   ```json
   POST /api/cameras/CAM004/insights
   {
     "type": "QUEUE_INCREASE",
     "severity": "CRITICAL",
     "title": "Queue length increased at Checkout",
     "description": "12 people in queue (threshold: 8)",
     "recommendation": "Open additional billing counter POS-04 immediately"
   }
   ```
3. **Frontend Ingestion**:
   - `cameraService.ts` queries these endpoints and populates the UI automatically without requiring any code edits in React.
