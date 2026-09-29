import apiClient from './apiClient';
import type {
  Alert,
  AlertSummary,
  AlertFilters,
  AlertTrendPoint,
  AlertCategoryItem,
  AlertStatusItem,
} from '../types/alert';
import {
  ALERT_SUMMARY,
  ALERT_TREND_DATA,
  ALERT_CATEGORIES_DATA,
  ALERT_STATUS_DATA,
  MOCK_ALERTS,
} from '../data/alertMockData';

export const alertService = {
  /**
   * Fetch alerts list with optional filtering
   */
  async getAlerts(filters?: Partial<AlertFilters>): Promise<{
    alerts: Alert[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get('/alerts', { params: filters });
      if (response.data && Array.isArray(response.data.alerts)) {
        return response.data;
      }
      if (Array.isArray(response.data)) {
        return {
          alerts: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          totalPages: 1,
        };
      }
      return {
        alerts: MOCK_ALERTS,
        total: MOCK_ALERTS.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
    } catch {
      // In-memory filter on mock data
      let filtered = [...MOCK_ALERTS];
      if (filters?.severity && filters.severity.length > 0) {
        filtered = filtered.filter((a) => filters.severity!.includes(a.severity));
      }
      if (filters?.category && filters.category.length > 0) {
        filtered = filtered.filter((a) => filters.category!.includes(a.sourceModule));
      }
      if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter((a) => filters.status!.includes(a.status));
      }
      if (filters?.storeId && filters.storeId !== 'all' && filters.storeId !== 'All Stores') {
        filtered = filtered.filter(
          (a) => a.storeId === filters.storeId || a.storeName.includes(filters.storeId!)
        );
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.message.toLowerCase().includes(q) ||
            a.product?.toLowerCase().includes(q) ||
            a.location?.toLowerCase().includes(q)
        );
      }
      return {
        alerts: filtered,
        total: filtered.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(filtered.length / 10) || 1,
      };
    }
  },

  /**
   * Fetch single alert details by ID
   */
  async getAlert(id: string): Promise<Alert | null> {
    try {
      const response = await apiClient.get(`/alerts/${id}`);
      return response.data;
    } catch {
      const match = MOCK_ALERTS.find((a) => a.id === id);
      return match || MOCK_ALERTS[0] || null;
    }
  },

  /**
   * Fetch KPI summary statistics
   */
  async getAlertSummary(_storeId?: string): Promise<AlertSummary> {
    try {
      const response = await apiClient.get('/alerts/summary');
      if (response.data && typeof response.data.total === 'number') {
        return response.data;
      }
      return ALERT_SUMMARY;
    } catch {
      return ALERT_SUMMARY;
    }
  },

  /**
   * Fetch Alert Trends
   */
  async getAlertTrends(_range: string = '24h'): Promise<AlertTrendPoint[]> {
    try {
      const response = await apiClient.get('/alerts/trends');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.trends)) {
        return response.data.trends;
      }
      return ALERT_TREND_DATA;
    } catch {
      return ALERT_TREND_DATA;
    }
  },

  /**
   * Fetch Categories breakdown
   */
  async getAlertCategories(): Promise<AlertCategoryItem[]> {
    try {
      const response = await apiClient.get('/alerts/categories');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
      return ALERT_CATEGORIES_DATA;
    } catch {
      return ALERT_CATEGORIES_DATA;
    }
  },

  /**
   * Fetch Status breakdown
   */
  async getAlertStatusBreakdown(): Promise<AlertStatusItem[]> {
    try {
      const response = await apiClient.get('/alerts/status-breakdown');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.statusBreakdown)) {
        return response.data.statusBreakdown;
      }
      return ALERT_STATUS_DATA;
    } catch {
      return ALERT_STATUS_DATA;
    }
  },

  /**
   * Transition alert status to ACKNOWLEDGED (In Progress)
   */
  async acknowledgeAlert(alertId: string): Promise<{ success: boolean; alert?: Alert }> {
    try {
      const response = await apiClient.patch(`/alerts/${alertId}/acknowledge`);
      return { success: true, alert: response.data };
    } catch {
      return { success: true };
    }
  },

  /**
   * Transition alert status to RESOLVED
   */
  async resolveAlert(alertId: string): Promise<{ success: boolean; alert?: Alert }> {
    try {
      const response = await apiClient.patch(`/alerts/${alertId}/resolve`);
      return { success: true, alert: response.data };
    } catch {
      return { success: true };
    }
  },

  /**
   * Assign alert to staff member
   */
  async assignAlert(alertId: string, staffName: string): Promise<{ success: boolean; assignedTo: string }> {
    try {
      const response = await apiClient.patch(`/alerts/${alertId}/assign`, { assignedTo: staffName });
      return { success: true, assignedTo: response.data.assignedTo || staffName };
    } catch {
      return { success: true, assignedTo: staffName };
    }
  },

  /**
   * Mark all alerts as read (does not alter resolution status)
   */
  async markAllAlertsRead(): Promise<{ success: boolean; markedCount: number }> {
    try {
      const response = await apiClient.post('/alerts/mark-all-read');
      return response.data;
    } catch {
      return { success: true, markedCount: 12 };
    }
  },
};

export default alertService;
