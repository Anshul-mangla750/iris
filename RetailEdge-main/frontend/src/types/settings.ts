export type SystemHealthStatus = 'HEALTHY' | 'WARNING' | 'ERROR';
export type DataSyncStatus = 'UP_TO_DATE' | 'SYNCING' | 'ERROR';
export type SecurityStatus = 'PROTECTED' | 'WARNING';
export type IntegrationStatus = 'CONNECTED' | 'NOT_CONNECTED' | 'ERROR';

export interface NotificationPreference {
  enabled: boolean;
  channels: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    push?: boolean;
  };
}

export interface SystemStatus {
  systemHealth: SystemHealthStatus;
  dataSync: DataSyncStatus;
  lastSyncTimestamp: string;
  security: SecurityStatus;
  twoFactorEnabled: boolean;
  storageUsedPercent: number;
  storageUsedGB: number;
  storageTotalGB: number;
}

export interface GeneralSettings {
  organizationName: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
}

export interface StoreSettings {
  defaultStoreId: string;
  operatingHours: {
    open: string;
    close: string;
  };
  defaultPlanogramId: string;
  autoStockAlertThreshold: number;
  queueAlertThreshold: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays: number;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  auditLoggingEnabled: boolean;
  passwordPolicy: PasswordPolicy;
  allowedIps: string[];
}

export interface IntegrationSetting {
  id: string;
  name: string;
  provider: string;
  category: 'POS' | 'ERP' | 'INVENTORY' | 'WEATHER' | 'MAP' | 'EMAIL' | 'SMS' | 'WHATSAPP';
  status: IntegrationStatus;
  lastSyncAt?: string;
  configured: boolean;
  baseUrl?: string;
  apiKeyMasked?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  whatsappAccountId?: string;
  whatsappPhoneId?: string;
}

export interface SystemMaintenance {
  softwareVersion: string;
  versionStatus: 'UP_TO_DATE' | 'UPDATE_AVAILABLE';
  lastBackupAt: string;
  databaseSizeGB: number;
  cacheSizeMB: number;
}

export interface AISettings {
  processingMode: 'Edge' | 'Cloud' | 'Hybrid';
  privacyMode: boolean;
  dataRetentionDays: number;
  confidenceThreshold: number;
  features: {
    shopperAnalytics: boolean;
    queuePrediction: boolean;
    inventoryDetection: boolean;
    planogramDetection: boolean;
    aiInsights: boolean;
  };
}

export interface PlatformSettings {
  general: GeneralSettings;
  store: StoreSettings;
  notifications: {
    inventory: NotificationPreference;
    queue: NotificationPreference;
    planogram: NotificationPreference;
    system: NotificationPreference;
    dailyReports: NotificationPreference;
  };
  security: SecuritySettings;
  integrations: IntegrationSetting[];
  maintenance: SystemMaintenance;
  systemStatus: SystemStatus;
  ai: AISettings;
}
