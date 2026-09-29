import apiClient from './apiClient';
import type {
  PlanogramOverview,
  LiveShelfDetectionData,
  PlanogramComparisonData,
  CategoryComplianceItem,
  ShelfComplianceTrendPoint,
  NonCompliantProductItem,
  PlanogramAIInsight,
} from '../types/planogram';
import {
  PLANOGRAM_OVERVIEW_MOCK,
  LIVE_SHELF_DETECTION_MOCK,
  PLANOGRAM_COMPARISON_MOCK,
  CATEGORY_COMPLIANCE_MOCK,
  SHELF_COMPLIANCE_TREND_MOCK,
  NON_COMPLIANT_ITEMS_MOCK,
  PLANOGRAM_AI_INSIGHTS_MOCK,
} from '../data/planogramMockData';

export const planogramService = {
  /**
   * Retrieves top-level planogram compliance overview.
   * Endpoint: GET /api/planogram/overview
   */
  async getOverview(storeId: string = 'store-001'): Promise<PlanogramOverview> {
    try {
      const response = await apiClient.get<PlanogramOverview>('/planogram/overview', {
        params: { store_id: storeId },
      });
      if (response.data && typeof response.data === 'object' && response.data.overallCompliance) {
        return response.data;
      }
      return PLANOGRAM_OVERVIEW_MOCK;
    } catch {
      return PLANOGRAM_OVERVIEW_MOCK;
    }
  },

  /**
   * Retrieves live shelf detection imagery & status.
   * Endpoint: GET /api/planogram/detection
   */
  async getLiveShelfDetection(storeId: string = 'store-001', aisle?: string): Promise<LiveShelfDetectionData> {
    try {
      const response = await apiClient.get<LiveShelfDetectionData>('/planogram/detection', {
        params: { store_id: storeId, aisle },
      });
      if (response.data && typeof response.data === 'object' && response.data.imageUrl) {
        return response.data;
      }
      return LIVE_SHELF_DETECTION_MOCK;
    } catch {
      return LIVE_SHELF_DETECTION_MOCK;
    }
  },

  /**
   * Retrieves planogram comparison (Expected vs Actual).
   * Endpoint: GET /api/planogram/comparison
   */
  async getComparison(storeId: string = 'store-001'): Promise<PlanogramComparisonData> {
    try {
      const response = await apiClient.get<PlanogramComparisonData>('/planogram/comparison', {
        params: { store_id: storeId },
      });
      if (response.data && typeof response.data === 'object' && response.data.expectedImageUrl) {
        return response.data;
      }
      return PLANOGRAM_COMPARISON_MOCK;
    } catch {
      return PLANOGRAM_COMPARISON_MOCK;
    }
  },

  /**
   * Retrieves compliance percentages by product category.
   * Endpoint: GET /api/planogram/categories
   */
  async getCategoryCompliance(storeId: string = 'store-001'): Promise<CategoryComplianceItem[]> {
    try {
      const response = await apiClient.get<CategoryComplianceItem[]>('/planogram/categories', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return CATEGORY_COMPLIANCE_MOCK;
    } catch {
      return CATEGORY_COMPLIANCE_MOCK;
    }
  },

  /**
   * Retrieves 7-day compliance trend data.
   * Endpoint: GET /api/planogram/trend
   */
  async getComplianceTrend(storeId: string = 'store-001', range: string = '7d'): Promise<ShelfComplianceTrendPoint[]> {
    try {
      const response = await apiClient.get<ShelfComplianceTrendPoint[]>('/planogram/trend', {
        params: { store_id: storeId, range },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return SHELF_COMPLIANCE_TREND_MOCK;
    } catch {
      return SHELF_COMPLIANCE_TREND_MOCK;
    }
  },

  /**
   * Retrieves non-compliant items requiring action.
   * Endpoint: GET /api/planogram/items
   */
  async getNonCompliantItems(storeId: string = 'store-001'): Promise<NonCompliantProductItem[]> {
    try {
      const response = await apiClient.get<NonCompliantProductItem[]>('/planogram/items', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return NON_COMPLIANT_ITEMS_MOCK;
    } catch {
      return NON_COMPLIANT_ITEMS_MOCK;
    }
  },

  /**
   * Retrieves AI-generated insights and shelf placement recommendations.
   * Endpoint: GET /api/planogram/insights
   */
  async getAIInsights(storeId: string = 'store-001'): Promise<PlanogramAIInsight[]> {
    try {
      const response = await apiClient.get<PlanogramAIInsight[]>('/planogram/insights', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return PLANOGRAM_AI_INSIGHTS_MOCK;
    } catch {
      return PLANOGRAM_AI_INSIGHTS_MOCK;
    }
  },

  /**
   * Retrieves planograms catalog for management.
   * Endpoint: GET /api/planograms
   */
  async getPlanograms(params?: { storeId?: string; zoneId?: string; status?: string; search?: string }): Promise<import('../types/planogram').PlanogramItem[]> {
    const { PLANOGRAM_ITEMS_MOCK } = await import('../data/productPlanogramMockData');
    try {
      const response = await apiClient.get<import('../types/planogram').PlanogramItem[]>('/planograms', { params });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return PLANOGRAM_ITEMS_MOCK;
    } catch {
      let filtered = [...PLANOGRAM_ITEMS_MOCK];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
      }
      return filtered;
    }
  },

  /**
   * Retrieves single planogram with shelves and positions.
   * Endpoint: GET /api/planograms/:id
   */
  async getPlanogram(id: string): Promise<import('../types/planogram').PlanogramItem | null> {
    const { PLANOGRAM_ITEMS_MOCK } = await import('../data/productPlanogramMockData');
    try {
      const response = await apiClient.get<import('../types/planogram').PlanogramItem>(`/planograms/${id}`);
      return response.data || null;
    } catch {
      return PLANOGRAM_ITEMS_MOCK.find((p) => p.id === id) || PLANOGRAM_ITEMS_MOCK[0];
    }
  },

  /**
   * Creates a new planogram.
   * Endpoint: POST /api/planograms
   */
  async createPlanogram(data: Partial<import('../types/planogram').PlanogramItem>): Promise<import('../types/planogram').PlanogramItem> {
    const { PLANOGRAM_SHELVES_MOCK } = await import('../data/productPlanogramMockData');
    try {
      const response = await apiClient.post<import('../types/planogram').PlanogramItem>('/planograms', data);
      return response.data;
    } catch {
      const newP: import('../types/planogram').PlanogramItem = {
        id: `plano-${Date.now()}`,
        organizationId: 'org-001',
        storeId: data.storeId || 'store-001',
        zoneId: data.zoneId || 'zone-default',
        name: data.name || 'New Planogram',
        location: data.location || 'Aisle 1',
        description: data.description || '',
        status: data.status || 'Draft',
        shelfCount: data.shelfCount || 4,
        totalSkus: data.totalSkus || 24,
        complianceRate: 100,
        assignedTo: data.assignedTo || 'Store 001 - City Mall',
        thumbnail: '/images/products-planogram/lib_snacks.png',
        shelves: PLANOGRAM_SHELVES_MOCK,
        lastUpdated: 'Just now',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newP;
    }
  },

  /**
   * Updates an existing planogram.
   * Endpoint: PATCH /api/planograms/:id
   */
  async updatePlanogram(id: string, data: Partial<import('../types/planogram').PlanogramItem>): Promise<import('../types/planogram').PlanogramItem> {
    const { PLANOGRAM_ITEMS_MOCK } = await import('../data/productPlanogramMockData');
    try {
      const response = await apiClient.patch<import('../types/planogram').PlanogramItem>(`/planograms/${id}`, data);
      return response.data;
    } catch {
      const existing = PLANOGRAM_ITEMS_MOCK.find((p) => p.id === id) || PLANOGRAM_ITEMS_MOCK[0];
      return { ...existing, ...data, updatedAt: new Date().toISOString() };
    }
  },

  /**
   * Deletes a planogram.
   * Endpoint: DELETE /api/planograms/:id
   */
  async deletePlanogram(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/planograms/${id}`);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Duplicates a planogram.
   * Endpoint: POST /api/planograms/:id/duplicate
   */
  async duplicatePlanogram(id: string): Promise<import('../types/planogram').PlanogramItem> {
    const { PLANOGRAM_ITEMS_MOCK } = await import('../data/productPlanogramMockData');
    try {
      const response = await apiClient.post<import('../types/planogram').PlanogramItem>(`/planograms/${id}/duplicate`);
      return response.data;
    } catch {
      const existing = PLANOGRAM_ITEMS_MOCK.find((p) => p.id === id) || PLANOGRAM_ITEMS_MOCK[0];
      return {
        ...existing,
        id: `plano-${Date.now()}`,
        name: `${existing.name} (Copy)`,
        status: 'Draft',
        updatedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Assigns planogram to store.
   * Endpoint: POST /api/planograms/:id/assign
   */
  async assignPlanogram(id: string, storeId: string): Promise<boolean> {
    try {
      await apiClient.post(`/planograms/${id}/assign`, { storeId });
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Retrieves compliance metrics for a specific planogram.
   * Endpoint: GET /api/planograms/:id/compliance
   */
  async getPlanogramCompliance(_id: string): Promise<import('../types/planogram').PlanogramComplianceSummary> {
    const { PLANOGRAM_COMPLIANCE_MOCK } = await import('../data/productPlanogramMockData');
    try {
      const response = await apiClient.get<import('../types/planogram').PlanogramComplianceSummary>(`/planograms/${_id}/compliance`);
      return response.data || PLANOGRAM_COMPLIANCE_MOCK;
    } catch {
      return PLANOGRAM_COMPLIANCE_MOCK;
    }
  },

  /**
   * Retrieves products placed in this planogram.
   * Endpoint: GET /api/planograms/:id/products
   */
  async getPlanogramProducts(id: string) {
    try {
      const response = await apiClient.get(`/planograms/${id}/products`);
      return response.data;
    } catch {
      const { INITIAL_PRODUCTS } = await import('../data/productPlanogramMockData');
      return INITIAL_PRODUCTS.filter((p) => p.planogramId === id);
    }
  },

  /**
   * Updates a position within a planogram shelf.
   * Endpoint: PATCH /api/planograms/:id/positions
   */
  async updatePlanogramPosition(id: string, positionId: string, data: any) {
    try {
      const response = await apiClient.patch(`/planograms/${id}/positions`, { positionId, ...data });
      return response.data;
    } catch {
      return { success: true };
    }
  },
};

export default planogramService;

