/**
 * Product management routes.
 */
import { Router } from 'express';

const router = Router();

const PRODUCTS = [
  { id: 'prod-001', name: 'Pepsi 500ml', sku: 'SKU-0001', category: 'Beverages', brand: 'PepsiCo', price: 40, mrp: 40, status: 'LOW_STOCK', currentStock: 2, minStock: 10, shelfLocation: 'Aisle 2 - Shelf 3', image: '/images/products/pepsi.png', barcode: '8901234567890', weight: '500ml', planogramPosition: { aisle: 'Aisle 2', shelf: 3, position: 4, facing: 3 } },
  { id: 'prod-002', name: 'Coca-Cola 500ml', sku: 'SKU-0002', category: 'Beverages', brand: 'Coca-Cola', price: 40, mrp: 40, status: 'IN_STOCK', currentStock: 24, minStock: 10, shelfLocation: 'Aisle 2 - Shelf 3', image: '/images/products/coke.png', barcode: '8901234567891', weight: '500ml', planogramPosition: { aisle: 'Aisle 2', shelf: 3, position: 1, facing: 4 } },
  { id: 'prod-003', name: 'Sprite 500ml', sku: 'SKU-0003', category: 'Beverages', brand: 'Coca-Cola', price: 40, mrp: 40, status: 'IN_STOCK', currentStock: 18, minStock: 8, shelfLocation: 'Aisle 2 - Shelf 3', image: '/images/products/sprite.png', barcode: '8901234567892', weight: '500ml', planogramPosition: { aisle: 'Aisle 2', shelf: 3, position: 2, facing: 3 } },
  { id: 'prod-004', name: 'Maggi 70g', sku: 'SKU-0042', category: 'Snacks', brand: 'Nestle', price: 14, mrp: 14, status: 'IN_STOCK', currentStock: 35, minStock: 15, shelfLocation: 'Aisle 1 - Shelf 2', image: '/images/products/maggi.png', barcode: '8901234567893', weight: '70g', planogramPosition: { aisle: 'Aisle 1', shelf: 2, position: 3, facing: 5 } },
  { id: 'prod-005', name: "Lay's Classic Chips", sku: 'SKU-0023', category: 'Snacks', brand: 'PepsiCo', price: 20, mrp: 20, status: 'LOW_STOCK', currentStock: 3, minStock: 10, shelfLocation: 'Aisle 1 - Shelf 4', image: '/images/products/lays.png', barcode: '8901234567894', weight: '52g', planogramPosition: { aisle: 'Aisle 1', shelf: 4, position: 2, facing: 4 } },
  { id: 'prod-006', name: 'Dove Soap 100g', sku: 'SKU-0108', category: 'Personal Care', brand: 'Unilever', price: 55, mrp: 55, status: 'OUT_OF_STOCK', currentStock: 0, minStock: 5, shelfLocation: 'Aisle 3 - Shelf 1', image: '/images/products/dove.png', barcode: '8901234567895', weight: '100g', planogramPosition: { aisle: 'Aisle 3', shelf: 1, position: 1, facing: 3 } },
  { id: 'prod-007', name: 'Amul Milk 1L', sku: 'SKU-0075', category: 'Dairy', brand: 'Amul', price: 62, mrp: 62, status: 'LOW_STOCK', currentStock: 2, minStock: 8, shelfLocation: 'Aisle 4 - Shelf 1', image: '/images/products/amul_milk.png', barcode: '8901234567896', weight: '1L', planogramPosition: { aisle: 'Aisle 4', shelf: 1, position: 2, facing: 4 } },
  { id: 'prod-008', name: 'Surf Excel 1kg', sku: 'SKU-0150', category: 'Household', brand: 'Unilever', price: 220, mrp: 220, status: 'IN_STOCK', currentStock: 15, minStock: 5, shelfLocation: 'Aisle 5 - Shelf 2', image: '/images/products/surf.png', barcode: '8901234567897', weight: '1kg', planogramPosition: { aisle: 'Aisle 5', shelf: 2, position: 1, facing: 3 } },
];

// GET /api/products
router.get('/', (req, res) => {
  let filtered = [...PRODUCTS];
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (req.query.category && req.query.category !== 'All Categories') filtered = filtered.filter((p) => p.category === req.query.category);
  if (req.query.status && req.query.status !== 'ALL') filtered = filtered.filter((p) => p.status === req.query.status);
  res.json(filtered);
});

// GET /api/products/summary
router.get('/summary', (_req, res) => {
  res.json({
    totalProducts: PRODUCTS.length, inStock: PRODUCTS.filter((p) => p.status === 'IN_STOCK').length,
    lowStock: PRODUCTS.filter((p) => p.status === 'LOW_STOCK').length, outOfStock: PRODUCTS.filter((p) => p.status === 'OUT_OF_STOCK').length,
    categories: 5, totalValue: PRODUCTS.reduce((sum, p) => sum + p.price * p.currentStock, 0),
  });
});

// GET /api/products/categories
router.get('/categories', (_req, res) => {
  const cats = [...new Set(PRODUCTS.map((p) => p.category))];
  res.json(cats.map((c) => ({ name: c, count: PRODUCTS.filter((p) => p.category === c).length })));
});

// GET /api/products/category-distribution
router.get('/category-distribution', (_req, res) => {
  const cats = [...new Set(PRODUCTS.map((p) => p.category))];
  const total = PRODUCTS.length;
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
  res.json(cats.map((c, i) => {
    const count = PRODUCTS.filter((p) => p.category === c).length;
    return { name: c, count, percentage: Math.round((count / total) * 100), color: colors[i % colors.length] };
  }));
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const prod = PRODUCTS.find((p) => p.id === req.params.id || p.sku === req.params.id);
  res.json(prod || null);
});

// POST /api/products
router.post('/', (req, res) => {
  const newProd = { id: `prod-${String(PRODUCTS.length + 1).padStart(3, '0')}`, ...req.body, status: 'IN_STOCK' };
  PRODUCTS.push(newProd);
  res.status(201).json(newProd);
});

// PATCH /api/products/:id
router.patch('/:id', (req, res) => {
  const idx = PRODUCTS.findIndex((p) => p.id === req.params.id);
  if (idx !== -1) PRODUCTS[idx] = { ...PRODUCTS[idx], ...req.body };
  res.json(PRODUCTS[idx] || {});
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const idx = PRODUCTS.findIndex((p) => p.id === req.params.id);
  if (idx !== -1) PRODUCTS.splice(idx, 1);
  res.json({ success: true });
});

export default router;
