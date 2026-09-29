export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED';

export type AlertType =
  | 'QUEUE_CONGESTION'
  | 'OUT_OF_STOCK'
  | 'LOW_STOCK'
  | 'PLANOGRAM_VIOLATION'
  | 'HIGH_TRAFFIC'
  | 'EDGE_OFFLINE'
  | 'SYSTEM_SYNC'
  | 'EMPTY_SHELF';

export type AlertSourceModule =
  | 'INVENTORY'
  | 'QUEUE'
  | 'PLANOGRAM'
  | 'SHOPPER'
  | 'SYSTEM';

export interface AlertHistoryEntry {
  id?: string;
  timestamp: string;
  action: string;
  description: string;
  actor?: string;
  dotColor?: 'red' | 'blue' | 'green' | 'amber';
}

export interface Alert {
  id: string;
  organizationId: string;
  storeId: string;
  storeName: string;
  zoneId?: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  recommendation?: string;
  recommendations: string[];
  status: AlertStatus;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  sourceModule: AlertSourceModule;
  sourceId?: string;
  location?: string;
  product?: string;
  sku?: string;
  currentStock?: string | number;
  expectedStock?: string | number;
  camera?: string;
  confidence?: string | number;
  image?: string;
  metadata?: Record<string, unknown>;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  history: AlertHistoryEntry[];
}

export interface AlertSummaryTrends {
  total: number;
  critical: number;
  warning: number;
  info: number;
  resolved: number;
}

export interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
  info: number;
  resolved: number;
  trends: AlertSummaryTrends;
}

export interface AlertTrendPoint {
  time: string;
  critical: number;
  warning: number;
  info: number;
}

export interface AlertCategoryItem {
  name: string;
  key: AlertSourceModule;
  count: number;
  percentage: number;
  color: string;
}

export interface AlertStatusItem {
  label: string;
  status: AlertStatus;
  count: number;
  color: string;
}

export interface AlertFilters {
  severity: AlertSeverity[];
  category: AlertSourceModule[];
  status: AlertStatus[];
  timeRange: string;
  storeId: string;
  search?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}
