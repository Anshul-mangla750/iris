import type {
  SystemStatus,
  GeneralSettings,
  StoreSettings,
  NotificationPreference,
  SecuritySettings,
  IntegrationSetting,
  SystemMaintenance,
  AISettings,
  PlatformSettings,
} from '../types/settings';

export const SYSTEM_STATUS_MOCK: SystemStatus = {
  systemHealth: 'HEALTHY',
  dataSync: 'UP_TO_DATE',
  lastSyncTimestamp: '24 Sep 2024, 03:20 PM',
  security: 'PROTECTED',
  twoFactorEnabled: true,
  storageUsedPercent: 62,
  storageUsedGB: 12.4,
  storageTotalGB: 20,
};

export const GENERAL_SETTINGS_MOCK: GeneralSettings = {
  organizationName: 'RetailEdge AI',
  timezone: 'Asia/Kolkata (GMT+5:30)',
  dateFormat: 'DD MMM YYYY (24 Sep 2024)',
  currency: 'INR (₹) - Indian Rupee',
  language: 'English',
};

export const STORE_SETTINGS_MOCK: StoreSettings = {
  defaultStoreId: 'Store 001 - City Mall, Delhi',
  operatingHours: {
    open: '09:00 AM',
    close: '10:00 PM',
  },
  defaultPlanogramId: 'Snacks - Standard',
  autoStockAlertThreshold: 10,
  queueAlertThreshold: 10,
};

export const NOTIFICATION_SETTINGS_MOCK: Record<
  'inventory' | 'queue' | 'planogram' | 'system' | 'dailyReports',
  NotificationPreference
> = {
  inventory: {
    enabled: true,
    channels: { email: true, sms: true, inApp: true },
  },
  queue: {
    enabled: true,
    channels: { email: true, sms: true, inApp: true },
  },
  planogram: {
    enabled: true,
    channels: { email: true, sms: true, inApp: true },
  },
  system: {
    enabled: true,
    channels: { email: true, sms: true, inApp: true },
  },
  dailyReports: {
    enabled: true,
    channels: { email: true, sms: true, inApp: true },
  },
};

export const SECURITY_SETTINGS_MOCK: SecuritySettings = {
  twoFactorEnabled: true,
  sessionTimeoutMinutes: 30,
  auditLoggingEnabled: true,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expirationDays: 90,
  },
  allowedIps: ['192.168.1.100', '10.0.0.1/24', '115.110.23.45', '122.161.44.12'],
};

export const INTEGRATION_SETTINGS_MOCK: IntegrationSetting[] = [
  {
    id: 'int-pos-easypos',
    name: 'POS - EasyPOS',
    provider: 'EasyPOS',
    category: 'POS',
    status: 'CONNECTED',
    lastSyncAt: '24 Sep 2024, 03:18 PM',
    configured: true,
    baseUrl: 'https://api.easypos.retail.net/v2',
    apiKeyMasked: 'pos_live_****************9a2f',
  },
  {
    id: 'int-erp-sap',
    name: 'ERP - SAP',
    provider: 'SAP S/4HANA',
    category: 'ERP',
    status: 'CONNECTED',
    lastSyncAt: '24 Sep 2024, 03:15 PM',
    configured: true,
    baseUrl: 'https://sap-gateway.retailedge.internal/odata',
    apiKeyMasked: 'sap_oauth_****************c41b',
  },
  {
    id: 'int-erp-tally',
    name: 'ERP - Tally',
    provider: 'Tally Prime Server',
    category: 'ERP',
    status: 'CONNECTED',
    lastSyncAt: '24 Sep 2024, 03:10 PM',
    configured: true,
    baseUrl: 'http://192.168.1.55:9000/xml',
    apiKeyMasked: 'tally_srv_****************884d',
  },
  {
    id: 'int-inventory-api',
    name: 'Inventory API',
    provider: 'RetailEdge Inventory Gateway',
    category: 'INVENTORY',
    status: 'CONNECTED',
    lastSyncAt: '24 Sep 2024, 03:20 PM',
    configured: true,
    baseUrl: 'https://api.retailedge.ai/v1/inventory',
    apiKeyMasked: 'inv_key_****************03ef',
  },
  {
    id: 'int-weather-imd',
    name: 'Weather API (IMD)',
    provider: 'India Meteorological Dept',
    category: 'WEATHER',
    status: 'CONNECTED',
    lastSyncAt: '24 Sep 2024, 03:00 PM',
    configured: true,
    baseUrl: 'https://mausam.imd.gov.in/api/v1/city',
    apiKeyMasked: 'imd_token_****************7710',
  },
  {
    id: 'int-map-osrm',
    name: 'Map API (OSRM)',
    provider: 'Open Source Routing Machine',
    category: 'MAP',
    status: 'CONNECTED',
    lastSyncAt: '24 Sep 2024, 02:45 PM',
    configured: true,
    baseUrl: 'https://router.project-osrm.org',
    apiKeyMasked: 'osrm_free_tier_no_key',
  },
  {
    id: 'int-email-smtp',
    name: 'Email Service (SMTP)',
    provider: 'Amazon SES / Custom SMTP',
    category: 'EMAIL',
    status: 'CONNECTED',
    lastSyncAt: '24 Sep 2024, 03:12 PM',
    configured: true,
    smtpHost: 'email-smtp.ap-south-1.amazonaws.com',
    smtpPort: 587,
    smtpUser: 'AKIAIOSFODNN7EXAMPLE',
  },
  {
    id: 'int-sms-service',
    name: 'SMS Service',
    provider: 'Twilio / Gupshup SMS',
    category: 'SMS',
    status: 'NOT_CONNECTED',
    lastSyncAt: undefined,
    configured: false,
    baseUrl: 'https://api.gupshup.io/sm/api/v1',
    apiKeyMasked: '',
  },
  {
    id: 'int-whatsapp-business',
    name: 'WhatsApp Business',
    provider: 'Meta Cloud API',
    category: 'WHATSAPP',
    status: 'NOT_CONNECTED',
    lastSyncAt: undefined,
    configured: false,
    whatsappAccountId: '',
    whatsappPhoneId: '',
  },
];

export const SYSTEM_MAINTENANCE_MOCK: SystemMaintenance = {
  softwareVersion: 'v2.4.1',
  versionStatus: 'UP_TO_DATE',
  lastBackupAt: '24 Sep 2024, 02:00 AM',
  databaseSizeGB: 12.4,
  cacheSizeMB: 480,
};

export const AI_SETTINGS_MOCK: AISettings = {
  processingMode: 'Edge',
  privacyMode: true,
  dataRetentionDays: 30,
  confidenceThreshold: 80,
  features: {
    shopperAnalytics: true,
    queuePrediction: true,
    inventoryDetection: true,
    planogramDetection: true,
    aiInsights: true,
  },
};

export const DEFAULT_PLATFORM_SETTINGS_MOCK: PlatformSettings = {
  general: GENERAL_SETTINGS_MOCK,
  store: STORE_SETTINGS_MOCK,
  notifications: NOTIFICATION_SETTINGS_MOCK,
  security: SECURITY_SETTINGS_MOCK,
  integrations: INTEGRATION_SETTINGS_MOCK,
  maintenance: SYSTEM_MAINTENANCE_MOCK,
  systemStatus: SYSTEM_STATUS_MOCK,
  ai: AI_SETTINGS_MOCK,
};
