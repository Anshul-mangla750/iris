/**
 * Camera management routes — proxies to AI service for live data.
 */
import { Router } from 'express';
import { aiGet, aiPost, aiStream } from '../services/aiService.js';

const router = Router();

const MOCK_CAMERAS = [
  { id: 'CAM001', organizationId: 'org-001', storeId: 'store-001', zoneId: 'zone-entrance', zoneName: 'Entrance', name: 'Entrance Main Camera', code: 'CAM-ENT-01', type: 'FIXED', status: 'ONLINE', resolution: 'HD 1080p', fps: 30, streamIdentifier: 'rtsp://edge-01.local/live/cam-ent-01', uptime: 99.8, storageUsage: 54, lastSeenAt: 'Just now', aiProcessingStatus: 'ACTIVE', image: '/images/cameras/cam_entrance.png', createdAt: '2024-01-15T10:00:00Z', updatedAt: new Date().toISOString() },
  { id: 'CAM002', organizationId: 'org-001', storeId: 'store-001', zoneId: 'zone-aisle1', zoneName: 'Aisle 1 — Snacks', name: 'Aisle 1 Camera', code: 'CAM-A1-01', type: 'PTZ', status: 'ONLINE', resolution: 'HD 1080p', fps: 25, streamIdentifier: 'rtsp://edge-01.local/live/cam-a1-01', uptime: 99.5, storageUsage: 62, lastSeenAt: '1 min ago', aiProcessingStatus: 'ACTIVE', image: '/images/cameras/cam_aisle1.png', createdAt: '2024-01-15T10:00:00Z', updatedAt: new Date().toISOString() },
  { id: 'CAM003', organizationId: 'org-001', storeId: 'store-001', zoneId: 'zone-aisle2', zoneName: 'Aisle 2 — Beverages', name: 'Aisle 2 Camera', code: 'CAM-A2-01', type: 'FIXED', status: 'ONLINE', resolution: 'Full HD 1080p', fps: 30, streamIdentifier: 'rtsp://edge-01.local/live/cam-a2-01', uptime: 99.6, storageUsage: 48, lastSeenAt: 'Just now', aiProcessingStatus: 'ACTIVE', image: '/images/cameras/cam_aisle2.png', createdAt: '2024-01-15T10:00:00Z', updatedAt: new Date().toISOString() },
  { id: 'CAM004', organizationId: 'org-001', storeId: 'store-001', zoneId: 'zone-checkout', zoneName: 'Checkout Area', name: 'Checkout Camera', code: 'CAM-CHK-01', type: 'FIXED', status: 'ONLINE', resolution: 'HD 1080p', fps: 30, streamIdentifier: 'rtsp://edge-01.local/live/cam-chk-01', uptime: 99.7, storageUsage: 71, lastSeenAt: 'Just now', aiProcessingStatus: 'ACTIVE', image: '/images/cameras/cam_checkout.png', createdAt: '2024-01-15T10:00:00Z', updatedAt: new Date().toISOString() },
  { id: 'CAM005', organizationId: 'org-001', storeId: 'store-001', zoneId: 'zone-back', zoneName: 'Back Storage', name: 'Storage Room Camera', code: 'CAM-STR-01', type: 'FIXED', status: 'OFFLINE', resolution: 'HD 720p', fps: 15, streamIdentifier: 'rtsp://edge-01.local/live/cam-str-01', uptime: 85.2, storageUsage: 30, lastSeenAt: '2 hours ago', aiProcessingStatus: 'INACTIVE', image: '/images/cameras/cam_storage.png', createdAt: '2024-02-01T10:00:00Z', updatedAt: new Date().toISOString() },
];

// GET /api/cameras
router.get('/', async (req, res) => {
  let cameras = [...MOCK_CAMERAS];
  // Try to get AI service camera status
  const aiData = await aiGet('/cameras');
  const aiCams = Array.isArray(aiData) ? aiData : (aiData?.registered || []);
  if (aiCams && Array.isArray(aiCams) && aiCams.length > 0) {
    cameras.forEach((cam) => {
      const aiCam = aiCams.find((a) => a.camera_id === cam.code?.toLowerCase()?.replace(/-/g, '_'));
      if (aiCam) {
        cam.status = aiCam.status === 'RUNNING' ? 'ONLINE' : aiCam.status === 'STOPPED' ? 'OFFLINE' : cam.status;
        cam.fps = aiCam.fps || cam.fps;
      }
    });
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    cameras = cameras.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.zoneName.toLowerCase().includes(q));
  }
  if (req.query.status && req.query.status !== 'ALL') cameras = cameras.filter((c) => c.status === req.query.status);
  if (req.query.type && req.query.type !== 'ALL') cameras = cameras.filter((c) => c.type === req.query.type);
  res.json(cameras);
});

// GET /api/cameras/summary
router.get('/summary', (_req, res) => {
  const total = MOCK_CAMERAS.length;
  const online = MOCK_CAMERAS.filter((c) => c.status === 'ONLINE').length;
  res.json({
    totalCameras: total,
    onlineCameras: online,
    offlineCameras: total - online,
    activeAlerts: 3,
    storageUsage: 62,
    trends: {
      totalCameras: 20,
      onlineCameras: 11,
      offlineCameras: -33,
      activeAlerts: -27,
      storageUsage: 5,
    },
  });
});

// GET /api/cameras/health
router.get('/health', (_req, res) => {
  res.json(MOCK_CAMERAS.map((c) => ({
    cameraId: c.id, cameraName: c.name, status: c.status,
    uptime: `${c.uptime}%`, storageUsage: `${c.storageUsage}%`,
    fps: c.fps, resolution: c.resolution, lastCheckedAt: c.lastSeenAt,
  })));
});

// GET /api/cameras/insights
router.get('/insights', (_req, res) => {
  res.json([
    { id: 'ci-1', type: 'performance', title: 'Camera 4 has highest traffic', description: 'Checkout camera processes 40% of all person detections', severity: 'info', timestamp: new Date().toISOString() },
    { id: 'ci-2', type: 'alert', title: 'Storage camera offline', description: 'CAM-STR-01 has been offline for 2 hours', severity: 'warning', timestamp: new Date().toISOString() },
  ]);
});

// GET /api/cameras/heatmap
router.get('/heatmap', (_req, res) => {
  res.json({ zones: MOCK_CAMERAS.filter((c) => c.status === 'ONLINE').map((c) => ({ id: c.zoneId, name: c.zoneName, density: Math.round(Math.random() * 100), x: Math.round(Math.random() * 80) + 10, y: Math.round(Math.random() * 80) + 10 })) });
});

// GET /api/cameras/analytics/:cameraId
router.get('/analytics/:cameraId', (_req, res) => {
  res.json({ cameraId: _req.params.cameraId, peopleInFrame: 5, entering: 142, exiting: 128, trafficLevel: 'Medium', avgDwellMinutes: 8.4, queueCount: 3, uptimePct: 99.5 });
});

// GET /api/cameras/locations
router.get('/locations', (_req, res) => {
  res.json(
    MOCK_CAMERAS.map((c, i) => ({
      cameraId: c.id,
      cameraName: c.name,
      xPct: 18 + i * 16,
      yPct: 35 + (i % 2) * 22,
      status: c.status,
      zoneName: c.zoneName,
      peopleInFrame: c.status === 'ONLINE' ? Math.floor(Math.random() * 5) + 1 : 0,
      trafficLevel: i % 2 === 0 ? 'High' : 'Medium',
    }))
  );
});

// GET /api/cameras/:id
router.get('/:id', (req, res) => {
  const cam = MOCK_CAMERAS.find((c) => c.id === req.params.id);
  res.json(cam || null);
});

// POST /api/cameras
router.post('/', (req, res) => {
  const input = req.body;
  const newCam = { id: `CAM${String(MOCK_CAMERAS.length + 1).padStart(3, '0')}`, organizationId: 'org-001', ...input, uptime: 100, storageUsage: 45, lastSeenAt: 'Just now', aiProcessingStatus: 'ACTIVE', image: '/images/cameras/cam_entrance.png', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  MOCK_CAMERAS.push(newCam);
  res.status(201).json(newCam);
});

// PATCH /api/cameras/:id
router.patch('/:id', (req, res) => {
  const idx = MOCK_CAMERAS.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Camera not found' });
  MOCK_CAMERAS[idx] = { ...MOCK_CAMERAS[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(MOCK_CAMERAS[idx]);
});

// DELETE /api/cameras/:id
router.delete('/:id', (req, res) => {
  const idx = MOCK_CAMERAS.findIndex((c) => c.id === req.params.id);
  if (idx !== -1) MOCK_CAMERAS.splice(idx, 1);
  res.json({ success: true });
});

// POST /api/cameras/:id/restart
router.post('/:id/restart', (req, res) => {
  const cam = MOCK_CAMERAS.find((c) => c.id === req.params.id);
  if (cam) { cam.status = 'ONLINE'; cam.lastSeenAt = 'Just now'; cam.aiProcessingStatus = 'ACTIVE'; }
  res.json(cam || { success: true });
});

// POST /api/cameras/start — start laptop webcam or phone camera
router.post('/start', async (req, res) => {
  const { source = '0', cameraId = 'cam_0' } = req.body || {};
  const result = await aiPost('/camera/start', { source, camera_id: cameraId });
  if (result) {
    return res.json(result);
  }
  res.status(502).json({ ok: false, status: 'ERROR', detail: 'Failed to communicate with AI inference engine' });
});

// POST /api/cameras/stop — stop camera
router.post('/stop', async (req, res) => {
  const { cameraId } = req.body || {};
  const result = await aiPost('/camera/stop', cameraId ? { camera_id: cameraId } : {});
  res.json(result || { ok: true, status: 'STOPPED' });
});

// GET /api/cameras/status/live — query AI camera status
router.get('/status/live', async (_req, res) => {
  const status = await aiGet('/camera/status');
  res.json(status || { status: 'OFFLINE', fps: 0, frame_count: 0 });
});

// GET /api/cameras/stream/live — proxy MJPEG from AI service
router.get('/stream/live', async (req, res) => {
  try {
    const response = await aiStream('/camera/stream');
    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');
    response.data.pipe(res);
  } catch {
    res.status(503).json({ error: 'Camera stream not available' });
  }
});

export default router;
