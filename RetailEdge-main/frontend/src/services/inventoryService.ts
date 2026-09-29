import apiClient from './apiClient';
import type {
  InventoryOverview,
  InventoryStatusSegment,
  StockTrendPoint,
  CategoryStockStatus,
  ShelfViewData,
  ShelfHealthAnalysisData,
  LowStockProductItem,
  InventoryEventItem,
} from '../types/inventory';
import {
  INVENTORY_OVERVIEW_MOCK,
  INVENTORY_STATUS_DISTRIBUTION_MOCK,
  STOCK_TREND_MOCK,
  CATEGORY_STOCK_STATUS_MOCK,
  SHELF_VIEW_MOCK,
  SHELF_HEALTH_MOCK,
  LOW_STOCK_PRODUCTS_MOCK,
  INVENTORY_EVENTS_MOCK,
} from '../data/inventoryMockData';

export const inventoryService = {
  /**
   * Retrieves aggregated inventory overview metrics.
   * Endpoint: GET /api/inventory/overview
   */
  async getInventoryOverview(storeId: string = 'store-001'): Promise<InventoryOverview> {
    try {
      const response = await apiClient.get<InventoryOverview>('/inventory/overview', {
        params: { store_id: storeId },
      });
      if (response.data && typeof response.data === 'object' && response.data.totalProducts) {
        return response.data;
      }
      return INVENTORY_OVERVIEW_MOCK;
    } catch {
      return INVENTORY_OVERVIEW_MOCK;
    }
  },

  /**
   * Retrieves stock status distribution breakdown.
   * Endpoint: GET /api/inventory/status-distribution
   */
  async getStatusDistribution(storeId: string = 'store-001'): Promise<InventoryStatusSegment[]> {
    try {
      const response = await apiClient.get<InventoryStatusSegment[]>('/inventory/status-distribution', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return INVENTORY_STATUS_DISTRIBUTION_MOCK;
    } catch {
      return INVENTORY_STATUS_DISTRIBUTION_MOCK;
    }
  },

  /**
   * Retrieves stock trend time series.
   * Endpoint: GET /api/inventory/trend
   */
  async getStockTrend(storeId: string = 'store-001', range: string = '7d'): Promise<StockTrendPoint[]> {
    try {
      const response = await apiClient.get<StockTrendPoint[]>('/inventory/trend', {
        params: { store_id: storeId, range },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return STOCK_TREND_MOCK;
    } catch {
      return STOCK_TREND_MOCK;
    }
  },

  /**
   * Retrieves category-wise stock status percentages.
   * Endpoint: GET /api/inventory/category-status
   */
  async getCategoryStatus(storeId: string = 'store-001'): Promise<CategoryStockStatus[]> {
    try {
      const response = await apiClient.get<CategoryStockStatus[]>('/inventory/category-status', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return CATEGORY_STOCK_STATUS_MOCK;
    } catch {
      return CATEGORY_STOCK_STATUS_MOCK;
    }
  },

  /**
   * Retrieves current live shelf camera view with AI detections.
   * Endpoint: GET /api/inventory/shelves/live
   */
  async getLiveShelf(storeId: string = 'store-001', aisleId?: string): Promise<ShelfViewData> {
    try {
      const response = await apiClient.get<ShelfViewData>('/inventory/shelves/live', {
        params: { store_id: storeId, aisle: aisleId },
      });
      if (response.data && typeof response.data === 'object' && response.data.imageUrl) {
        return response.data;
      }
      return SHELF_VIEW_MOCK;
    } catch {
      return SHELF_VIEW_MOCK;
    }
  },

  /**
   * Retrieves shelf health AI analysis data.
   * Endpoint: GET /api/inventory/shelves/health
   */
  async getShelfHealth(storeId: string = 'store-001'): Promise<ShelfHealthAnalysisData> {
    try {
      const response = await apiClient.get<ShelfHealthAnalysisData>('/inventory/shelves/health', {
        params: { store_id: storeId },
      });
      if (response.data && typeof response.data === 'object' && response.data.imageUrl) {
        return response.data;
      }
      return SHELF_HEALTH_MOCK;
    } catch {
      return SHELF_HEALTH_MOCK;
    }
  },

  /**
   * Retrieves low stock and out-of-stock items list.
   * Endpoint: GET /api/inventory/items/low-stock
   */
  async getLowStockItems(storeId: string = 'store-001'): Promise<LowStockProductItem[]> {
    try {
      const response = await apiClient.get<LowStockProductItem[]>('/inventory/items/low-stock', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return LOW_STOCK_PRODUCTS_MOCK;
    } catch {
      return LOW_STOCK_PRODUCTS_MOCK;
    }
  },

  /**
   * Retrieves recent inventory detection and restock events.
   * Endpoint: GET /api/inventory/events
   */
  async getRecentEvents(storeId: string = 'store-001'): Promise<InventoryEventItem[]> {
    try {
      const response = await apiClient.get<InventoryEventItem[]>('/inventory/events', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return INVENTORY_EVENTS_MOCK;
    } catch {
      return INVENTORY_EVENTS_MOCK;
    }
  },
};

export default inventoryService;
