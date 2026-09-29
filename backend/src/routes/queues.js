import { Router } from 'express';
import { aiGet } from '../services/aiService.js';
import { getLiveState, setCounterStatus } from '../services/liveState.js';

const router = Router();

// GET /api/queues/overview
router.get('/overview', async (req, res) => {
  const liveState = getLiveState();
  const aiQueue = await aiGet('/queue/status');
  const queueData = aiQueue || {};
  const queues = queueData.queues || {};

  const totalServed = Object.values(queues).reduce((sum, q) => sum + (q.served || 0), 0) || (847 + Math.floor(liveState.totalFootfall * 0.4));
  const currentLength = Object.values(queues).reduce((sum, q) => sum + (q.length || 0), 0) || liveState.counters.reduce((s, c) => s + c.currentQueue, 0);
  const avgWait = queueData.avg_wait_s ? (queueData.avg_wait_s / 60).toFixed(1) : (liveState.counters.reduce((s, c) => s + c.avgWaitTime, 0) / Math.max(1, liveState.counters.length)).toFixed(1);

  res.json({
    totalCustomersServed: totalServed, totalCustomersTrend: 8,
    avgWaitTime: parseFloat(avgWait), avgWaitTimeTrend: -18,
    currentQueueLength: currentLength, currentQueueStatus: currentLength > 15 ? 'High' : 'Normal',
    predictedWaitTime: Number((parseFloat(avgWait) * 1.15).toFixed(1)), predictedHorizon: 'Next 30 minutes',
    busiestCounter: 'Counter 1', busiestCounterTraffic: 'High Traffic',
    queueSatisfaction: 92, queueSatisfactionTrend: 4,
  });
});

// GET /api/queues/live
router.get('/live', async (req, res) => {
  const liveState = getLiveState();
  const aiQueue = await aiGet('/queue/status');
  if (aiQueue && aiQueue.queues) {
    const result = Object.entries(aiQueue.queues).map(([id, q], i) => ({
      id, name: `Counter ${i + 1}`, currentQueue: q.length || 0,
      avgWaitTime: q.avg_wait_s ? Math.round(q.avg_wait_s / 60) : 3,
      status: (q.length || 0) > 5 ? 'High' : (q.length || 0) > 0 ? 'Normal' : 'Open',
      trend: 'stable', iconColor: (q.length || 0) > 5 ? '#ef4444' : '#22c55e',
    }));
    return res.json(result);
  }
  res.json(liveState.counters);
});

// PATCH /api/queues/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body || {};
  const updated = setCounterStatus(req.params.id, status || 'Normal');
  res.json({ success: true, counters: updated });
});

// GET /api/queues/heatmap
router.get('/heatmap', (_req, res) => {
  res.json({
    imageUrl: '/images/queues/queue_heatmap.jpg', activeZone: 'Checkout Area',
    legend: [
      { name: 'High Congestion', color: '#ef4444' }, { name: 'Medium', color: '#f59e0b' },
      { name: 'Low', color: '#22c55e' }, { name: 'Empty', color: '#e5e7eb' },
    ],
  });
});

// GET /api/queues/trend
router.get('/trend', (_req, res) => {
  res.json([
    { time: '6AM', counter1: 2, counter2: 1, counter3: 0, counter4: 1, counter5: 0 },
    { time: '9AM', counter1: 5, counter2: 3, counter3: 2, counter4: 4, counter5: 1 },
    { time: '12PM', counter1: 8, counter2: 6, counter3: 4, counter4: 7, counter5: 3 },
    { time: '3PM', counter1: 6, counter2: 4, counter3: 3, counter4: 5, counter5: 2 },
    { time: '6PM', counter1: 10, counter2: 7, counter3: 5, counter4: 8, counter5: 4 },
    { time: '9PM', counter1: 4, counter2: 2, counter3: 1, counter4: 3, counter5: 1 },
  ]);
});

// GET /api/queues/predictions
router.get('/predictions', async (req, res) => {
  const aiPred = await aiGet('/queue/prediction');
  if (aiPred && aiPred.prediction) {
    return res.json([
      { time: 'Now', predicted: 12, lowerBound: 10, upperBound: 14 },
      { time: '15 min', predicted: 15, lowerBound: 12, upperBound: 18 },
      { time: '30 min', predicted: 18, lowerBound: 14, upperBound: 22 },
      { time: '45 min', predicted: 14, lowerBound: 11, upperBound: 17 },
      { time: '1 hr', predicted: 10, lowerBound: 8, upperBound: 12 },
      { time: '1.5 hr', predicted: 7, lowerBound: 5, upperBound: 9 },
      { time: '2 hr', predicted: 5, lowerBound: 3, upperBound: 7 },
    ]);
  }
  res.json([
    { time: 'Now', predicted: 12, lowerBound: 10, upperBound: 14 },
    { time: '15 min', predicted: 15, lowerBound: 12, upperBound: 18 },
    { time: '30 min', predicted: 18, lowerBound: 14, upperBound: 22 },
    { time: '45 min', predicted: 14, lowerBound: 11, upperBound: 17 },
    { time: '1 hr', predicted: 10, lowerBound: 8, upperBound: 12 },
    { time: '1.5 hr', predicted: 7, lowerBound: 5, upperBound: 9 },
    { time: '2 hr', predicted: 5, lowerBound: 3, upperBound: 7 },
  ]);
});

// GET /api/queues/wait-time-distribution
router.get('/wait-time-distribution', (_req, res) => {
  res.json([
    { range: '0-2 min', percentage: 35, color: '#22c55e' },
    { range: '2-5 min', percentage: 28, color: '#3b82f6' },
    { range: '5-10 min', percentage: 20, color: '#f59e0b' },
    { range: '10-15 min', percentage: 10, color: '#f97316' },
    { range: '> 15 min', percentage: 7, color: '#ef4444' },
  ]);
});

// GET /api/queues/peak-hours
router.get('/peak-hours', (_req, res) => {
  const counters = ['Counter 1', 'Counter 2', 'Counter 3', 'Counter 4', 'Counter 5'];
  const slots = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
  const levels = ['empty', 'low', 'medium', 'high', 'very_high'];
  const matrix = [];
  for (const counter of counters) {
    for (const slot of slots) {
      const idx = Math.floor(Math.random() * 5);
      matrix.push({ counter, timeSlot: slot, level: levels[idx] });
    }
  }
  // Make 12PM-6PM "high" for counter 1
  matrix.forEach((c) => {
    if (c.counter === 'Counter 1' && ['12PM', '2PM', '4PM', '6PM'].includes(c.timeSlot)) {
      c.level = Math.random() > 0.3 ? 'very_high' : 'high';
    }
  });
  res.json(matrix);
});

// GET /api/queues/insights
router.get('/insights', (_req, res) => {
  res.json([
    { id: 'qi-1', iconType: 'clock', title: 'Average wait time reduced by 18%', description: 'Customers are being served faster today compared to last week.' },
    { id: 'qi-2', iconType: 'activity', title: 'Peak congestion expected at 5 PM', description: 'Based on historical patterns, consider opening Counter 3 early.' },
    { id: 'qi-3', iconType: 'lightbulb', title: 'Counter 4 consistently busiest', description: 'Consider adding express checkout lanes near Counter 4.' },
    { id: 'qi-4', iconType: 'check', title: 'Queue satisfaction score: 92%', description: 'Up 4% from last week. Staff responsiveness is improving.' },
  ]);
});

// GET /api/queues/events
router.get('/events', (_req, res) => {
  res.json([
    { id: 'qe-1', time: '3:15 PM', event: 'Queue length exceeded threshold', eventType: 'queue_high', counter: 'Counter 1', details: '8 people waiting', status: 'Open' },
    { id: 'qe-2', time: '2:45 PM', event: 'Queue reduced after staff assist', eventType: 'queue_reduced', counter: 'Counter 4', details: 'Down from 7 to 3', status: 'Resolved' },
    { id: 'qe-3', time: '1:30 PM', event: 'New counter opened', eventType: 'new_counter', counter: 'Counter 3', details: 'Lunch rush management', status: 'Completed' },
    { id: 'qe-4', time: '12:00 PM', event: 'Staff assist requested', eventType: 'staff_assist', counter: 'Counter 1', details: 'Price check delay', status: 'Resolved' },
  ]);
});

export default router;
