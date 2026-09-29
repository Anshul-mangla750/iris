/**
 * Settings routes.
 */
import { Router } from 'express';
import { aiGet, aiPost } from '../services/aiService.js';

const router = Router();

const SETTINGS_DATA = {
  general: { storeName: 'RetailEdge AI', timezone: 'Asia/Kolkata', currency: 'INR', language: 'English', dateFormat: 'DD/MM/YYYY' },
  notifications: { emailAlerts: true, pushAlerts: true, smsAlerts: false, alertDigest: 'hourly', criticalAlertsOnly: false, quietHoursStart: '22:00', quietHoursEnd: '06:00' },
  ai: { personDetectionEnabled: true, productDetectionEnabled: true, queueMonitoringEnabled: true, privacyBlurEnabled: true, inferenceDevice: 'CPU', confidenceThreshold: 0.5, autoTrainQueue: true },
  privacy: { blurFaces: true, retentionDays: 30, anonymizeTracking: true, gdprCompliant: true },
  system: { autoBackup: true, backupFrequency: 'daily', logLevel: 'INFO', maintenanceMode: false, edgeBufferEnabled: true },
};

// GET /api/settings
router.get('/', async (_req, res) => {
  // Try to get AI service config
  const aiConfig = await aiGet('/config');
  if (aiConfig) {
    SETTINGS_DATA.ai.personDetectionEnabled = true;
    SETTINGS_DATA.ai.productDetectionEnabled = aiConfig.product_enabled !== false;
    SETTINGS_DATA.ai.queueMonitoringEnabled = aiConfig.queue_enabled !== false;
    SETTINGS_DATA.ai.privacyBlurEnabled = aiConfig.privacy_blur_faces !== false;
    SETTINGS_DATA.ai.confidenceThreshold = aiConfig.detection_confidence || 0.5;
  }
  res.json(SETTINGS_DATA);
});

// GET /api/settings/general
router.get('/general', (_req, res) => res.json(SETTINGS_DATA.general));
// GET /api/settings/notifications
router.get('/notifications', (_req, res) => res.json(SETTINGS_DATA.notifications));
// GET /api/settings/ai
router.get('/ai', async (_req, res) => {
  const aiConfig = await aiGet('/config');
  const aiModels = await aiGet('/models/status');
  res.json({ ...SETTINGS_DATA.ai, aiServiceConnected: !!aiConfig, models: aiModels || [] });
});
// GET /api/settings/privacy
router.get('/privacy', (_req, res) => res.json(SETTINGS_DATA.privacy));
// GET /api/settings/system
router.get('/system', async (_req, res) => {
  const aiHealth = await aiGet('/health');
  const edgeStats = await aiGet('/edge/stats');
  res.json({ ...SETTINGS_DATA.system, aiServiceStatus: aiHealth ? 'connected' : 'disconnected', edgeBuffer: edgeStats || { total: 0, pending_sync: 0 } });
});

// PATCH /api/settings/:section
router.patch('/:section', (req, res) => {
  const section = req.params.section;
  if (SETTINGS_DATA[section]) {
    SETTINGS_DATA[section] = { ...SETTINGS_DATA[section], ...req.body };
    // If AI settings changed, forward to AI service
    if (section === 'ai' || section === 'privacy') {
      aiPost('/config', { privacy_blur_faces: SETTINGS_DATA.privacy.blurFaces, detection_confidence: SETTINGS_DATA.ai.confidenceThreshold }).catch(() => {});
    }
  }
  res.json({ success: true, data: SETTINGS_DATA[section] || {} });
});

export default router;
