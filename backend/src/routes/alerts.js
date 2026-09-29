/**
 * Alert management routes.
 */
import { Router } from 'express';
import { aiGet, aiPost } from '../services/aiService.js';

const router = Router();

const MOCK_ALERTS = [
  {
    id: 'alt-001', organizationId: 'org-001', storeId: 'store-001', storeName: 'City Mall, Delhi',
    type: 'OUT_OF_STOCK', severity: 'CRITICAL', message: 'Out of stock detected — Pepsi 500ml on Aisle 2, Shelf 3',
    recommendation: 'Restock immediately from backroom inventory', recommendations: ['Restock from backroom', 'Update inventory system', 'Notify floor staff'],
    status: 'OPEN', isRead: false, createdAt: new Date(Date.now() - 120000).toISOString(), updatedAt: new Date().toISOString(),
    sourceModule: 'INVENTORY', location: 'Aisle 2 - Shelf 3', product: 'Pepsi 500ml', sku: 'SKU-0001',
    currentStock: 0, expectedStock: 10, camera: 'CAM-003', confidence: '94%', image: '/images/alerts/oos_pepsi.jpg',
    history: [
      { id: 'h1', timestamp: new Date(Date.now() - 120000).toISOString(), action: 'Alert Created', description: 'AI detected zero stock for Pepsi 500ml', dotColor: 'red' },
    ],
  },
  {
    id: 'alt-002', organizationId: 'org-001', storeId: 'store-001', storeName: 'City Mall, Delhi',
    type: 'QUEUE_CONGESTION', severity: 'WARNING', message: 'High queue congestion at Checkout Counter 1',
    recommendation: 'Open additional checkout counter', recommendations: ['Open Counter 3', 'Deploy staff assist', 'Enable express lane'],
    status: 'ACKNOWLEDGED', isRead: true, createdAt: new Date(Date.now() - 300000).toISOString(), updatedAt: new Date().toISOString(),
    assignedTo: 'Amit Patel', sourceModule: 'QUEUE', location: 'Checkout Area', camera: 'CAM-004', confidence: '88%',
    acknowledgedAt: new Date(Date.now() - 180000).toISOString(), acknowledgedBy: 'Ravi Sharma',
    history: [
      { id: 'h1', timestamp: new Date(Date.now() - 300000).toISOString(), action: 'Alert Created', description: 'Queue length exceeded threshold (8 people)', dotColor: 'red' },
      { id: 'h2', timestamp: new Date(Date.now() - 180000).toISOString(), action: 'Acknowledged', description: 'Acknowledged by Ravi Sharma', dotColor: 'blue' },
    ],
  },
  {
    id: 'alt-003', organizationId: 'org-001', storeId: 'store-001', storeName: 'City Mall, Delhi',
    type: 'PLANOGRAM_VIOLATION', severity: 'WARNING', message: 'Planogram violation — Maggi 70g misplaced in wrong section',
    recommendations: ['Move product to correct shelf', 'Update planogram records', 'Train staff on planogram'],
    status: 'OPEN', isRead: false, createdAt: new Date(Date.now() - 720000).toISOString(), updatedAt: new Date().toISOString(),
    sourceModule: 'PLANOGRAM', location: 'Aisle 1 - Shelf 2', product: 'Maggi 70g', sku: 'SKU-0042', camera: 'CAM-002', confidence: '91%',
    history: [
      { id: 'h1', timestamp: new Date(Date.now() - 720000).toISOString(), action: 'Alert Created', description: 'Product detected in incorrect location', dotColor: 'red' },
    ],
  },
  {
    id: 'alt-004', organizationId: 'org-001', storeId: 'store-001', storeName: 'City Mall, Delhi',
    type: 'LOW_STOCK', severity: 'WARNING', message: 'Low stock alert — Amul Milk 1L (2 remaining)',
    recommendations: ['Restock from cold storage', 'Order from supplier'],
    status: 'OPEN', isRead: true, createdAt: new Date(Date.now() - 900000).toISOString(), updatedAt: new Date().toISOString(),
    sourceModule: 'INVENTORY', location: 'Aisle 4 - Shelf 1', product: 'Amul Milk 1L', sku: 'SKU-0075',
    currentStock: 2, expectedStock: 8, camera: 'CAM-005', confidence: '96%',
    history: [
      { id: 'h1', timestamp: new Date(Date.now() - 900000).toISOString(), action: 'Alert Created', description: 'Stock level below threshold', dotColor: 'red' },
    ],
  },
  {
    id: 'alt-005', organizationId: 'org-001', storeId: 'store-001', storeName: 'City Mall, Delhi',
    type: 'EDGE_OFFLINE', severity: 'INFO', message: 'Camera 3 went offline momentarily',
    recommendations: ['Check camera connection', 'Restart camera'],
    status: 'RESOLVED', isRead: true, createdAt: new Date(Date.now() - 1080000).toISOString(), updatedAt: new Date().toISOString(),
    sourceModule: 'SYSTEM', location: 'Aisle 2', camera: 'CAM-003',
    resolvedAt: new Date(Date.now() - 600000).toISOString(), resolvedBy: 'System',
    history: [
      { id: 'h1', timestamp: new Date(Date.now() - 1080000).toISOString(), action: 'Alert Created', description: 'Camera offline detected', dotColor: 'red' },
      { id: 'h2', timestamp: new Date(Date.now() - 600000).toISOString(), action: 'Resolved', description: 'Camera came back online automatically', dotColor: 'green' },
    ],
  },
  {
    id: 'alt-006', organizationId: 'org-001', storeId: 'store-001', storeName: 'City Mall, Delhi',
    type: 'HIGH_TRAFFIC', severity: 'INFO', message: 'High foot traffic in Aisle 1 — Snacks section',
    recommendations: ['Ensure shelves are fully stocked', 'Consider promotional displays'],
    status: 'OPEN', isRead: false, createdAt: new Date(Date.now() - 1500000).toISOString(), updatedAt: new Date().toISOString(),
    sourceModule: 'SHOPPER', location: 'Aisle 1 - Snacks', camera: 'CAM-002', confidence: '85%',
    history: [
      { id: 'h1', timestamp: new Date(Date.now() - 1500000).toISOString(), action: 'Alert Created', description: 'Traffic density exceeded normal levels', dotColor: 'red' },
    ],
  },
];

// GET /api/alerts
router.get('/', async (req, res) => {
  // Try AI service first
  const aiAlerts = await aiGet('/alerts', { limit: req.query.limit || 100 });

  let alerts = MOCK_ALERTS;

  // If AI service has alerts, merge them
  if (aiAlerts && aiAlerts.alerts && aiAlerts.alerts.length > 0) {
    const aiMapped = aiAlerts.alerts.map((a, i) => ({
      id: a.alert_id || `ai-${i}`, organizationId: 'org-001',
      storeId: a.store_id || 'store-001', storeName: 'City Mall, Delhi',
      type: a.alert_type || 'SYSTEM_SYNC', severity: a.severity || 'INFO',
      message: a.detail || `${a.alert_type} detected`, recommendations: [],
      status: a.status || 'OPEN', createdAt: a.timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString(), sourceModule: mapSourceModule(a.alert_type),
      location: [a.rack_id, a.shelf_id].filter(Boolean).join(' - ') || undefined,
      product: a.product_id || undefined, camera: a.camera_id || undefined,
      confidence: a.confidence ? `${Math.round(a.confidence * 100)}%` : undefined,
      history: [{ timestamp: a.timestamp || new Date().toISOString(), action: 'Alert Created', description: a.detail || 'Detected by AI', dotColor: 'red' }],
    }));
    alerts = [...aiMapped, ...MOCK_ALERTS];
  }

  // Apply filters
  if (req.query.severity) {
    const sevs = Array.isArray(req.query.severity) ? req.query.severity : [req.query.severity];
    alerts = alerts.filter((a) => sevs.includes(a.severity));
  }
  if (req.query.status) {
    const stats = Array.isArray(req.query.status) ? req.query.status : [req.query.status];
    alerts = alerts.filter((a) => stats.includes(a.status));
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    alerts = alerts.filter((a) => a.message.toLowerCase().includes(q) || (a.product || '').toLowerCase().includes(q));
  }

  res.json({ alerts, total: alerts.length, page: 1, limit: alerts.length, totalPages: 1 });
});

// GET /api/alerts/summary
router.get('/summary', (_req, res) => {
  const total = MOCK_ALERTS.length;
  const critical = MOCK_ALERTS.filter((a) => a.severity === 'CRITICAL').length;
  const warning = MOCK_ALERTS.filter((a) => a.severity === 'WARNING').length;
  const info = MOCK_ALERTS.filter((a) => a.severity === 'INFO').length;
  const resolved = MOCK_ALERTS.filter((a) => a.status === 'RESOLVED').length;
  res.json({ total, critical, warning, info, resolved, trends: { total, critical, warning, info, resolved } });
});

// GET /api/alerts/trends
router.get('/trends', (_req, res) => {
  res.json([
    { time: '6AM', critical: 0, warning: 1, info: 0 }, { time: '8AM', critical: 1, warning: 2, info: 1 },
    { time: '10AM', critical: 0, warning: 1, info: 2 }, { time: '12PM', critical: 2, warning: 3, info: 1 },
    { time: '2PM', critical: 1, warning: 2, info: 0 }, { time: '4PM', critical: 1, warning: 1, info: 1 },
    { time: '6PM', critical: 0, warning: 2, info: 1 }, { time: '8PM', critical: 1, warning: 1, info: 0 },
  ]);
});

// GET /api/alerts/categories
router.get('/categories', (_req, res) => {
  res.json([
    { name: 'Inventory', key: 'INVENTORY', count: 3, percentage: 40, color: '#ef4444' },
    { name: 'Queue', key: 'QUEUE', count: 1, percentage: 15, color: '#f59e0b' },
    { name: 'Planogram', key: 'PLANOGRAM', count: 1, percentage: 15, color: '#3b82f6' },
    { name: 'Shopper', key: 'SHOPPER', count: 1, percentage: 15, color: '#8b5cf6' },
    { name: 'System', key: 'SYSTEM', count: 1, percentage: 15, color: '#6b7280' },
  ]);
});

// GET /api/alerts/status-breakdown
router.get('/status-breakdown', (_req, res) => {
  res.json([
    { label: 'Open', status: 'OPEN', count: 4, color: '#ef4444' },
    { label: 'In Progress', status: 'ACKNOWLEDGED', count: 1, color: '#f59e0b' },
    { label: 'Resolved', status: 'RESOLVED', count: 1, color: '#22c55e' },
    { label: 'Ignored', status: 'IGNORED', count: 0, color: '#6b7280' },
  ]);
});

// GET /api/alerts/:id
router.get('/:id', (req, res) => {
  const alert = MOCK_ALERTS.find((a) => a.id === req.params.id);
  res.json(alert || MOCK_ALERTS[0]);
});

// PATCH /api/alerts/:id/acknowledge
router.patch('/:id/acknowledge', (req, res) => {
  const alert = MOCK_ALERTS.find((a) => a.id === req.params.id);
  if (alert) { alert.status = 'ACKNOWLEDGED'; alert.acknowledgedAt = new Date().toISOString(); }
  res.json(alert || { status: 'ACKNOWLEDGED' });
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', (req, res) => {
  const alert = MOCK_ALERTS.find((a) => a.id === req.params.id);
  if (alert) { alert.status = 'RESOLVED'; alert.resolvedAt = new Date().toISOString(); }
  res.json(alert || { status: 'RESOLVED' });
});

// PATCH /api/alerts/:id/assign
router.patch('/:id/assign', (req, res) => {
  const alert = MOCK_ALERTS.find((a) => a.id === req.params.id);
  if (alert) alert.assignedTo = req.body.assignedTo;
  res.json({ assignedTo: req.body.assignedTo });
});

// POST /api/alerts/mark-all-read
router.post('/mark-all-read', (_req, res) => {
  MOCK_ALERTS.forEach((a) => { a.isRead = true; });
  res.json({ success: true, markedCount: MOCK_ALERTS.length });
});

function mapSourceModule(alertType) {
  if (!alertType) return 'SYSTEM';
  if (alertType.includes('STOCK') || alertType.includes('SHELF') || alertType.includes('INVENTORY')) return 'INVENTORY';
  if (alertType.includes('QUEUE')) return 'QUEUE';
  if (alertType.includes('PLANOGRAM') || alertType.includes('PRODUCT') || alertType.includes('FACING')) return 'PLANOGRAM';
  if (alertType.includes('CAMERA')) return 'SYSTEM';
  return 'SYSTEM';
}

export default router;
