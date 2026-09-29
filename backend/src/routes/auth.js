/**
 * Auth routes — demo mode (no JWT).
 * Any email/password combination works for prototype.
 */
import { Router } from 'express';
import { users } from '../data/index.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, rememberMe } = req.body;
  const match = users.find((u) => u.email === email);
  const user = match || {
    id: 'usr-admin-001',
    name: 'Admin',
    email: email || 'admin@retailedge.ai',
    role: 'ADMIN',
  };
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: 'demo-token-retailedge',
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({
    user: { id: 'usr-admin-001', name: 'Admin', email: 'admin@retailedge.ai', role: 'ADMIN' },
  });
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.json({ success: true });
});

export default router;
