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
  resolution: string; // e.g. "1920x1080" or "HD 1080p"
  fps: number; // e.g. 30
  streamIdentifier: string;
  uptime: number; // percentage (e.g. 99.9) or null for offline
  storageUsage: number; // percentage (e.g. 65) or null for offline
  lastSeenAt: string; // e.g. "2 min ago" or "10:42 AM"
  aiProcessingStatus: AIProcessingStatus;
  image: string; // thumbnail / placeholder path
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CameraSummary {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  activeAlerts: number;
  storageUsage: number; // percentage
  trends: {
    totalCameras: number;
    onlineCameras: number;
    offlineCameras: number;
    activeAlerts: number;
    storageUsage: number;
  };
}

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

export interface CameraHeatmapZone {
  zoneId: string;
  zoneName: string;
  intensity: number; // 0 to 1
  footfall: number;
}

export interface CameraHeatmap {
  storeId: string;
  date: string;
  generatedAt: string;
  floorPlanUrl: string;
  zones: CameraHeatmapZone[];
}

export interface CameraAnalytics {
  cameraId: string;
  peopleInFrame: number;
  entering: number;
  exiting: number;
  trafficLevel: 'Low' | 'Medium' | 'High';
  avgDwellMinutes: number;
  queueCount: number;
  uptimePct: number;
}

export interface CameraLocationMarker {
  cameraId: string;
  cameraName: string;
  zoneName: string;
  xPct: number; // percentage position on floor plan
  yPct: number;
  status: CameraStatus;
  coneAngleDeg: number;
  peopleInFrame: number;
  trafficLevel: 'Low' | 'Medium' | 'High';
}

export interface CameraFilters {
  storeId?: string;
  status?: 'ALL' | CameraStatus;
  type?: 'ALL' | CameraType;
  search?: string;
  dateRange?: 'live' | 'today' | '7days' | '30days';
}

export interface CreateCameraInput {
  name: string;
  code: string;
  storeId: string;
  zoneId: string;
  zoneName: string;
  type: CameraType;
  resolution: string;
  fps: number;
  status: CameraStatus;
  streamIdentifier: string;
  description?: string;
}
