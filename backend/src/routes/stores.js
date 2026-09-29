/**
 * Store management routes.
 */
import { Router } from 'express';
import { stores } from '../data/index.js';

const router = Router();

// GET /api/stores
router.get('/', (req, res) => {
  let filtered = [...stores];
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
  }
  if (req.query.region && req.query.region !== 'ALL' && req.query.region !== 'All Regions') {
    filtered = filtered.filter((s) => s.region.toLowerCase() === req.query.region.toLowerCase());
  }
  if (req.query.status && req.query.status !== 'ALL' && req.query.status !== 'All Status') {
    filtered = filtered.filter((s) => s.status.toLowerCase() === req.query.status.toLowerCase());
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  res.json({ stores: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) || 1 });
});

// GET /api/stores/summary
router.get('/summary', (_req, res) => {
  const active = stores.filter((s) => s.status === 'ONLINE').length;
  const withAlerts = stores.filter((s) => s.status === 'ALERT').length;
  const avgFootfall = Math.round(stores.reduce((sum, s) => sum + s.footfall, 0) / stores.length);
  const avgSales = Math.round(stores.reduce((sum, s) => sum + s.sales, 0) / stores.length);
  res.json({
    totalStores: stores.length, activeStores: active, storesWithAlerts: withAlerts,
    averageFootfall: avgFootfall, averageSalesPerStore: avgSales,
    trends: { totalStores: stores.length, activeStores: active, storesWithAlerts: withAlerts, averageFootfall: avgFootfall, averageSalesPerStore: avgSales },
  });
});

// GET /api/stores/performance
router.get('/performance', (_req, res) => {
  res.json(stores.filter((s) => s.status !== 'MAINTENANCE').map((s) => ({
    storeId: s.id, storeName: s.name, salesRevenue: s.sales,
    footfall: s.footfall, orders: Math.round(s.footfall * 0.6),
    averageTransactionValue: s.sales > 0 ? Math.round(s.sales / (s.footfall * 0.6)) : 0,
    conversionRate: 72 + Math.round(Math.random() * 15),
  })));
});

// GET /api/stores/device-health
router.get('/device-health', (_req, res) => {
  res.json([
    { category: 'Cameras', key: 'cameras', total: 20, online: 18, offline: 1, maintenance: 1, statusText: '18/20 Online', status: 'ONLINE' },
    { category: 'Edge Devices', key: 'edgeDevices', total: 5, online: 5, offline: 0, maintenance: 0, statusText: '5/5 Online', status: 'ONLINE' },
    { category: 'POS Systems', key: 'posSystems', total: 15, online: 14, offline: 1, maintenance: 0, statusText: '14/15 Online', status: 'WARNING' },
    { category: 'Network', key: 'network', total: 5, online: 5, offline: 0, maintenance: 0, statusText: 'All Connected', status: 'ONLINE' },
  ]);
});

// GET /api/stores/status-distribution
router.get('/status-distribution', (_req, res) => {
  const dist = [
    { name: 'Online', status: 'ONLINE', count: stores.filter((s) => s.status === 'ONLINE').length, color: '#22c55e' },
    { name: 'Alert', status: 'ALERT', count: stores.filter((s) => s.status === 'ALERT').length, color: '#f59e0b' },
    { name: 'Offline', status: 'OFFLINE', count: stores.filter((s) => s.status === 'OFFLINE').length, color: '#ef4444' },
    { name: 'Maintenance', status: 'MAINTENANCE', count: stores.filter((s) => s.status === 'MAINTENANCE').length, color: '#6b7280' },
  ];
  const total = dist.reduce((sum, d) => sum + d.count, 0);
  dist.forEach((d) => { d.percentage = total > 0 ? Math.round((d.count / total) * 100) : 0; });
  res.json(dist);
});

// GET /api/stores/:id
router.get('/:id', (req, res) => {
  const store = stores.find((s) => s.id === req.params.id || s.code === req.params.id);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  res.json(store);
});

// POST /api/stores
router.post('/', (req, res) => {
  const input = req.body;
  const newStore = {
    id: `str-${String(stores.length + 1).padStart(3, '0')}`, organizationId: 'org-001',
    ...input, status: input.status || 'ONLINE', latitude: 28.6139, longitude: 77.2090,
    footfall: 0, footfallTrend: 0, sales: 0, salesTrend: 0,
    devicesOnline: 10, devicesTotal: 10, lastUpdatedAt: 'Just now',
  };
  stores.push(newStore);
  res.status(201).json(newStore);
});

// PATCH /api/stores/:id
router.patch('/:id', (req, res) => {
  const idx = stores.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Store not found' });
  stores[idx] = { ...stores[idx], ...req.body };
  res.json(stores[idx]);
});

// DELETE /api/stores/:id
router.delete('/:id', (req, res) => {
  const idx = stores.findIndex((s) => s.id === req.params.id);
  if (idx !== -1) stores.splice(idx, 1);
  res.json({ success: true });
});

export default router;
