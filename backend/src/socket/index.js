/**
 * Socket.IO real-time event manager.
 * Polls AI service metrics and pushes live updates to connected dashboards.
 */
import { Server } from 'socket.io';
import { aiGet } from '../services/aiService.js';
import { tickLiveState } from '../services/liveState.js';

let io = null;
let pollInterval = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] client connected: ${socket.id}`);

    socket.on('subscribe:dashboard', (storeId) => {
      socket.join(`dashboard:${storeId || 'store-001'}`);
      socket.join('dashboard');
    });

    socket.on('subscribe:alerts', () => {
      socket.join('alerts');
    });

    socket.on('subscribe:camera', (cameraId) => {
      socket.join(`camera:${cameraId || 'cam_0'}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] client disconnected: ${socket.id}`);
    });
  });

  // Start continuous real-time ticking & polling
  startPolling();

  return io;
}

export function getIO() {
  return io;
}

export function emitAlert(alert) {
  if (io) {
    io.to('alerts').emit('alert:new', alert);
    io.to(`dashboard:${alert.storeId || 'store-001'}`).emit('alert:new', alert);
    io.emit('alert:new', alert);
  }
}

export function emitMetrics(storeId, metrics) {
  if (io) {
    io.to(`dashboard:${storeId}`).emit('metrics:live', metrics);
    io.emit('metrics:live', metrics);
  }
}

function startPolling() {
  // Broadcast real-time edge store telemetry every 2.5 seconds
  pollInterval = setInterval(async () => {
    if (!io) return;

    // 1. Advance and broadcast live telemetry
    tickLiveState(io);

    // 2. Poll AI service for live metrics if active
    try {
      const metrics = await aiGet('/metrics/live');
      if (metrics && metrics.status !== 'DATA_NOT_AVAILABLE') {
        emitMetrics('store-001', metrics);
      }

      // Poll alerts
      const alertsData = await aiGet('/alerts', { limit: 5 });
      if (alertsData && alertsData.alerts && alertsData.alerts.length > 0) {
        io.to('alerts').emit('alerts:update', alertsData);
        io.emit('alerts:update', alertsData);
      }
    } catch {
      // AI service idle
    }
  }, 2500);
}

export function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}
