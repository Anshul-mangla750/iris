export type TimeRangeFilter = 'today' | '7d' | '30d';

export interface ShopperKpiItem {
  id: string;
  title: string;
  value: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  supportingText?: string;
  icon: 'users' | 'user-check' | 'clock' | 'cart' | 'bar-chart';
  theme: 'blue' | 'green' | 'purple' | 'emerald' | 'teal';
}

export interface ShopperFootfallPoint {
  time: string;
  today: number;
  yesterday: number;
}

export interface DemographicSegment {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface DwellTimeBucket {
  range: string;
  percentage: number;
}

export interface ZoneTrafficItem {
  id: string;
  zoneName: string;
  count: number;
}

export interface VisitedAreaItem {
  rank: number;
  zone: string;
  visits: number;
  avgDwellTime: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

export interface CustomerTypeSegment {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PeakHourInsightItem {
  id: string;
  timeSlot: string;
  footfall: number;
  avgDwellTime: string;
  conversionRate: string;
  insights: string;
  isPeak?: boolean;
}

export interface CameraAnalyticsData {
  peopleInFrame: number;
  entering: number;
  exiting: number;
  imageUrl: string;
  activeCamera: string;
}

export interface ShopperHeatmapZone {
  id: string;
  zoneName: string;
  density: number;
  trafficLevel: 'High' | 'Medium' | 'Low';
}

export interface ShopperOverviewData {
  storeId: string;
  dateFormatted: string;
  timeRange: TimeRangeFilter;
  kpis: ShopperKpiItem[];
  footfallTrend: ShopperFootfallPoint[];
  heatmapFloorPlanUrl: string;
  heatmapZones: ShopperHeatmapZone[];
  cameraAnalytics: CameraAnalyticsData;
  demographics: {
    totalShoppers: number;
    segments: DemographicSegment[];
  };
  dwellTimeDistribution: DwellTimeBucket[];
  trafficByZone: ZoneTrafficItem[];
  pathMapUrl: string;
  topVisitedAreas: VisitedAreaItem[];
  customerTypes: {
    totalUnique: number;
    segments: CustomerTypeSegment[];
  };
  peakHours: PeakHourInsightItem[];
}
