export type MetricTrend = 'up' | 'down' | 'neutral';

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  trendText?: string;
  trendDirection?: MetricTrend;
  subtitle?: string;
  icon: 'users' | 'clock' | 'queue' | 'package' | 'box' | 'health';
  theme: 'blue' | 'purple' | 'indigo' | 'red' | 'emerald' | 'teal';
  isAlert?: boolean;
}

export interface FootfallPoint {
  time: string;
  today: number;
  yesterday: number;
}

export interface CustomerDistributionItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface HeatmapZone {
  id: string;
  name: string;
  density: number;
  level: 'High' | 'Medium' | 'Low';
  x: number;
  y: number;
}

export interface CameraFeedItem {
  id: string;
  name: string;
  category: 'all' | 'entrance' | 'aisles' | 'checkout';
  timestamp: string;
  isLive: boolean;
  imageUrl: string;
}

export interface QueueCounterItem {
  id: string;
  name: string;
  peopleCount: number;
  waitTimeMinutes: number;
  status: 'High' | 'Normal' | 'Open';
  capacityPercent: number;
}

export interface InventoryStatusSummary {
  totalProducts: number;
  inStock: { count: number; percent: number };
  lowStock: { count: number; percent: number };
  outOfStock: { count: number; percent: number };
}

export interface PlanogramSummary {
  compliancePercent: number;
  correct: number;
  misplaced: number;
  missing: number;
}

export interface RecentAlertItem {
  id: string;
  type: 'out-of-stock' | 'high-queue' | 'misplaced' | 'camera-offline';
  message: string;
  subMessage?: string;
  timeAgo: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface AIInsightItem {
  id: string;
  title: string;
  description: string;
  type: 'footfall' | 'queue' | 'restock' | 'layout';
  icon: 'trending' | 'clock' | 'package' | 'target';
}

export interface CategoryPerformanceItem {
  id: string;
  name: string;
  sharePercent: number;
  changePercent: number;
  trend: 'up' | 'down';
  iconName: 'beverages' | 'snacks' | 'personal-care' | 'dairy' | 'household';
}

export interface DwellTimePoint {
  zone: string;
  minutes: number;
}

export interface FootfallByHourPoint {
  time: string;
  visitors: number;
}

export interface LowStockProductItem {
  id: string;
  name: string;
  currentStock: number;
  threshold: number;
  status: 'Low Stock' | 'Out of Stock';
  iconName?: string;
}

export interface SalesFootfallPoint {
  date: string;
  footfall: number;
  sales: number;
}

export interface DeviceStatusItem {
  id: string;
  name: string;
  type: 'camera' | 'edge' | 'pos';
  status: 'Online' | 'Connected' | 'Offline';
  uptime: string;
}

export interface StoreOption {
  id: string;
  code: string;
  name: string;
  city: string;
}

export interface DashboardOverviewData {
  store: StoreOption;
  greeting: {
    userName: string;
    message: string;
    dateFormatted: string;
    timeFormatted: string;
    temperature: string;
    location: string;
  };
  kpis: KpiItem[];
  footfallTrend: FootfallPoint[];
  customerDistribution: {
    totalVisitors: number;
    items: CustomerDistributionItem[];
  };
  storeHeatmap: {
    isLive: boolean;
    floorPlanUrl: string;
    zones: HeatmapZone[];
  };
  cameras: CameraFeedItem[];
  queueCounters: QueueCounterItem[];
  inventoryStatus: InventoryStatusSummary;
  planogramCompliance: PlanogramSummary;
  recentAlerts: RecentAlertItem[];
  aiInsights: AIInsightItem[];
  topCategories: CategoryPerformanceItem[];
  dwellTimeByZone: DwellTimePoint[];
  footfallByHour: FootfallByHourPoint[];
  lowStockProducts: LowStockProductItem[];
  salesVsFootfall: SalesFootfallPoint[];
  deviceStatuses: DeviceStatusItem[];
}
