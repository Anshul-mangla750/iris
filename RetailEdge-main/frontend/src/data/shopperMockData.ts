import type {
  ShopperOverviewData,
  ShopperKpiItem,
  ShopperFootfallPoint,
  DemographicSegment,
  DwellTimeBucket,
  ZoneTrafficItem,
  VisitedAreaItem,
  CustomerTypeSegment,
  PeakHourInsightItem,
  CameraAnalyticsData,
  ShopperHeatmapZone,
} from '../types/shopper';

export const SHOPPER_KPIS: ShopperKpiItem[] = [
  {
    id: 'kpi-footfall',
    title: 'Total Footfall',
    value: '1,482',
    trendText: '↑ 12% vs yesterday',
    trendDirection: 'up',
    icon: 'users',
    theme: 'blue',
  },
  {
    id: 'kpi-unique',
    title: 'Unique Shoppers',
    value: '1,126',
    trendText: '↑ 8% vs yesterday',
    trendDirection: 'up',
    icon: 'user-check',
    theme: 'green',
  },
  {
    id: 'kpi-dwell',
    title: 'Avg Dwell Time',
    value: '8.4 min',
    trendText: '↑ 6% vs yesterday',
    trendDirection: 'up',
    icon: 'clock',
    theme: 'purple',
  },
  {
    id: 'kpi-conversion',
    title: 'Conversion Rate',
    value: '24%',
    trendText: '↑ 3% vs yesterday',
    trendDirection: 'up',
    icon: 'cart',
    theme: 'emerald',
  },
  {
    id: 'kpi-peak',
    title: 'Peak Hour',
    value: '5 PM - 7 PM',
    supportingText: 'Highest footfall',
    icon: 'bar-chart',
    theme: 'teal',
  },
];

export const SHOPPER_FOOTFALL_TREND: ShopperFootfallPoint[] = [
  { time: '6AM', today: 40, yesterday: 35 },
  { time: '9AM', today: 105, yesterday: 85 },
  { time: '12PM', today: 195, yesterday: 145 },
  { time: '3PM', today: 125, yesterday: 140 },
  { time: '6PM', today: 210, yesterday: 165 },
  { time: '9PM', today: 160, yesterday: 130 },
];

export const DEMOGRAPHIC_SEGMENTS: DemographicSegment[] = [
  { name: 'Male', value: 770, percentage: 52, color: '#10B981' },
  { name: 'Female', value: 637, percentage: 43, color: '#34D399' },
  { name: 'Children', value: 75, percentage: 5, color: '#F59E0B' },
];

export const DWELL_TIME_DISTRIBUTION: DwellTimeBucket[] = [
  { range: '0-2 min', percentage: 28 },
  { range: '2-5 min', percentage: 32 },
  { range: '5-10 min', percentage: 20 },
  { range: '10-20 min', percentage: 12 },
  { range: '> 20 min', percentage: 8 },
];

export const TRAFFIC_BY_ZONE: ZoneTrafficItem[] = [
  { id: 'z-entrance', zoneName: 'Entrance', count: 320 },
  { id: 'z-produce', zoneName: 'Fresh Produce', count: 245 },
  { id: 'z-beverages', zoneName: 'Beverages', count: 198 },
  { id: 'z-snacks', zoneName: 'Snacks', count: 156 },
  { id: 'z-care', zoneName: 'Personal Care', count: 142 },
  { id: 'z-checkout', zoneName: 'Checkout Area', count: 121 },
  { id: 'z-home', zoneName: 'Home Care', count: 98 },
  { id: 'z-others', zoneName: 'Others', count: 64 },
];

export const TOP_VISITED_AREAS: VisitedAreaItem[] = [
  { rank: 1, zone: 'Fresh Produce', visits: 320, avgDwellTime: '6.2 min', trend: '↑ 18%', trendDirection: 'up' },
  { rank: 2, zone: 'Beverages', visits: 245, avgDwellTime: '5.1 min', trend: '↑ 12%', trendDirection: 'up' },
  { rank: 3, zone: 'Snacks', visits: 198, avgDwellTime: '4.8 min', trend: '↑ 9%', trendDirection: 'up' },
  { rank: 4, zone: 'Personal Care', visits: 156, avgDwellTime: '3.9 min', trend: '↓ 4%', trendDirection: 'down' },
  { rank: 5, zone: 'Home Care', visits: 142, avgDwellTime: '3.6 min', trend: '↑ 6%', trendDirection: 'up' },
];

export const CUSTOMER_TYPE_SEGMENTS: CustomerTypeSegment[] = [
  { name: 'New Customers', value: 766, percentage: 68, color: '#059669' },
  { name: 'Returning Customers', value: 360, percentage: 32, color: '#6EE7B7' },
];

export const PEAK_HOURS_INSIGHTS: PeakHourInsightItem[] = [
  { id: 'p-1', timeSlot: '6 AM - 9 AM', footfall: 120, avgDwellTime: '5.2 min', conversionRate: '18%', insights: 'Moderate traffic' },
  { id: 'p-2', timeSlot: '9 AM - 12 PM', footfall: 280, avgDwellTime: '7.1 min', conversionRate: '22%', insights: 'Steady increase' },
  { id: 'p-3', timeSlot: '12 PM - 3 PM', footfall: 420, avgDwellTime: '9.2 min', conversionRate: '26%', insights: 'Highest footfall', isPeak: true },
  { id: 'p-4', timeSlot: '3 PM - 6 PM', footfall: 320, avgDwellTime: '8.1 min', conversionRate: '24%', insights: 'High engagement' },
  { id: 'p-5', timeSlot: '6 PM - 9 PM', footfall: 342, avgDwellTime: '7.8 min', conversionRate: '23%', insights: 'Busy hours' },
];

export const CAMERA_ANALYTICS: CameraAnalyticsData = {
  peopleInFrame: 12,
  entering: 7,
  exiting: 5,
  imageUrl: '/images/shopper/cam_analytics.jpg',
  activeCamera: 'Entrance',
};

export const HEATMAP_ZONES: ShopperHeatmapZone[] = [
  { id: 'z1', zoneName: 'Aisle 1 Center', density: 85, trafficLevel: 'High' },
  { id: 'z2', zoneName: 'Aisle 2 Endcap', density: 78, trafficLevel: 'High' },
  { id: 'z3', zoneName: 'Fresh Produce', density: 65, trafficLevel: 'Medium' },
  { id: 'z4', zoneName: 'Entrance Corridor', density: 40, trafficLevel: 'Low' },
];

export const DEFAULT_SHOPPER_OVERVIEW: ShopperOverviewData = {
  storeId: 'store-001',
  dateFormatted: 'Today, 24 Sep 2024',
  timeRange: 'today',
  kpis: SHOPPER_KPIS,
  footfallTrend: SHOPPER_FOOTFALL_TREND,
  heatmapFloorPlanUrl: '/images/shopper/heatmap_floorplan.jpg',
  heatmapZones: HEATMAP_ZONES,
  cameraAnalytics: CAMERA_ANALYTICS,
  demographics: {
    totalShoppers: 1482,
    segments: DEMOGRAPHIC_SEGMENTS,
  },
  dwellTimeDistribution: DWELL_TIME_DISTRIBUTION,
  trafficByZone: TRAFFIC_BY_ZONE,
  pathMapUrl: '/images/shopper/path_map.jpg',
  topVisitedAreas: TOP_VISITED_AREAS,
  customerTypes: {
    totalUnique: 1126,
    segments: CUSTOMER_TYPE_SEGMENTS,
  },
  peakHours: PEAK_HOURS_INSIGHTS,
};
