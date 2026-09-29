# Camera Real-Time WebSocket Events Guide

This document defines the WebSocket / Socket.IO event contracts for real-time telemetry and camera health updates on the RetailEdge AI Camera Management page (`/cameras`).

---

## Supported Socket.IO Events

### 1. `camera.created`
- **Direction**: Server → Client
- **Description**: Emitted when a new camera is provisioned in the store.
- **Payload**:
  ```json
  {
    "camera": {
      "id": "CAM007",
      "name": "Camera 7 - Electronics",
      "code": "CAM007",
      "storeId": "store-001",
      "zoneName": "Electronics",
      "status": "ONLINE",
      "resolution": "HD 1080p",
      "fps": 30,
      "uptime": 100,
      "storageUsage": 45
    }
  }
  ```
- **Frontend Behavior**:
  - Adds camera to `cameras` grid.
  - Updates `totalCameras` and `onlineCameras` KPI counters.
  - Appends camera to health status table.

---

### 2. `camera.updated`
- **Direction**: Server → Client
- **Description**: Emitted when camera configuration, FPS, or mount zone is edited.
- **Payload**:
  ```json
  {
    "cameraId": "CAM002",
    "updates": {
      "name": "Camera 2 - Aisle 1 (Snacks & Bakery)",
      "fps": 30
    }
  }
  ```
- **Frontend Behavior**:
  - Updates in-memory camera card and details drawer.

---

### 3. `camera.status_updated`
- **Direction**: Server → Client
- **Description**: Emitted when a camera goes offline or recovers online.
- **Payload**:
  ```json
  {
    "cameraId": "CAM005",
    "previousStatus": "OFFLINE",
    "newStatus": "ONLINE",
    "lastSeenAt": "Just now",
    "uptime": 99.8
  }
  ```
- **Frontend Behavior**:
  - Toggles camera feed card status badge from Offline to Live.
  - Changes map marker pin on floor plan from Red to Green.
  - Recalculates `onlineCameras` (+1) and `offlineCameras` (-1) in KPI cards.
  - Updates health status table row.

---

### 4. `camera.health_updated`
- **Direction**: Server → Client
- **Description**: Periodic 30-second heartbeat reporting storage consumption and uptime.
- **Payload**:
  ```json
  {
    "cameraId": "CAM001",
    "uptime": "99.9%",
    "storageUsage": "66%",
    "lastCheckedAt": "Just now"
  }
  ```
- **Frontend Behavior**:
  - Updates storage percentage and uptime in `CameraHealthTable`.
  - Recalculates organization-wide `storageUsage` KPI card.

---

### 5. `camera.insight_created`
- **Direction**: Server → Client
- **Description**: Emitted when the AI edge engine detects an operational anomaly or congestion.
- **Payload**:
  ```json
  {
    "insight": {
      "id": "ins-06",
      "cameraId": "CAM004",
      "storeId": "store-001",
      "type": "QUEUE_INCREASE",
      "severity": "CRITICAL",
      "title": "Queue length exceeded at Checkout Zone",
      "description": "14 people in queue",
      "timeAgo": "Just now"
    }
  }
  ```
- **Frontend Behavior**:
  - Prepends the insight to `AI Insights from Cameras` card with highlight animation.
  - Triggers red alert notification badge update on the sidebar `Alerts & Notifications` item.

---

### 6. `camera.alert_created`
- **Direction**: Server → Client
- **Description**: High-priority alert propagated to the central Operations Center.
- **Payload**:
  ```json
  {
    "alertId": "alert-901",
    "cameraId": "CAM005",
    "storeId": "store-001",
    "severity": "CRITICAL",
    "title": "Camera 5 - Dairy Section Offline",
    "timestamp": "2024-09-24T15:28:00Z"
  }
  ```
- **Frontend Behavior**:
  - Increments `activeAlerts` KPI card.
  - Links to Central `/alerts?cameraId=CAM005` page.
