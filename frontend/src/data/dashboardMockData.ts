import type {
  DashboardOverviewData,
  StoreOption,
  KpiItem,
  FootfallPoint,
  CustomerDistributionItem,
  CameraFeedItem,
  QueueCounterItem,
  InventoryStatusSummary,
  PlanogramSummary,
  RecentAlertItem,
  AIInsightItem,
  CategoryPerformanceItem,
  DwellTimePoint,
  FootfallByHourPoint,
  LowStockProductItem,
  SalesFootfallPoint,
  DeviceStatusItem,
} from '../types/dashboard';

export const STORE_OPTIONS: StoreOption[] = [
  { id: 'store-001', code: 'Store 001', name: 'City Mall, Delhi', city: 'Delhi' },
  { id: 'store-002', code: 'Store 002', name: 'Gurgaon Central', city: 'Gurgaon' },
  { id: 'store-003', code: 'Store 003', name: 'Noida Mall of India', city: 'Noida' },
];

export const INITIAL_KPIS: KpiItem[] = [
  {
    id: 'footfall',
    title: 'Total Footfall',
    value: '1,482',
    trendText: '↑ 12% vs yesterday',
    trendDirection: 'up',
    icon: 'users',
    theme: 'blue',
  },
  {
    id: 'dwell-time',
    title: 'Avg Dwell Time',
    value: '8.4 min',
    trendText: '↑ 6%',
    trendDirection: 'up',
    icon: 'clock',
    theme: 'purple',
  },
  {
    id: 'active-queues',
    title: 'Active Queues',
    value: '2 / 5',
    trendText: '● Normal',
    trendDirection: 'neutral',
    icon: 'queue',
    theme: 'indigo',
  },
  {
    id: 'out-of-stock',
    title: 'Out of Stock Items',
    value: '4',
    trendText: '↑ 2 new',
    trendDirection: 'down',
    icon: 'package',
    theme: 'red',
    isAlert: true,
  },
  {
    id: 'planogram-compliance',
    title: 'Planogram Compliance',
    value: '96%',
    trendText: '↑ 3%',
    trendDirection: 'up',
    icon: 'box',
    theme: 'emerald',
  },
  {
    id: 'system-health',
    title: 'System Health',
    value: 'Online',
    subtitle: 'All systems operational',
    icon: 'health',
    theme: 'teal',
  },
];

export const FOOTFALL_TREND_DATA: FootfallPoint[] = [
  { time: '6AM', today: 85, yesterday: 90 },
  { time: '9AM', today: 185, yesterday: 140 },
  { time: '12PM', today: 285, yesterday: 235 },
  { time: '3PM', today: 220, yesterday: 230 },
  { time: '6PM', today: 245, yesterday: 215 },
  { time: '9PM', today: 320, yesterday: 260 },
];

export const CUSTOMER_DISTRIBUTION_DATA: CustomerDistributionItem[] = [
  { name: 'Male', value: 771, percentage: 52, color: '#0fa968' },
  { name: 'Female', value: 637, percentage: 43, color: '#34d399' },
  { name: 'Children', value: 74, percentage: 5, color: '#f59e0b' },
];

export const CAMERA_FEEDS_DATA: CameraFeedItem[] = [
  {
    id: 'cam-1',
    name: 'Entrance Camera',
    category: 'entrance',
    timestamp: '03:24:12 PM',
    isLive: true,
    imageUrl: '/images/dashboard/cam_entrance.jpg',
  },
  {
    id: 'cam-2',
    name: 'Aisle 1',
    category: 'aisles',
    timestamp: '03:24:12 PM',
    isLive: true,
    imageUrl: '/images/dashboard/cam_aisle1.jpg',
  },
  {
    id: 'cam-3',
    name: 'Aisle 2',
    category: 'aisles',
    timestamp: '03:24:12 PM',
    isLive: true,
    imageUrl: '/images/dashboard/cam_aisle2.jpg',
  },
  {
    id: 'cam-4',
    name: 'Checkout 1',
    category: 'checkout',
    timestamp: '03:24:12 PM',
    isLive: true,
    imageUrl: '/images/dashboard/cam_checkout.jpg',
  },
];

export const QUEUE_COUNTERS_DATA: QueueCounterItem[] = [
  {
    id: 'counter-1',
    name: 'Counter 1',
    peopleCount: 5,
    waitTimeMinutes: 8,
    status: 'High',
    capacityPercent: 80,
  },
  {
    id: 'counter-2',
    name: 'Counter 2',
    peopleCount: 2,
    waitTimeMinutes: 3,
    status: 'Normal',
    capacityPercent: 40,
  },
  {
    id: 'counter-3',
    name: 'Counter 3',
    peopleCount: 0,
    waitTimeMinutes: 0,
    status: 'Open',
    capacityPercent: 10,
  },
  {
    id: 'counter-4',
    name: 'Counter 4',
    peopleCount: 7,
    waitTimeMinutes: 12,
    status: 'High',
    capacityPercent: 95,
  },
  {
    id: 'counter-5',
    name: 'Counter 5',
    peopleCount: 1,
    waitTimeMinutes: 2,
    status: 'Normal',
    capacityPercent: 25,
  },
];

export const INVENTORY_STATUS_DATA: InventoryStatusSummary = {
  totalProducts: 1248,
  inStock: { count: 1181, percent: 95 },
  lowStock: { count: 42, percent: 3 },
  outOfStock: { count: 25, percent: 2 },
};

export const PLANOGRAM_COMPLIANCE_DATA: PlanogramSummary = {
  compliancePercent: 96,
  correct: 48,
  misplaced: 3,
  missing: 5,
};

export const RECENT_ALERTS_DATA: RecentAlertItem[] = [
  {
    id: 'alert-1',
    type: 'out-of-stock',
    message: 'Out of stock — Pepsi (Aisle 2 - Shelf 3)',
    timeAgo: '2 min ago',
    severity: 'critical',
  },
  {
    id: 'alert-2',
    type: 'high-queue',
    message: 'High queue at Checkout 1',
    timeAgo: '5 min ago',
    severity: 'warning',
  },
  {
    id: 'alert-3',
    type: 'misplaced',
    message: 'Item misplaced — Maggi (Aisle 1 - Shelf 2)',
    timeAgo: '12 min ago',
    severity: 'warning',
  },
  {
    id: 'alert-4',
    type: 'camera-offline',
    message: 'Camera 3 went offline',
    timeAgo: '18 min ago',
    severity: 'info',
  },
];

export const AI_INSIGHTS_DATA: AIInsightItem[] = [
  {
    id: 'insight-1',
    type: 'footfall',
    title: 'Footfall is 12% higher than yesterday',
    description: 'Good customer engagement today.',
    icon: 'trending',
  },
  {
    id: 'insight-2',
    type: 'queue',
    title: 'Predicted queue surge at 5 PM',
    description: 'Expected 6–8 people at Checkout 1.',
    icon: 'clock',
  },
  {
    id: 'insight-3',
    type: 'restock',
    title: 'Restock required for 4 products',
    description: 'Based on current stock and sales trend.',
    icon: 'package',
  },
  {
    id: 'insight-4',
    type: 'layout',
    title: 'Store layout performing well',
    description: 'Dwell time increased by 6%.',
    icon: 'target',
  },
];

export const TOP_CATEGORIES_DATA: CategoryPerformanceItem[] = [
  { id: 'cat-1', name: 'Beverages', sharePercent: 28, changePercent: 12, trend: 'up', iconName: 'beverages' },
  { id: 'cat-2', name: 'Snacks', sharePercent: 22, changePercent: 8, trend: 'up', iconName: 'snacks' },
  { id: 'cat-3', name: 'Personal Care', sharePercent: 18, changePercent: 5, trend: 'up', iconName: 'personal-care' },
  { id: 'cat-4', name: 'Dairy', sharePercent: 15, changePercent: 3, trend: 'up', iconName: 'dairy' },
  { id: 'cat-5', name: 'Household', sharePercent: 10, changePercent: 2, trend: 'down', iconName: 'household' },
];

export const DWELL_TIME_DATA: DwellTimePoint[] = [
  { zone: 'Entrance', minutes: 6.2 },
  { zone: 'Aisles', minutes: 12.4 },
  { zone: 'Snacks', minutes: 8.1 },
  { zone: 'Beverages', minutes: 9.6 },
  { zone: 'Checkout', minutes: 4.3 },
  { zone: 'Personal Care', minutes: 7.8 },
];

export const FOOTFALL_BY_HOUR_DATA: FootfallByHourPoint[] = [
  { time: '6AM', visitors: 85 },
  { time: '9AM', visitors: 165 },
  { time: '12PM', visitors: 265 },
  { time: '3PM', visitors: 195 },
  { time: '6PM', visitors: 125 },
  { time: '9PM', visitors: 275 },
];

export const LOW_STOCK_PRODUCTS_DATA: LowStockProductItem[] = [
  { id: 'p-1', name: 'Pepsi 500ml', currentStock: 2, threshold: 10, status: 'Low Stock', iconName: '🥤' },
  { id: 'p-2', name: 'Maggi 70g', currentStock: 1, threshold: 8, status: 'Low Stock', iconName: '🍜' },
  { id: 'p-3', name: 'Dove Soap', currentStock: 0, threshold: 5, status: 'Out of Stock', iconName: '🧼' },
  { id: 'p-4', name: "Lay's Chips", currentStock: 3, threshold: 10, status: 'Low Stock', iconName: '🥔' },
  { id: 'p-5', name: 'Amul Milk 1L', currentStock: 2, threshold: 8, status: 'Low Stock', iconName: '🥛' },
];

export const SALES_FOOTFALL_DATA: SalesFootfallPoint[] = [
  { date: '18 Sep', footfall: 150, sales: 18000 },
  { date: '19 Sep', footfall: 280, sales: 38000 },
  { date: '20 Sep', footfall: 220, sales: 26000 },
  { date: '21 Sep', footfall: 180, sales: 29000 },
  { date: '22 Sep', footfall: 210, sales: 31000 },
  { date: '23 Sep', footfall: 140, sales: 19000 },
  { date: '24 Sep', footfall: 250, sales: 34000 },
];

export const DEVICE_STATUS_DATA: DeviceStatusItem[] = [
  { id: 'dev-1', name: 'Entrance Camera', type: 'camera', status: 'Online', uptime: '99.8%' },
  { id: 'dev-2', name: 'Aisle 1 Camera', type: 'camera', status: 'Online', uptime: '99.5%' },
  { id: 'dev-3', name: 'Aisle 2 Camera', type: 'camera', status: 'Online', uptime: '99.6%' },
  { id: 'dev-4', name: 'Checkout Camera', type: 'camera', status: 'Online', uptime: '99.7%' },
  { id: 'dev-5', name: 'Edge Device', type: 'edge', status: 'Online', uptime: '99.9%' },
  { id: 'dev-6', name: 'POS Integration', type: 'pos', status: 'Connected', uptime: '100%' },
];

export const DEFAULT_DASHBOARD_OVERVIEW: DashboardOverviewData = {
  store: STORE_OPTIONS[0],
  greeting: {
    userName: 'Admin',
    message: "Here's what's happening in your store today.",
    dateFormatted: 'Tue, 24 Sep 2024',
    timeFormatted: '03:24 PM',
    temperature: '28°C',
    location: 'Delhi, India',
  },
  kpis: INITIAL_KPIS,
  footfallTrend: FOOTFALL_TREND_DATA,
  customerDistribution: {
    totalVisitors: 1482,
    items: CUSTOMER_DISTRIBUTION_DATA,
  },
  storeHeatmap: {
    isLive: true,
    floorPlanUrl: '/images/dashboard/heatmap_floorplan.jpg',
    zones: [
      { id: 'z1', name: 'Aisle 1 Center', density: 85, level: 'High', x: 45, y: 35 },
      { id: 'z2', name: 'Aisle 2 Endcap', density: 78, level: 'High', x: 75, y: 40 },
      { id: 'z3', name: 'Entrance Corridor', density: 60, level: 'Medium', x: 25, y: 55 },
      { id: 'z4', name: 'Bakery Wall', density: 35, level: 'Low', x: 60, y: 70 },
    ],
  },
  cameras: CAMERA_FEEDS_DATA,
  queueCounters: QUEUE_COUNTERS_DATA,
  inventoryStatus: INVENTORY_STATUS_DATA,
  planogramCompliance: PLANOGRAM_COMPLIANCE_DATA,
  recentAlerts: RECENT_ALERTS_DATA,
  aiInsights: AI_INSIGHTS_DATA,
  topCategories: TOP_CATEGORIES_DATA,
  dwellTimeByZone: DWELL_TIME_DATA,
  footfallByHour: FOOTFALL_BY_HOUR_DATA,
  lowStockProducts: LOW_STOCK_PRODUCTS_DATA,
  salesVsFootfall: SALES_FOOTFALL_DATA,
  deviceStatuses: DEVICE_STATUS_DATA,
};
