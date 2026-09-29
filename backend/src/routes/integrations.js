/**
 * Integration (POS/ERP) management routes.
 */
import { Router } from 'express';
import { integrations } from '../data/index.js';

const router = Router();

// GET /api/integrations/summary
router.get('/summary', (_req, res) => {
  const connected = integrations.filter((i) => i.status === 'CONNECTED').length;
  res.json({ totalIntegrations: integrations.length, connectedIntegrations: connected, disconnectedIntegrations: integrations.length - connected, lastSyncAt: '2 min ago', syncSuccessRate: 98.5, totalSyncedRecords: 12480 });
});

// GET /api/integrations/transactions
router.get('/transactions', (_req, res) => {
  res.json([
    { id: 'txn-001', transactionId: 'POS-2024-0847', storeId: 'store-001', storeName: 'City Mall, Delhi', terminalId: 'T-01', amount: 1250.00, items: 8, paymentMethod: 'UPI', status: 'COMPLETED', timestamp: new Date(Date.now() - 120000).toISOString(), cashier: 'Amit P.' },
    { id: 'txn-002', transactionId: 'POS-2024-0846', storeId: 'store-001', storeName: 'City Mall, Delhi', terminalId: 'T-02', amount: 780.50, items: 5, paymentMethod: 'Card', status: 'COMPLETED', timestamp: new Date(Date.now() - 300000).toISOString(), cashier: 'Sneha D.' },
    { id: 'txn-003', transactionId: 'POS-2024-0845', storeId: 'store-001', storeName: 'City Mall, Delhi', terminalId: 'T-01', amount: 2100.00, items: 12, paymentMethod: 'Cash', status: 'COMPLETED', timestamp: new Date(Date.now() - 600000).toISOString(), cashier: 'Amit P.' },
    { id: 'txn-004', transactionId: 'POS-2024-0844', storeId: 'store-002', storeName: 'Gurgaon Central', terminalId: 'T-03', amount: 450.00, items: 3, paymentMethod: 'UPI', status: 'COMPLETED', timestamp: new Date(Date.now() - 900000).toISOString(), cashier: 'Kiran R.' },
    { id: 'txn-005', transactionId: 'POS-2024-0843', storeId: 'store-001', storeName: 'City Mall, Delhi', terminalId: 'T-02', amount: 3200.00, items: 15, paymentMethod: 'Card', status: 'REFUNDED', timestamp: new Date(Date.now() - 1200000).toISOString(), cashier: 'Sneha D.' },
  ]);
});

// GET /api/integrations/transactions/:id
router.get('/transactions/:id', (req, res) => {
  res.json({ id: req.params.id, transactionId: `POS-2024-${req.params.id}`, storeId: 'store-001', storeName: 'City Mall, Delhi', terminalId: 'T-01', amount: 1250.00, items: 8, paymentMethod: 'UPI', status: 'COMPLETED', timestamp: new Date().toISOString(), cashier: 'Amit P.' });
});

// GET /api/integrations/sync-overview
router.get('/sync-overview', (_req, res) => {
  res.json([
    { date: 'Mon', synced: 1820, failed: 12 }, { date: 'Tue', synced: 1950, failed: 8 },
    { date: 'Wed', synced: 2100, failed: 15 }, { date: 'Thu', synced: 1780, failed: 5 },
    { date: 'Fri', synced: 2250, failed: 10 }, { date: 'Sat', synced: 1650, failed: 18 },
    { date: 'Sun', synced: 1420, failed: 7 },
  ]);
});

// GET /api/integrations/settings
router.get('/settings', (_req, res) => {
  res.json([
    { id: 'is-1', category: 'POS Sync', description: 'Configure real-time POS transaction sync', enabled: true, frequency: 'Real-time', lastModified: '2024-09-20' },
    { id: 'is-2', category: 'ERP Data Pull', description: 'Schedule inventory data synchronization from ERP', enabled: true, frequency: 'Every 15 min', lastModified: '2024-09-18' },
    { id: 'is-3', category: 'Webhook Notifications', description: 'Send alert webhooks to external systems', enabled: false, frequency: 'Event-driven', lastModified: '2024-09-15' },
    { id: 'is-4', category: 'Data Retention', description: 'Configure sync data retention policies', enabled: true, frequency: '30 days', lastModified: '2024-09-10' },
  ]);
});

// PATCH /api/integrations/settings
router.patch('/settings', (_req, res) => { res.json({ success: true }); });

// GET /api/integrations
router.get('/', (req, res) => {
  let filtered = [...integrations];
  if (req.query.status) filtered = filtered.filter((i) => i.status === req.query.status);
  res.json(filtered);
});

// GET /api/integrations/:id
router.get('/:id', (req, res) => {
  const int = integrations.find((i) => i.id === req.params.id);
  res.json(int || null);
});

// POST /api/integrations
router.post('/', (req, res) => {
  const newInt = { id: `int-${Date.now()}`, organizationId: 'org-001', ...req.body, lastSyncAt: 'Just now', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  integrations.push(newInt);
  res.status(201).json(newInt);
});

// PATCH /api/integrations/:id
router.patch('/:id', (req, res) => {
  const idx = integrations.findIndex((i) => i.id === req.params.id);
  if (idx !== -1) integrations[idx] = { ...integrations[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(integrations[idx] || {});
});

// DELETE /api/integrations/:id
router.delete('/:id', (req, res) => {
  const idx = integrations.findIndex((i) => i.id === req.params.id);
  if (idx !== -1) integrations.splice(idx, 1);
  res.json({ success: true });
});

// POST /api/integrations/:id/test
router.post('/:id/test', (_req, res) => { res.json({ success: true, latencyMs: 142, message: 'Connection established with 200 OK' }); });

// POST /api/integrations/:id/sync
router.post('/:id/sync', (_req, res) => { res.json({ success: true, syncedItems: 48 }); });

// POST /api/integrations/:id/disable
router.post('/:id/disable', (req, res) => {
  const int = integrations.find((i) => i.id === req.params.id);
  if (int) int.status = int.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
  res.json({ success: true });
});

export default router;
