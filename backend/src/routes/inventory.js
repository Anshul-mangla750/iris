/**
 * Inventory monitoring routes.
 */
import { Router } from 'express';
import { aiGet } from '../services/aiService.js';

const router = Router();

// GET /api/inventory/overview
router.get('/overview', async (req, res) => {
  const aiInv = await aiGet('/inventory/status');
  if (aiInv && aiInv.products) {
    const total = aiInv.products.length || 1248;
    const inStock = aiInv.products.filter((p) => p.status === 'IN_STOCK').length;
    const lowStock = aiInv.products.filter((p) => p.status === 'LOW_STOCK').length;
    const oos = aiInv.products.filter((p) => p.status === 'OUT_OF_STOCK').length;
    return res.json({
      totalProducts: total, totalProductsTrend: 2,
      inStock: { count: inStock, percentage: Math.round((inStock / total) * 100), trend: 1 },
      lowStock: { count: lowStock, percentage: Math.round((lowStock / total) * 100) },
      outOfStock: { count: oos, percentage: Math.round((oos / total) * 100), trend: oos > 3 ? 2 : -1 },
      planogramCompliance: { percentage: 96, trend: 3 },
      restockRequired: { count: lowStock + oos },
    });
  }
  res.json({
    totalProducts: 1248, totalProductsTrend: 2,
    inStock: { count: 1181, percentage: 95, trend: 1 },
    lowStock: { count: 42, percentage: 3 },
    outOfStock: { count: 25, percentage: 2, trend: -1 },
    planogramCompliance: { percentage: 96, trend: 3 },
    restockRequired: { count: 67 },
  });
});

// GET /api/inventory/status-distribution
router.get('/status-distribution', (_req, res) => {
  res.json([
    { name: 'In Stock', count: 1181, percentage: 95, color: '#22c55e' },
    { name: 'Low Stock', count: 42, percentage: 3, color: '#f59e0b' },
    { name: 'Out of Stock', count: 25, percentage: 2, color: '#ef4444' },
  ]);
});

// GET /api/inventory/trend
router.get('/trend', (_req, res) => {
  res.json([
    { date: 'Mon', inStock: 1190, lowStock: 35, outOfStock: 23 },
    { date: 'Tue', inStock: 1185, lowStock: 38, outOfStock: 25 },
    { date: 'Wed', inStock: 1178, lowStock: 42, outOfStock: 28 },
    { date: 'Thu', inStock: 1181, lowStock: 40, outOfStock: 27 },
    { date: 'Fri', inStock: 1195, lowStock: 30, outOfStock: 23 },
    { date: 'Sat', inStock: 1175, lowStock: 45, outOfStock: 28 },
    { date: 'Sun', inStock: 1181, lowStock: 42, outOfStock: 25 },
  ]);
});

// GET /api/inventory/category-status
router.get('/category-status', (_req, res) => {
  res.json([
    { category: 'Beverages', inStock: 95, lowStock: 3, outOfStock: 2, percentage: 28 },
    { category: 'Snacks', inStock: 92, lowStock: 5, outOfStock: 3, percentage: 22 },
    { category: 'Personal Care', inStock: 97, lowStock: 2, outOfStock: 1, percentage: 18 },
    { category: 'Dairy', inStock: 88, lowStock: 8, outOfStock: 4, percentage: 15 },
    { category: 'Household', inStock: 96, lowStock: 3, outOfStock: 1, percentage: 10 },
    { category: 'Frozen Foods', inStock: 90, lowStock: 6, outOfStock: 4, percentage: 7 },
  ]);
});

// GET /api/inventory/shelves/live
router.get('/shelves/live', (_req, res) => {
  res.json({
    aisle: 'Aisle 2 - Beverages', camera: 'CAM-003',
    imageUrl: '/images/inventory/shelf_live.jpg',
    detections: [
      { id: 'd-1', productId: 'prod-001', label: 'Pepsi 500ml', status: 'Out of Stock', x: 10, y: 20, width: 15, height: 25 },
      { id: 'd-2', productId: 'prod-002', label: 'Coca-Cola 500ml', status: 'In Stock', x: 30, y: 20, width: 15, height: 25 },
      { id: 'd-3', productId: 'prod-003', label: 'Sprite 500ml', status: 'In Stock', x: 50, y: 20, width: 15, height: 25 },
      { id: 'd-4', productId: 'prod-004', label: 'Fanta 500ml', status: 'Low Stock', x: 70, y: 20, width: 15, height: 25 },
    ],
  });
});

// GET /api/inventory/shelves/health
router.get('/shelves/health', (_req, res) => {
  res.json({
    imageUrl: '/images/inventory/shelf_health.jpg', overallScore: 87,
    legend: [
      { name: 'Healthy', color: '#22c55e', count: 42 },
      { name: 'Needs Attention', color: '#f59e0b', count: 8 },
      { name: 'Critical', color: '#ef4444', count: 3 },
    ],
  });
});

// GET /api/inventory/items/low-stock
router.get('/items/low-stock', async (req, res) => {
  const aiInv = await aiGet('/inventory/status');
  if (aiInv && aiInv.products) {
    const lowItems = aiInv.products.filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK');
    if (lowItems.length > 0) {
      return res.json(lowItems.map((p, i) => ({
        id: `ls-${i}`, productName: p.product_id || `Product ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(4, '0')}`,
        currentStock: p.detected_facing || 0, expectedStock: p.expected_facing || 10,
        status: p.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock',
        aisleShelf: `Aisle ${Math.ceil((i + 1) / 3)} - Shelf ${(i % 3) + 1}`,
        lastDetected: 'Just now',
      })));
    }
  }
  res.json([
    { id: 'ls-1', productName: 'Pepsi 500ml', sku: 'SKU-0001', currentStock: 2, expectedStock: 10, status: 'Low Stock', aisleShelf: 'Aisle 2 - Shelf 3', lastDetected: '2 min ago' },
    { id: 'ls-2', productName: 'Maggi 70g', sku: 'SKU-0042', currentStock: 1, expectedStock: 8, status: 'Low Stock', aisleShelf: 'Aisle 1 - Shelf 2', lastDetected: '5 min ago' },
    { id: 'ls-3', productName: 'Dove Soap', sku: 'SKU-0108', currentStock: 0, expectedStock: 5, status: 'Out of Stock', aisleShelf: 'Aisle 3 - Shelf 1', lastDetected: '8 min ago' },
    { id: 'ls-4', productName: "Lay's Classic Chips", sku: 'SKU-0023', currentStock: 3, expectedStock: 10, status: 'Low Stock', aisleShelf: 'Aisle 1 - Shelf 4', lastDetected: '12 min ago' },
    { id: 'ls-5', productName: 'Amul Milk 1L', sku: 'SKU-0075', currentStock: 2, expectedStock: 8, status: 'Low Stock', aisleShelf: 'Aisle 4 - Shelf 1', lastDetected: '15 min ago' },
  ]);
});

// GET /api/inventory/events
router.get('/events', (_req, res) => {
  res.json([
    { id: 'ie-1', time: '3:10 PM', event: 'Stock level low', eventType: 'stock_low', product: 'Pepsi 500ml', aisleShelf: 'Aisle 2 - Shelf 3', status: 'Low Stock' },
    { id: 'ie-2', time: '2:45 PM', event: 'Out of stock detected', eventType: 'stock_out', product: 'Dove Soap', aisleShelf: 'Aisle 3 - Shelf 1', status: 'Out of Stock' },
    { id: 'ie-3', time: '2:30 PM', event: 'Shelf restocked', eventType: 'restocked', product: 'Coca-Cola 500ml', aisleShelf: 'Aisle 2 - Shelf 3', status: 'In Stock' },
    { id: 'ie-4', time: '1:15 PM', event: 'Planogram mismatch', eventType: 'mismatch', product: 'Maggi 70g', aisleShelf: 'Aisle 1 - Shelf 2', status: 'Misplaced' },
  ]);
});

export default router;
