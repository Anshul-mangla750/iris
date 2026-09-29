import apiClient from './apiClient';
import type { DashboardOverviewData } from '../types/dashboard';
import { DEFAULT_DASHBOARD_OVERVIEW, STORE_OPTIONS } from '../data/dashboardMockData';

export const dashboardService = {
  /**
   * Retrieves complete dashboard overview data.
   * Endpoint: GET /api/analytics/overview
   */
  async getOverview(storeId: string = 'store-001'): Promise<DashboardOverviewData> {
    try {
      const response = await apiClient.get<DashboardOverviewData>('/analytics/overview', {
        params: { store_id: storeId },
      });
      if (response.data && typeof response.data === 'object' && response.data.greeting && response.data.kpis) {
        return response.data;
      }
      throw new Error('API returned non-JSON or fallback HTML');
    } catch {
      // Return centralized mock presentation data when backend analytics is pending
      const store = STORE_OPTIONS.find((s) => s.id === storeId) || STORE_OPTIONS[0];
      return {
        ...DEFAULT_DASHBOARD_OVERVIEW,
        store,
      };
    }
  },

  /**
   * Retrieves available stores list.
   * Endpoint: GET /api/stores
   */
  async getStores() {
    try {
      const response = await apiClient.get('/stores');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return STORE_OPTIONS;
    } catch {
      return STORE_OPTIONS;
    }
  },
};

export default dashboardService;
