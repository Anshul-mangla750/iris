/**
 * Dashboard routes — aggregates data from AI service + local stores.
 * Provides the shape that DashboardOverviewData expects.
 */
import { Router } from 'express';
import { aiGet } from '../services/aiService.js';
import { stores } from '../data/index.js';
import { getLiveState } from '../services/liveState.js';

const router = Router();

// GET /api/analytics/overview
router.get('/overview', async (req, res) => {
  const storeId = req.query.store_id || 'store-001';
  const liveState = getLiveState();

  // Try to get live metrics from AI service
  const liveMetrics = await aiGet('/metrics/live');
  const aiHealth = await aiGet('/health');

  const store = stores.find((s) => s.id === storeId) || stores[0];
  const storeOption = { id: store.id, code: store.code, name: store.name, city: store.city };

  const now = new Date();

  // Build dashboard overview with real AI data when available, fallback to computed values
  const shopperData = liveMetrics?.shopper || {};
  const queueData = liveMetrics?.queues || {};
  const inventoryData = liveMetrics?.inventory || {};

  const totalFootfall = shopperData.entries || liveState.totalFootfall;
  const avgDwell = shopperData.avg_dwell_time_s ? (shopperData.avg_dwell_time_s / 60).toFixed(1) : String(liveState.avgDwellMinutes);
  const activeQueues = queueData.queues ? Object.keys(queueData.queues).length : liveState.counters.filter((c) => c.status !== 'Closed').length;
  const totalQueues = liveState.counters.length;
  const oosCount = inventoryData.products
    ? inventoryData.products.filter((p) => p.status === 'OUT_OF_STOCK').length
    : 4;

  const kpis = [
    {
      id: 'footfall', title: 'Total Footfall', value: totalFootfall.toLocaleString(),
      trendText: `↑ ${store.footfallTrend || 12}% vs yesterday`, trendDirection: 'up',
      icon: 'users', theme: 'blue',
    },
    {
      id: 'dwell-time', title: 'Avg Dwell Time', value: `${avgDwell} min`,
      trendText: '↑ 6%', trendDirection: 'up', icon: 'clock', theme: 'purple',
    },
    {
      id: 'active-queues', title: 'Active Queues', value: `${activeQueues} / ${totalQueues}`,
      trendText: '● Normal', trendDirection: 'neutral', icon: 'queue', theme: 'indigo',
    },
    {
      id: 'out-of-stock', title: 'Out of Stock Items', value: String(oosCount),
      trendText: `↑ ${oosCount > 2 ? oosCount - 2 : 0} new`, trendDirection: 'down',
      icon: 'package', theme: 'red', isAlert: oosCount > 0,
    },
    {
      id: 'planogram-compliance', title: 'Planogram Compliance', value: '96%',
      trendText: '↑ 3%', trendDirection: 'up', icon: 'box', theme: 'emerald',
    },
    {
      id: 'system-health', title: 'System Health',
      value: aiHealth ? 'Online' : 'AI Offline',
      subtitle: aiHealth ? 'All systems operational' : 'AI service not connected',
      icon: 'health', theme: aiHealth ? 'teal' : 'red',
    },
  ];

  const footfallTrend = [
    { time: '6AM', today: 85, yesterday: 90 },
    { time: '9AM', today: 185, yesterday: 140 },
    { time: '12PM', today: 285, yesterday: 235 },
    { time: '3PM', today: 220, yesterday: 230 },
    { time: '6PM', today: 245, yesterday: 215 },
    { time: '9PM', today: 320, yesterday: 260 },
  ];

  // If we have real zone metrics, use them for heatmap
  const zones = liveMetrics?.zones
    ? Object.entries(liveMetrics.zones).map(([name, data], i) => ({
        id: `z${i + 1}`, name,
        density: data.occupancy || Math.round(Math.random() * 100),
        level: (data.occupancy || 50) > 70 ? 'High' : (data.occupancy || 50) > 40 ? 'Medium' : 'Low',
        x: 25 + i * 20, y: 35 + (i % 2) * 20,
      }))
    : [
        { id: 'z1', name: 'Aisle 1 Center', density: 85, level: 'High', x: 45, y: 35 },
        { id: 'z2', name: 'Aisle 2 Endcap', density: 78, level: 'High', x: 75, y: 40 },
        { id: 'z3', name: 'Entrance Corridor', density: 60, level: 'Medium', x: 25, y: 55 },
        { id: 'z4', name: 'Bakery Wall', density: 35, level: 'Low', x: 60, y: 70 },
      ];

  const overview = {
    store: storeOption,
    greeting: {
      userName: 'Admin',
      message: "Here's what's happening in your store today.",
      dateFormatted: now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      timeFormatted: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      temperature: '28°C',
      location: `${store.city}, India`,
    },
    kpis,
    footfallTrend,
    customerDistribution: {
      totalVisitors: totalFootfall,
      items: [
        { name: 'Male', value: Math.round(totalFootfall * 0.52), percentage: 52, color: '#0fa968' },
        { name: 'Female', value: Math.round(totalFootfall * 0.43), percentage: 43, color: '#34d399' },
        { name: 'Children', value: Math.round(totalFootfall * 0.05), percentage: 5, color: '#f59e0b' },
      ],
    },
    storeHeatmap: {
      isLive: !!liveMetrics,
      floorPlanUrl: '/images/dashboard/heatmap_floorplan.jpg',
      zones,
    },
    cameras: [
      { id: 'cam-1', name: 'Entrance Camera', category: 'entrance', timestamp: now.toLocaleTimeString(), isLive: true, imageUrl: '/images/dashboard/cam_entrance.jpg' },
      { id: 'cam-2', name: 'Aisle 1', category: 'aisles', timestamp: now.toLocaleTimeString(), isLive: true, imageUrl: '/images/dashboard/cam_aisle1.jpg' },
      { id: 'cam-3', name: 'Aisle 2', category: 'aisles', timestamp: now.toLocaleTimeString(), isLive: true, imageUrl: '/images/dashboard/cam_aisle2.jpg' },
      { id: 'cam-4', name: 'Checkout 1', category: 'checkout', timestamp: now.toLocaleTimeString(), isLive: true, imageUrl: '/images/dashboard/cam_checkout.jpg' },
    ],
    queueCounters: liveState.counters.map((c) => ({
      id: c.id,
      name: c.name,
      peopleCount: c.currentQueue,
      waitTimeMinutes: Math.round(c.avgWaitTime),
      status: c.status,
      capacityPercent: Math.min(100, Math.round((c.currentQueue / 10) * 100)),
    })),
    inventoryStatus: { totalProducts: 1248, inStock: { count: 1181, percent: 95 }, lowStock: { count: 42, percent: 3 }, outOfStock: { count: oosCount, percent: 2 } },
    planogramCompliance: { compliancePercent: 96, correct: 48, misplaced: 3, missing: 5 },
    recentAlerts: [
      { id: 'alert-1', type: 'out-of-stock', message: 'Out of stock — Pepsi (Aisle 2 - Shelf 3)', timeAgo: '2 min ago', severity: 'critical' },
      { id: 'alert-2', type: 'high-queue', message: 'High queue at Checkout 1', timeAgo: '5 min ago', severity: 'warning' },
      { id: 'alert-3', type: 'misplaced', message: 'Item misplaced — Maggi (Aisle 1 - Shelf 2)', timeAgo: '12 min ago', severity: 'warning' },
      { id: 'alert-4', type: 'camera-offline', message: 'Camera 3 went offline', timeAgo: '18 min ago', severity: 'info' },
    ],
    aiInsights: [
      { id: 'insight-1', type: 'footfall', title: 'Footfall is 12% higher than yesterday', description: 'Good customer engagement today.', icon: 'trending' },
      { id: 'insight-2', type: 'queue', title: 'Predicted queue surge at 5 PM', description: 'Expected 6–8 people at Checkout 1.', icon: 'clock' },
      { id: 'insight-3', type: 'restock', title: 'Restock required for 4 products', description: 'Based on current stock and sales trend.', icon: 'package' },
      { id: 'insight-4', type: 'layout', title: 'Store layout performing well', description: 'Dwell time increased by 6%.', icon: 'target' },
    ],
    topCategories: [
      { id: 'cat-1', name: 'Beverages', sharePercent: 28, changePercent: 12, trend: 'up', iconName: 'beverages' },
      { id: 'cat-2', name: 'Snacks', sharePercent: 22, changePercent: 8, trend: 'up', iconName: 'snacks' },
      { id: 'cat-3', name: 'Personal Care', sharePercent: 18, changePercent: 5, trend: 'up', iconName: 'personal-care' },
      { id: 'cat-4', name: 'Dairy', sharePercent: 15, changePercent: 3, trend: 'up', iconName: 'dairy' },
      { id: 'cat-5', name: 'Household', sharePercent: 10, changePercent: 2, trend: 'down', iconName: 'household' },
    ],
    dwellTimeByZone: liveState.liveDwellZones,
    footfallByHour: [
      { time: '6AM', visitors: 85 }, { time: '9AM', visitors: 165 },
      { time: '12PM', visitors: 265 }, { time: '3PM', visitors: 195 },
      { time: '6PM', visitors: 125 }, { time: '9PM', visitors: 275 },
    ],
    lowStockProducts: [
      { id: 'p-1', name: 'Pepsi 500ml', currentStock: 2, threshold: 10, status: 'Low Stock', iconName: '🥤' },
      { id: 'p-2', name: 'Maggi 70g', currentStock: 1, threshold: 8, status: 'Low Stock', iconName: '🍜' },
      { id: 'p-3', name: 'Dove Soap', currentStock: 0, threshold: 5, status: 'Out of Stock', iconName: '🧼' },
      { id: 'p-4', name: "Lay's Chips", currentStock: 3, threshold: 10, status: 'Low Stock', iconName: '🥔' },
      { id: 'p-5', name: 'Amul Milk 1L', currentStock: 2, threshold: 8, status: 'Low Stock', iconName: '🥛' },
    ],
    salesVsFootfall: [
      { date: '18 Sep', footfall: 150, sales: 18000 }, { date: '19 Sep', footfall: 280, sales: 38000 },
      { date: '20 Sep', footfall: 220, sales: 26000 }, { date: '21 Sep', footfall: 180, sales: 29000 },
      { date: '22 Sep', footfall: 210, sales: 31000 }, { date: '23 Sep', footfall: 140, sales: 19000 },
      { date: '24 Sep', footfall: 250, sales: 34000 },
    ],
    deviceStatuses: [
      { id: 'dev-1', name: 'Entrance Camera', type: 'camera', status: 'Online', uptime: '99.8%' },
      { id: 'dev-2', name: 'Aisle 1 Camera', type: 'camera', status: 'Online', uptime: '99.5%' },
      { id: 'dev-3', name: 'Aisle 2 Camera', type: 'camera', status: 'Online', uptime: '99.6%' },
      { id: 'dev-4', name: 'Checkout Camera', type: 'camera', status: 'Online', uptime: '99.7%' },
      { id: 'dev-5', name: 'Edge Device', type: 'edge', status: aiHealth ? 'Online' : 'Offline', uptime: aiHealth ? '99.9%' : '0%' },
      { id: 'dev-6', name: 'POS Integration', type: 'pos', status: 'Connected', uptime: '100%' },
    ],
  };

  res.json(overview);
});

export default router;
