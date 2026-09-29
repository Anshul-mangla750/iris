/**
 * Planogram compliance routes.
 */
import { Router } from 'express';

const router = Router();

// GET /api/planogram/overview
router.get('/overview', (_req, res) => {
  res.json({
    overallCompliance: 96, complianceTrend: 3, lastScanAt: new Date().toISOString(),
    totalShelves: 56, compliantShelves: 54, nonCompliantShelves: 2,
    kpis: [
      { id: 'compliance', title: 'Overall Compliance', value: '96%', trend: '↑ 3%', trendDirection: 'up', theme: 'emerald' },
      { id: 'correct', title: 'Correctly Placed', value: '48', trend: '↑ 2', trendDirection: 'up', theme: 'blue' },
      { id: 'misplaced', title: 'Misplaced Items', value: '3', trend: '↓ 1', trendDirection: 'up', theme: 'amber' },
      { id: 'missing', title: 'Missing Items', value: '5', trend: '↑ 2', trendDirection: 'down', theme: 'red' },
    ],
  });
});

// GET /api/planogram/live-detection
router.get('/live-detection', (_req, res) => {
  res.json({
    imageUrl: '/images/planogram/shelf_detection.jpg', camera: 'CAM-003', aisle: 'Aisle 2 — Beverages',
    lastUpdated: new Date().toISOString(), detectionCount: 24,
    detections: [
      { id: 'pd-1', label: 'Coca-Cola 500ml', status: 'CORRECT', confidence: 0.96, x: 10, y: 15, width: 12, height: 20 },
      { id: 'pd-2', label: 'Pepsi 500ml', status: 'MISSING', confidence: 0, x: 25, y: 15, width: 12, height: 20 },
      { id: 'pd-3', label: 'Sprite 500ml', status: 'CORRECT', confidence: 0.94, x: 40, y: 15, width: 12, height: 20 },
      { id: 'pd-4', label: 'Maggi 70g', status: 'MISPLACED', confidence: 0.88, x: 55, y: 15, width: 12, height: 20 },
    ],
  });
});

// GET /api/planogram/comparison
router.get('/comparison', (_req, res) => {
  res.json({
    expectedImageUrl: '/images/planogram/expected_layout.jpg',
    actualImageUrl: '/images/planogram/actual_layout.jpg',
    matchPercentage: 96,
    differences: [
      { id: 'diff-1', product: 'Pepsi 500ml', expected: 'Aisle 2 - Shelf 3 - Pos 4', actual: 'Missing', type: 'MISSING' },
      { id: 'diff-2', product: 'Maggi 70g', expected: 'Aisle 1 - Shelf 2 - Pos 3', actual: 'Aisle 2 - Shelf 1 - Pos 1', type: 'MISPLACED' },
      { id: 'diff-3', product: "Lay's Chips", expected: 'Aisle 1 - Shelf 4 - Pos 2', actual: 'Aisle 1 - Shelf 4 - Pos 5', type: 'WRONG_POSITION' },
    ],
  });
});

// GET /api/planogram/category-compliance
router.get('/category-compliance', (_req, res) => {
  res.json([
    { category: 'Beverages', compliance: 94, totalItems: 120, compliant: 113, nonCompliant: 7, color: '#3b82f6' },
    { category: 'Snacks', compliance: 97, totalItems: 95, compliant: 92, nonCompliant: 3, color: '#8b5cf6' },
    { category: 'Personal Care', compliance: 98, totalItems: 80, compliant: 78, nonCompliant: 2, color: '#10b981' },
    { category: 'Dairy', compliance: 92, totalItems: 65, compliant: 60, nonCompliant: 5, color: '#f59e0b' },
    { category: 'Household', compliance: 99, totalItems: 50, compliant: 50, nonCompliant: 0, color: '#ef4444' },
  ]);
});

// GET /api/planogram/compliance-trend
router.get('/compliance-trend', (_req, res) => {
  res.json([
    { date: 'Mon', compliance: 93 }, { date: 'Tue', compliance: 94 },
    { date: 'Wed', compliance: 92 }, { date: 'Thu', compliance: 95 },
    { date: 'Fri', compliance: 96 }, { date: 'Sat', compliance: 94 },
    { date: 'Sun', compliance: 96 },
  ]);
});

// GET /api/planogram/non-compliant
router.get('/non-compliant', (_req, res) => {
  res.json([
    { id: 'nc-1', productName: 'Pepsi 500ml', sku: 'SKU-0001', expectedLocation: 'Aisle 2 - Shelf 3 - Pos 4', actualLocation: 'Missing', violationType: 'MISSING', severity: 'HIGH', lastDetected: '2 min ago', image: '/images/products/pepsi.png' },
    { id: 'nc-2', productName: 'Maggi 70g', sku: 'SKU-0042', expectedLocation: 'Aisle 1 - Shelf 2 - Pos 3', actualLocation: 'Aisle 2 - Shelf 1', violationType: 'MISPLACED', severity: 'MEDIUM', lastDetected: '12 min ago', image: '/images/products/maggi.png' },
    { id: 'nc-3', productName: "Lay's Classic", sku: 'SKU-0023', expectedLocation: 'Aisle 1 - Shelf 4 - Pos 2', actualLocation: 'Aisle 1 - Shelf 4 - Pos 5', violationType: 'WRONG_POSITION', severity: 'LOW', lastDetected: '25 min ago', image: '/images/products/lays.png' },
  ]);
});

// GET /api/planogram/insights
router.get('/insights', (_req, res) => {
  res.json([
    { id: 'pi-1', type: 'suggestion', title: 'Beverages section needs attention', description: 'Compliance dropped 2% this week. 3 products are consistently misplaced.', priority: 'high' },
    { id: 'pi-2', type: 'trend', title: 'Overall compliance improving', description: 'Week-over-week improvement of 3%. Staff training is showing results.', priority: 'low' },
    { id: 'pi-3', type: 'action', title: 'Restock Pepsi 500ml immediately', description: 'Product has been missing from shelf for 2+ hours. High-demand item.', priority: 'high' },
  ]);
});

export default router;
