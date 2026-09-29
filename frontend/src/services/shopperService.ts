import apiClient from './apiClient';
import type {
  ShopperOverviewData,
  ShopperFootfallPoint,
  ZoneTrafficItem,
  DwellTimeBucket,
  TimeRangeFilter,
} from '../types/shopper';
import {
  DEFAULT_SHOPPER_OVERVIEW,
  SHOPPER_FOOTFALL_TREND,
  TRAFFIC_BY_ZONE,
  DWELL_TIME_DISTRIBUTION,
} from '../data/shopperMockData';

export const shopperService = {
  /**
   * Retrieves complete aggregated shopper analytics overview.
   * Endpoint: GET /api/shopper/overview
   */
  async getShopperOverview(
    storeId: string = 'store-001',
    timeRange: TimeRangeFilter = 'today'
  ): Promise<ShopperOverviewData> {
    try {
      const response = await apiClient.get<ShopperOverviewData>('/shopper/overview', {
        params: { store_id: storeId, range: timeRange },
      });
      if (
        response.data &&
        typeof response.data === 'object' &&
        Array.isArray(response.data.kpis)
      ) {
        return response.data;
      }
      throw new Error('API returned invalid shopper overview response');
    } catch {
      return {
        ...DEFAULT_SHOPPER_OVERVIEW,
        storeId,
        timeRange,
      };
    }
  },

  /**
   * Retrieves footfall trend points.
   * Endpoint: GET /api/shopper/footfall
   */
  async getFootfallAnalytics(
    storeId: string = 'store-001',
    timeRange: TimeRangeFilter = 'today'
  ): Promise<ShopperFootfallPoint[]> {
    try {
      const response = await apiClient.get<ShopperFootfallPoint[]>('/shopper/footfall', {
        params: { store_id: storeId, range: timeRange },
      });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return SHOPPER_FOOTFALL_TREND;
    } catch {
      return SHOPPER_FOOTFALL_TREND;
    }
  },

  /**
   * Retrieves zone traffic metrics.
   * Endpoint: GET /api/shopper/zones
   */
  async getZoneAnalytics(storeId: string = 'store-001'): Promise<ZoneTrafficItem[]> {
    try {
      const response = await apiClient.get<ZoneTrafficItem[]>('/shopper/zones', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return TRAFFIC_BY_ZONE;
    } catch {
      return TRAFFIC_BY_ZONE;
    }
  },

  /**
   * Retrieves dwell time distribution.
   * Endpoint: GET /api/shopper/dwell-time
   */
  async getDwellTimeAnalytics(storeId: string = 'store-001'): Promise<DwellTimeBucket[]> {
    try {
      const response = await apiClient.get<DwellTimeBucket[]>('/shopper/dwell-time', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return DWELL_TIME_DISTRIBUTION;
    } catch {
      return DWELL_TIME_DISTRIBUTION;
    }
  },
};

export default shopperService;
