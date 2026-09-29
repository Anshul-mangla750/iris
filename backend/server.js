/**
 * RetailEdge AI — Backend Express Server
 * Bridges React Frontend to FastAPI AI Engine and real-time WebSockets.
 */
import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from './src/config.js';
import { initSocket } from './src/socket/index.js';

// Route imports
import authRoutes from './src/routes/auth.js';
import dashboardRoutes from './src/routes/dashboard.js';
import cameraRoutes from './src/routes/cameras.js';
import alertRoutes from './src/routes/alerts.js';
import inventoryRoutes from './src/routes/inventory.js';
import queueRoutes from './src/routes/queues.js';
import shopperRoutes from './src/routes/shopper.js';
import storeRoutes from './src/routes/stores.js';
import integrationRoutes from './src/routes/integrations.js';
import userRoutes from './src/routes/users.js';
import settingsRoutes from './src/routes/settings.js';
import planogramRoutes from './src/routes/planogram.js';
import productRoutes from './src/routes/products.js';
import analyticsRoutes from './src/routes/analytics.js';

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors({
  origin: true, // Allow frontend dev server and production
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Request logging in development
app.use((req, _res, next) => {
  if (config.nodeEnv === 'development' && !req.path.startsWith('/socket.io')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    aiServiceUrl: config.aiServiceUrl,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/shopper', shopperRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/planogram', planogramRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `API route not found: ${req.method} ${req.baseUrl}`,
  });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('[Backend Error]:', err);
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred.',
  });
});

// Initialize Socket.io
initSocket(server);

// Start server
server.listen(config.port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 RetailEdge AI Backend running on port ${config.port}`);
  console.log(`🔗 AI Service URL: ${config.aiServiceUrl}`);
  console.log(`📡 WebSocket ready at ws://localhost:${config.port}/socket.io`);
  console.log(`======================================================\n`);
});

export default app;
