/**
 * Users & access management routes.
 */
import { Router } from 'express';
import { users } from '../data/index.js';

const router = Router();

// GET /api/users
router.get('/', (req, res) => {
  let filtered = [...users];
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (req.query.role && req.query.role !== 'ALL') filtered = filtered.filter((u) => u.role === req.query.role);
  if (req.query.status && req.query.status !== 'ALL') filtered = filtered.filter((u) => u.status === req.query.status);
  res.json({ users: filtered, total: filtered.length, page: 1, limit: filtered.length, totalPages: 1 });
});

// GET /api/users/summary
router.get('/summary', (_req, res) => {
  res.json({
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'ACTIVE').length,
    roles: { admin: users.filter((u) => u.role === 'ADMIN').length, storeManager: users.filter((u) => u.role === 'STORE_MANAGER').length, regionalManager: users.filter((u) => u.role === 'REGIONAL_MANAGER').length, staff: users.filter((u) => u.role === 'STAFF').length },
  });
});

// GET /api/users/roles
router.get('/roles', (_req, res) => {
  res.json([
    { id: 'ADMIN', name: 'Administrator', description: 'Full system access', count: users.filter((u) => u.role === 'ADMIN').length },
    { id: 'STORE_MANAGER', name: 'Store Manager', description: 'Manage assigned stores', count: users.filter((u) => u.role === 'STORE_MANAGER').length },
    { id: 'REGIONAL_MANAGER', name: 'Regional Manager', description: 'Oversee regional stores', count: users.filter((u) => u.role === 'REGIONAL_MANAGER').length },
    { id: 'STAFF', name: 'Staff', description: 'Floor operations access', count: users.filter((u) => u.role === 'STAFF').length },
  ]);
});

// GET /api/users/activity
router.get('/activity', (_req, res) => {
  res.json([
    { id: 'act-1', userId: 'usr-admin-001', userName: 'Admin', action: 'Logged in', timestamp: new Date().toISOString(), ipAddress: '192.168.1.10' },
    { id: 'act-2', userId: 'usr-mgr-001', userName: 'Ravi Sharma', action: 'Viewed Dashboard', timestamp: new Date(Date.now() - 300000).toISOString(), ipAddress: '192.168.1.15' },
    { id: 'act-3', userId: 'usr-staff-001', userName: 'Amit Patel', action: 'Resolved alert ALT-002', timestamp: new Date(Date.now() - 600000).toISOString(), ipAddress: '192.168.1.20' },
  ]);
});

// GET /api/users/permissions
router.get('/permissions', (_req, res) => {
  res.json([
    { id: 'perm-1', name: 'dashboard.view', description: 'View dashboard', roles: ['ADMIN', 'STORE_MANAGER', 'REGIONAL_MANAGER', 'STAFF'] },
    { id: 'perm-2', name: 'alerts.manage', description: 'Manage alerts', roles: ['ADMIN', 'STORE_MANAGER'] },
    { id: 'perm-3', name: 'stores.manage', description: 'Manage stores', roles: ['ADMIN'] },
    { id: 'perm-4', name: 'users.manage', description: 'Manage users', roles: ['ADMIN'] },
    { id: 'perm-5', name: 'cameras.manage', description: 'Manage cameras', roles: ['ADMIN', 'STORE_MANAGER'] },
    { id: 'perm-6', name: 'settings.manage', description: 'Manage settings', roles: ['ADMIN'] },
  ]);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  res.json(user || null);
});

// POST /api/users
router.post('/', (req, res) => {
  const newUser = { id: `usr-${Date.now()}`, ...req.body, status: 'ACTIVE', createdAt: new Date().toISOString(), lastLoginAt: null };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PATCH /api/users/:id
router.patch('/:id', (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx !== -1) users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx] || {});
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx !== -1) users.splice(idx, 1);
  res.json({ success: true });
});

export default router;
