export type IntegrationType =
  | 'POS'
  | 'ERP'
  | 'INVENTORY_API'
  | 'HR_STAFF'
  | 'SUPPLIER_PORTAL'
  | 'CUSTOM_API';

export type IntegrationConnectionType = 'API' | 'WEBHOOK' | 'SCHEDULED';

export type IntegrationStatusType =
  | 'CONNECTED'
  | 'NOT_CONNECTED'
  | 'ERROR'
  | 'SYNCING'
  | 'DISABLED';

export interface Integration {
  id: string;
  organizationId: string;
  storeId: string;
  name: string;
  type: IntegrationType;
  provider: string;
  connectionType: IntegrationConnectionType;
  status: IntegrationStatusType;
  lastSyncAt?: string;
  syncFrequency: string; // "Real-time" | "Every 15 min" | "Every 30 min" | "Manual" | "Daily"
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IntegrationSummary {
  totalTransactions: number;
  totalSales: number;
  itemsSynced: number;
  syncSuccessRate: number;
  syncErrors: number;
  trends: {
    totalTransactions: number;
    totalSales: number;
    itemsSynced: number;
    syncSuccessRate: number;
    syncErrors: number;
  };
}

export interface IntegrationSettingItemData {
  id: string;
  title: string;
  description: string;
  iconName: 'key' | 'workflow' | 'clock' | 'alert' | 'link';
  iconColor: string;
  iconBg: string;
}
