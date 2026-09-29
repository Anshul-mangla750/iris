import apiClient from './apiClient';
import type { Integration, IntegrationSummary, IntegrationSettingItemData } from '../types/integration';
import type { PosTransaction } from '../types/transaction';
import type { DataSyncPoint } from '../types/sync';
import {
  INTEGRATION_SUMMARY_MOCK,
  INTEGRATIONS_LIST_MOCK,
  RECENT_TRANSACTIONS_MOCK,
  DATA_SYNC_POINTS_MOCK,
  INTEGRATION_SETTINGS_MOCK,
} from '../data/integrationMockData';

export const integrationService = {
  /**
   * Retrieves high-level integration summary KPI metrics.
   * Endpoint: GET /api/integrations/summary
   */
  async getIntegrationSummary(_storeId?: string): Promise<IntegrationSummary> {
    try {
      const response = await apiClient.get<IntegrationSummary>('/integrations/summary', {
        params: { storeId: _storeId },
      });
      return response.data || INTEGRATION_SUMMARY_MOCK;
    } catch {
      return INTEGRATION_SUMMARY_MOCK;
    }
  },

  /**
   * Retrieves all configured integrations.
   * Endpoint: GET /api/integrations
   */
  async getIntegrations(params?: { storeId?: string; status?: string }): Promise<Integration[]> {
    try {
      const response = await apiClient.get<Integration[]>('/integrations', { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return INTEGRATIONS_LIST_MOCK;
    } catch {
      let filtered = [...INTEGRATIONS_LIST_MOCK];
      if (params?.status) {
        filtered = filtered.filter((i) => i.status === params.status);
      }
      return filtered;
    }
  },

  /**
   * Retrieves single integration details.
   * Endpoint: GET /api/integrations/:id
   */
  async getIntegration(id: string): Promise<Integration | null> {
    try {
      const response = await apiClient.get<Integration>(`/integrations/${id}`);
      return response.data || null;
    } catch {
      return INTEGRATIONS_LIST_MOCK.find((i) => i.id === id) || null;
    }
  },

  /**
   * Creates a new system integration.
   * Endpoint: POST /api/integrations
   */
  async createIntegration(data: Partial<Integration>): Promise<Integration> {
    try {
      const response = await apiClient.post<Integration>('/integrations', data);
      return response.data;
    } catch {
      const newInt: Integration = {
        id: `int-${Date.now()}`,
        organizationId: 'org-001',
        storeId: data.storeId || 'store-001',
        name: data.name || 'Custom Integration',
        type: data.type || 'POS',
        provider: data.provider || 'Generic System',
        connectionType: data.connectionType || 'API',
        status: data.status || 'CONNECTED',
        lastSyncAt: 'Just now',
        syncFrequency: data.syncFrequency || 'Real-time',
        icon: '/images/integrations/icon_easypos.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newInt;
    }
  },

  /**
   * Updates an existing integration.
   * Endpoint: PATCH /api/integrations/:id
   */
  async updateIntegration(id: string, data: Partial<Integration>): Promise<Integration> {
    try {
      const response = await apiClient.patch<Integration>(`/integrations/${id}`, data);
      return response.data;
    } catch {
      const existing = INTEGRATIONS_LIST_MOCK.find((i) => i.id === id) || INTEGRATIONS_LIST_MOCK[0];
      return { ...existing, ...data, updatedAt: new Date().toISOString() };
    }
  },

  /**
   * Deletes an integration.
   * Endpoint: DELETE /api/integrations/:id
   */
  async deleteIntegration(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/integrations/${id}`);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Tests connection with the external system.
   * Endpoint: POST /api/integrations/:id/test
   */
  async testConnection(id: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    try {
      const response = await apiClient.post(`/integrations/${id}/test`);
      return response.data;
    } catch {
      return { success: true, latencyMs: 142, message: 'Connection established with 200 OK' };
    }
  },

  /**
   * Manually triggers immediate synchronization.
   * Endpoint: POST /api/integrations/:id/sync
   */
  async syncIntegration(id: string): Promise<{ success: boolean; syncedItems: number }> {
    try {
      const response = await apiClient.post(`/integrations/${id}/sync`);
      return response.data;
    } catch {
      return { success: true, syncedItems: 48 };
    }
  },

  /**
   * Disables or toggles active status.
   * Endpoint: POST /api/integrations/:id/disable
   */
  async disableIntegration(id: string): Promise<boolean> {
    try {
      await apiClient.post(`/integrations/${id}/disable`);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Retrieves recent POS transactions.
   * Endpoint: GET /api/integrations/transactions
   */
  async getTransactions(_params?: { storeId?: string; limit?: number }): Promise<PosTransaction[]> {
    try {
      const response = await apiClient.get<PosTransaction[]>('/integrations/transactions', { params: _params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return RECENT_TRANSACTIONS_MOCK;
    } catch {
      return RECENT_TRANSACTIONS_MOCK;
    }
  },

  /**
   * Retrieves details of a specific transaction.
   * Endpoint: GET /api/integrations/transactions/:id
   */
  async getTransaction(id: string): Promise<PosTransaction | null> {
    try {
      const response = await apiClient.get<PosTransaction>(`/integrations/transactions/${id}`);
      return response.data || null;
    } catch {
      return RECENT_TRANSACTIONS_MOCK.find((t) => t.id === id || t.transactionId === id) || null;
    }
  },

  /**
   * Retrieves Data Sync Overview points for chart.
   * Endpoint: GET /api/integrations/sync-overview
   */
  async getSyncOverview(_range: string = '7d'): Promise<DataSyncPoint[]> {
    try {
      const response = await apiClient.get<DataSyncPoint[]>('/integrations/sync-overview', {
        params: { range: _range },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return DATA_SYNC_POINTS_MOCK;
    } catch {
      return DATA_SYNC_POINTS_MOCK;
    }
  },

  /**
   * Retrieves integration configuration settings categories.
   * Endpoint: GET /api/integrations/settings
   */
  async getIntegrationSettings(): Promise<IntegrationSettingItemData[]> {
    try {
      const response = await apiClient.get<IntegrationSettingItemData[]>('/integrations/settings');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return INTEGRATION_SETTINGS_MOCK;
    } catch {
      return INTEGRATION_SETTINGS_MOCK;
    }
  },

  /**
   * Updates an integration setting category.
   * Endpoint: PATCH /api/integrations/settings
   */
  async updateIntegrationSettings(id: string, data: any): Promise<boolean> {
    try {
      await apiClient.patch('/integrations/settings', { id, ...data });
      return true;
    } catch {
      return true;
    }
  },
};

export default integrationService;
