/**
 * Analytics routes matching frontend AnalyticsService.
 */
import { Router } from 'express';
import { aiGet } from '../services/aiService.js';

const router = Router();

const FOOTFALL_TREND = [
  { time: '6AM', today: 85, yesterday: 90 },
  { time: '9AM', today: 185, yesterday: 140 },
  { time: '12PM', today: 285, yesterday: 235 },
  { time: '3PM', today: 220, yesterday: 230 },
  { time: '6PM', today: 245, yesterday: 215 },
  { time: '9PM', today: 320, yesterday: 260 },
];

const CUSTOMER_DISTRIBUTION = [
  { name: 'Male', value: 771, percentage: 52, color: '#0fa968' },
  { name: 'Female', value: 637, percentage: 43, color: '#34d399' },
  { name: 'Children', value: 74, percentage: 5, color: '#f59e0b' },
];

const DWELL_TIME = [
  { zone: 'Entrance', minutes: 6.2 },
  { zone: 'Aisles', minutes: 12.4 },
  { zone: 'Snacks', minutes: 8.1 },
  { zone: 'Beverages', minutes: 9.6 },
  { zone: 'Checkout', minutes: 4.3 },
  { zone: 'Personal Care', minutes: 7.8 },
];

const FOOTFALL_HOURLY = [
  { time: '6AM', visitors: 85 },
  { time: '9AM', visitors: 165 },
  { time: '12PM', visitors: 265 },
  { time: '3PM', visitors: 195 },
  { time: '6PM', visitors: 125 },
  { time: '9PM', visitors: 275 },
];

const SALES_FOOTFALL = [
  { date: '18 Sep', footfall: 150, sales: 18000 },
  { date: '19 Sep', footfall: 280, sales: 38000 },
  { date: '20 Sep', footfall: 220, sales: 26000 },
  { date: '21 Sep', footfall: 180, sales: 29000 },
  { date: '22 Sep', footfall: 210, sales: 31000 },
  { date: '23 Sep', footfall: 140, sales: 19000 },
  { date: '24 Sep', footfall: 250, sales: 34000 },
];

const TOP_CATEGORIES = [
  { id: 'cat-1', name: 'Beverages', sharePercent: 28, changePercent: 12, trend: 'up', iconName: 'beverages' },
  { id: 'cat-2', name: 'Snacks', sharePercent: 22, changePercent: 8, trend: 'up', iconName: 'snacks' },
  { id: 'cat-3', name: 'Personal Care', sharePercent: 18, changePercent: 5, trend: 'up', iconName: 'personal-care' },
  { id: 'cat-4', name: 'Dairy', sharePercent: 15, changePercent: 3, trend: 'up', iconName: 'dairy' },
  { id: 'cat-5', name: 'Household', sharePercent: 10, changePercent: 2, trend: 'down', iconName: 'household' },
];

// GET /api/analytics/footfall
router.get('/footfall', async (_req, res) => {
  const aiData = await aiGet('/analytics/footfall');
  if (aiData) return res.json(aiData);
  res.json(FOOTFALL_TREND);
});

// GET /api/analytics/demographics
router.get('/demographics', async (_req, res) => {
  const aiData = await aiGet('/analytics/demographics');
  if (aiData) return res.json(aiData);
  res.json(CUSTOMER_DISTRIBUTION);
});

// GET /api/analytics/zones
router.get('/zones', async (_req, res) => {
  const aiData = await aiGet('/analytics/zones');
  if (aiData) return res.json(aiData);
  res.json(DWELL_TIME);
});

// GET /api/analytics/footfall/hourly
router.get('/footfall/hourly', async (_req, res) => {
  const aiData = await aiGet('/analytics/footfall/hourly');
  if (aiData) return res.json(aiData);
  res.json(FOOTFALL_HOURLY);
});

// GET /api/analytics/sales-correlation
router.get('/sales-correlation', async (_req, res) => {
  const aiData = await aiGet('/analytics/sales-correlation');
  if (aiData) return res.json(aiData);
  res.json(SALES_FOOTFALL);
});

// GET /api/analytics/categories
router.get('/categories', async (_req, res) => {
  const aiData = await aiGet('/analytics/categories');
  if (aiData) return res.json(aiData);
  res.json(TOP_CATEGORIES);
});

export default router;
