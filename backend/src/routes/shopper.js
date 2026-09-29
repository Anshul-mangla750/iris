import { Router } from 'express';
import { aiGet } from '../services/aiService.js';
import { getLiveState } from '../services/liveState.js';

const router = Router();

// GET /api/shopper/overview
router.get('/overview', async (req, res) => {
  const storeId = req.query.store_id || 'store-001';
  const timeRange = req.query.range || 'today';
  const liveState = getLiveState();

  const aiMetrics = await aiGet('/shopper/metrics');
  const aiZones = await aiGet('/shopper/zones');
  const now = new Date();

  const entries = aiMetrics?.entries || liveState.totalFootfall;
  const exits = aiMetrics?.exits || Math.round(liveState.totalFootfall * 0.89);
  const avgDwell = aiMetrics?.avg_dwell_time_s ? (aiMetrics.avg_dwell_time_s / 60).toFixed(1) : String(liveState.avgDwellMinutes);
  const uniqueIds = aiMetrics?.unique_ids_seen || Math.round(liveState.totalFootfall * 0.9);

  const kpis = [
    { id: 'total-footfall', title: 'Total Footfall', value: entries.toLocaleString(), trendText: '↑ 12% vs yesterday', trendDirection: 'up', icon: 'users', theme: 'blue' },
    { id: 'unique-visitors', title: 'Unique Visitors', value: uniqueIds.toLocaleString(), trendText: '↑ 8%', trendDirection: 'up', icon: 'user-check', theme: 'green' },
    { id: 'avg-dwell', title: 'Avg Dwell Time', value: `${avgDwell} min`, trendText: '↑ 6%', trendDirection: 'up', icon: 'clock', theme: 'purple' },
    { id: 'conversion', title: 'Conversion Rate', value: entries > 0 ? `${Math.round((exits / entries) * 100)}%` : '89%', trendText: '↑ 3%', trendDirection: 'up', icon: 'cart', theme: 'emerald' },
    { id: 'engagement', title: 'Engagement Score', value: '8.2', trendText: '↑ 0.5', trendDirection: 'up', icon: 'bar-chart', theme: 'teal' },
  ];

  const footfallTrend = [
    { time: '6AM', today: 85, yesterday: 90 }, { time: '9AM', today: 185, yesterday: 140 },
    { time: '12PM', today: 285, yesterday: 235 }, { time: '3PM', today: 220, yesterday: 230 },
    { time: '6PM', today: 245, yesterday: 215 }, { time: '9PM', today: 320, yesterday: 260 },
  ];

  const zoneMetrics = aiZones || {};
  const trafficByZone = Object.keys(zoneMetrics).length > 0
    ? Object.entries(zoneMetrics).map(([name, data], i) => ({
        id: `zone-${i}`, zoneName: name, count: data.occupancy || data.entries || Math.round(Math.random() * 200 + 50),
      }))
    : [
        { id: 'zone-0', zoneName: 'Entrance', count: 482 },
        { id: 'zone-1', zoneName: 'Aisle 1', count: 326 },
        { id: 'zone-2', zoneName: 'Aisle 2', count: 289 },
        { id: 'zone-3', zoneName: 'Checkout', count: 245 },
        { id: 'zone-4', zoneName: 'Electronics', count: 140 },
      ];

  const heatmapZones = trafficByZone.map((z) => ({
    id: z.id, zoneName: z.zoneName, density: Math.min(100, Math.round((z.count / 500) * 100)),
    trafficLevel: z.count > 300 ? 'High' : z.count > 150 ? 'Medium' : 'Low',
  }));

  res.json({
    storeId, dateFormatted: now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
    timeRange, kpis, footfallTrend,
    heatmapFloorPlanUrl: '/images/shopper/heatmap_floorplan.jpg',
    heatmapZones,
    cameraAnalytics: { peopleInFrame: aiMetrics?.in_store || 12, entering: entries, exiting: exits, imageUrl: '/images/shopper/camera_live.jpg', activeCamera: 'Entrance Camera' },
    demographics: {
      totalShoppers: entries,
      segments: [
        { name: 'Adults (25-45)', value: Math.round(entries * 0.45), percentage: 45, color: '#3b82f6' },
        { name: 'Young Adults (18-24)', value: Math.round(entries * 0.25), percentage: 25, color: '#8b5cf6' },
        { name: 'Seniors (45+)', value: Math.round(entries * 0.20), percentage: 20, color: '#10b981' },
        { name: 'Teens (13-17)', value: Math.round(entries * 0.10), percentage: 10, color: '#f59e0b' },
      ],
    },
    dwellTimeDistribution: [
      { range: '0-2 min', percentage: 15 }, { range: '2-5 min', percentage: 25 },
      { range: '5-10 min', percentage: 35 }, { range: '10-20 min', percentage: 18 },
      { range: '20+ min', percentage: 7 },
    ],
    trafficByZone,
    pathMapUrl: '/images/shopper/path_map.jpg',
    topVisitedAreas: [
      { rank: 1, zone: 'Beverages', visits: 482, avgDwellTime: '9.6 min', trend: '↑ 12%', trendDirection: 'up' },
      { rank: 2, zone: 'Snacks', visits: 421, avgDwellTime: '8.1 min', trend: '↑ 8%', trendDirection: 'up' },
      { rank: 3, zone: 'Personal Care', visits: 289, avgDwellTime: '7.8 min', trend: '↓ 3%', trendDirection: 'down' },
      { rank: 4, zone: 'Dairy', visits: 245, avgDwellTime: '5.2 min', trend: '↑ 5%', trendDirection: 'up' },
      { rank: 5, zone: 'Household', visits: 180, avgDwellTime: '4.3 min', trend: '↓ 2%', trendDirection: 'down' },
    ],
    customerTypes: {
      totalUnique: uniqueIds,
      segments: [
        { name: 'New Visitors', value: Math.round(uniqueIds * 0.35), percentage: 35, color: '#3b82f6' },
        { name: 'Returning', value: Math.round(uniqueIds * 0.45), percentage: 45, color: '#10b981' },
        { name: 'Frequent', value: Math.round(uniqueIds * 0.20), percentage: 20, color: '#8b5cf6' },
      ],
    },
    peakHours: [
      { id: 'ph-1', timeSlot: '9:00 - 11:00 AM', footfall: 285, avgDwellTime: '12 min', conversionRate: '72%', insights: 'Morning rush — mostly office workers', isPeak: false },
      { id: 'ph-2', timeSlot: '12:00 - 2:00 PM', footfall: 420, avgDwellTime: '15 min', conversionRate: '68%', insights: 'Lunch break peak — highest dwell', isPeak: true },
      { id: 'ph-3', timeSlot: '5:00 - 7:00 PM', footfall: 510, avgDwellTime: '18 min', conversionRate: '75%', insights: 'Evening peak — families shopping', isPeak: true },
      { id: 'ph-4', timeSlot: '7:00 - 9:00 PM', footfall: 380, avgDwellTime: '10 min', conversionRate: '82%', insights: 'Quick grocery runs', isPeak: false },
    ],
  });
});

// GET /api/shopper/footfall
router.get('/footfall', async (req, res) => {
  res.json([
    { time: '6AM', today: 85, yesterday: 90 }, { time: '9AM', today: 185, yesterday: 140 },
    { time: '12PM', today: 285, yesterday: 235 }, { time: '3PM', today: 220, yesterday: 230 },
    { time: '6PM', today: 245, yesterday: 215 }, { time: '9PM', today: 320, yesterday: 260 },
  ]);
});

// GET /api/shopper/zones
router.get('/zones', async (req, res) => {
  const aiZones = await aiGet('/shopper/zones');
  if (aiZones && Object.keys(aiZones).length > 0) {
    const result = Object.entries(aiZones).map(([name, data], i) => ({
      id: `zone-${i}`, zoneName: name, count: data.occupancy || data.entries || 100,
    }));
    return res.json(result);
  }
  res.json([
    { id: 'zone-0', zoneName: 'Entrance', count: 482 },
    { id: 'zone-1', zoneName: 'Aisle 1', count: 326 },
    { id: 'zone-2', zoneName: 'Aisle 2', count: 289 },
    { id: 'zone-3', zoneName: 'Checkout', count: 245 },
    { id: 'zone-4', zoneName: 'Electronics', count: 140 },
  ]);
});

// GET /api/shopper/dwell-time
router.get('/dwell-time', async (_req, res) => {
  res.json([
    { range: '0-2 min', percentage: 15 }, { range: '2-5 min', percentage: 25 },
    { range: '5-10 min', percentage: 35 }, { range: '10-20 min', percentage: 18 },
    { range: '20+ min', percentage: 7 },
  ]);
});

export default router;
