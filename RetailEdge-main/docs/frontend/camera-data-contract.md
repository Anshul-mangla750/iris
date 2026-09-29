# Camera Data Contract

This document defines the TypeScript models, enum contracts, and JSON payload specifications used by the RetailEdge AI Camera Management frontend module (`/cameras`).

---

## 1. Camera Entity Contract

```typescript
export type CameraType = 'GENERAL' | 'SHELF' | 'CHECKOUT' | 'ENTRANCE' | 'EXIT';

export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';

export type AIProcessingStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'UNKNOWN';

export interface Camera {
  id: string;
  organizationId: string;
  storeId: string;
  zoneId: string;
  zoneName: string;
  name: string;
  code: string;
  type: CameraType;
  status: CameraStatus;
  resolution: string; // e.g. "HD 1080p", "4K UHD"
  fps: number; // e.g. 30
  streamIdentifier: string; // RTSP or WebRTC stream URI
  uptime: number; // Percentage (e.g. 99.9) or 0 for offline
  storageUsage: number; // Percentage (e.g. 65) or 0 for offline
  lastSeenAt: string; // e.g. "2 min ago" or "10:42 AM"
  aiProcessingStatus: AIProcessingStatus;
  image: string; // Snapshot / placeholder URL
  metadata?: {
    fieldOfViewDeg?: number;
    ip?: string;
    offlineReason?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
```

### JSON Representation Example

```json
{
  "id": "CAM001",
  "organizationId": "org-default",
  "storeId": "store-001",
  "zoneId": "zone-entrance",
  "zoneName": "Entrance",
  "name": "Camera 1 - Entrance",
  "code": "CAM001",
  "type": "ENTRANCE",
  "status": "ONLINE",
  "resolution": "HD 1080p",
  "fps": 30,
  "streamIdentifier": "rtsp://edge-01.local/live/cam01",
  "uptime": 99.9,
  "storageUsage": 65,
  "lastSeenAt": "2 min ago",
  "aiProcessingStatus": "ACTIVE",
  "image": "/images/cameras/cam_entrance.png",
  "metadata": {
    "fieldOfViewDeg": 95,
    "ip": "192.168.1.101"
  }
}
```

---

## 2. Camera Summary Contract (Executive KPIs)

```typescript
export interface CameraSummary {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  activeAlerts: number;
  storageUsage: number; // Percentage
  trends: {
    totalCameras: number;
    onlineCameras: number;
    offlineCameras: number;
    activeAlerts: number;
    storageUsage: number;
  };
}
```

### JSON Example

```json
{
  "totalCameras": 12,
  "onlineCameras": 10,
  "offlineCameras": 2,
  "activeAlerts": 8,
  "storageUsage": 62,
  "trends": {
    "totalCameras": 20,
    "onlineCameras": 11,
    "offlineCameras": -33,
    "activeAlerts": -27,
    "storageUsage": 5
  }
}
```

---

## 3. Camera Health Contract

```typescript
export interface CameraHealthItem {
  cameraId: string;
  cameraName: string;
  status: CameraStatus;
  uptime: string;
  storageUsage: string;
  fps: number;
  resolution: string;
  lastCheckedAt: string;
}
```

---

## 4. Camera AI Insight Contract

```typescript
export type InsightType =
  | 'HIGH_FOOTFALL'
  | 'QUEUE_INCREASE'
  | 'UNUSUAL_ACTIVITY'
  | 'EMPTY_SHELF'
  | 'NORMAL_ACTIVITY';

export type InsightSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface CameraInsight {
  id: string;
  cameraId?: string;
  storeId: string;
  zoneId?: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  recommendation?: string;
  timestamp: string;
  timeAgo: string;
}
```

---

## 5. Footfall Heatmap Contract

```typescript
export interface CameraHeatmapZone {
  zoneId: string;
  zoneName: string;
  intensity: number; // 0.0 to 1.0 normalized
  footfall: number;
}

export interface CameraHeatmap {
  storeId: string;
  date: string;
  generatedAt: string;
  floorPlanUrl: string;
  zones: CameraHeatmapZone[];
}
```

---

## 6. Privacy & Security Constraints

1. **No Personally Identifiable Information (PII)**:
   - Neither the camera feed endpoints nor analytics contracts return faces, names, phone numbers, or customer IDs.
2. **Anonymous Aggregates Only**:
   - People counts (`peopleInFrame`, `entering`, `exiting`) are purely integer counters.
3. **No Stream Credentials in Frontend State**:
   - RTSP passwords and authorization tokens remain on the edge server / backend proxy and are never delivered to client components.
