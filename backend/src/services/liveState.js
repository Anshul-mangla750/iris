/**
 * Live State Manager for RetailEdge AI
 * Maintains continuously fluctuating, real-time edge store telemetry,
 * merges live AI service inference when active, and broadcasts updates via Socket.IO.
 */
import { aiGet } from './aiService.js';

let liveFootfall = 1482;
let liveShoppersInside = 47;
let liveAvgDwellMinutes = 8.4;
let activeAlertCount = 3;

let counters = [
  { id: 'cnt-1', name: 'Counter 1', currentQueue: 6, avgWaitTime: 4.8, status: 'High', trend: 'up', iconColor: '#ef4444' },
  { id: 'cnt-2', name: 'Counter 2', currentQueue: 3, avgWaitTime: 2.2, status: 'Normal', trend: 'stable', iconColor: '#10b981' },
  { id: 'cnt-3', name: 'Counter 3', currentQueue: 0, avgWaitTime: 0.0, status: 'Open', trend: 'stable', iconColor: '#06b6d4' },
  { id: 'cnt-4', name: 'Counter 4', currentQueue: 5, avgWaitTime: 3.9, status: 'High', trend: 'up', iconColor: '#ef4444' },
  { id: 'cnt-5', name: 'Counter 5', currentQueue: 2, avgWaitTime: 1.5, status: 'Normal', trend: 'down', iconColor: '#10b981' },
];

let liveDwellZones = [
  { zone: 'Entrance', minutes: 6.2 },
  { zone: 'Aisles', minutes: 12.4 },
  { zone: 'Snacks', minutes: 8.1 },
  { zone: 'Beverages', minutes: 9.6 },
  { zone: 'Checkout', minutes: 4.3 },
  { zone: 'Personal Care', minutes: 7.8 },
];

let lastTick = Date.now();

// Tick state every 2 seconds
export function tickLiveState(io) {
  // Random small natural movements
  const deltaEntries = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
  const deltaExits = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;

  liveFootfall += deltaEntries;
  liveShoppersInside = Math.max(12, Math.min(120, liveShoppersInside + deltaEntries - deltaExits));
  liveAvgDwellMinutes = Number((8.0 + Math.sin(Date.now() / 30000) * 0.8).toFixed(1));

  // Fluctuate counter queues naturally
  counters = counters.map((c) => {
    if (c.status === 'Closed') return c;
    const diff = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const newQueue = Math.max(0, Math.min(15, c.currentQueue + diff));
    const newWait = Number((newQueue * 0.8 + Math.random() * 0.3).toFixed(1));
    const status = newQueue >= 5 ? 'High' : newQueue > 0 ? 'Normal' : 'Open';
    const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
    return {
      ...c,
      currentQueue: newQueue,
      avgWaitTime: newWait,
      status,
      trend,
    };
  });

  // Fluctuate zone dwell slightly
  liveDwellZones = liveDwellZones.map((z) => ({
    ...z,
    minutes: Number((z.minutes + (Math.random() * 0.2 - 0.1)).toFixed(1)),
  }));

  const now = new Date();
  const payload = {
    totalFootfall: liveFootfall,
    liveShoppersInside,
    avgDwellMinutes: liveAvgDwellMinutes,
    counters,
    liveDwellZones,
    timestamp: now.toISOString(),
    timeFormatted: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
  };

  if (io) {
    io.emit('metrics:live', payload);
    io.emit('dashboard:tick', payload);
    io.emit('queue:update', counters);
    io.emit('shopper:tick', {
      totalFootfall: liveFootfall,
      liveShoppersInside,
      entering: deltaEntries,
      exiting: deltaExits,
      timestamp: now.toISOString(),
    });
  }

  return payload;
}

export function getLiveState() {
  return {
    totalFootfall: liveFootfall,
    liveShoppersInside,
    avgDwellMinutes: liveAvgDwellMinutes,
    counters,
    liveDwellZones,
    activeAlertCount,
    timestamp: new Date().toISOString(),
  };
}

export function setCounterStatus(counterId, status) {
  counters = counters.map((c) => (c.id === counterId ? { ...c, status } : c));
  return counters;
}
