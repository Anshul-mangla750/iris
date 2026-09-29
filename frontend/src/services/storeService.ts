import apiClient from './apiClient';
import type {
  Store,
  StoreSummary,
  StorePerformanceItem,
  DeviceCategoryHealth,
  StoreStatusDistributionItem,
  StoreFilters,
  CreateStoreInput,
} from '../types/store';
import {
  STORE_SUMMARY,
  STORE_PERFORMANCE_DATA,
  DEVICE_HEALTH_DATA,
  STORE_STATUS_DISTRIBUTION,
  MOCK_STORES,
} from '../data/storeMockData';

export const storeService = {
  /**
   * Fetch stores list with optional filtering and pagination
   */
  async getStores(filters?: Partial<StoreFilters>): Promise<{
    stores: Store[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get('/stores', { params: filters });
      if (response.data && Array.isArray(response.data.stores)) {
        return response.data;
      }
      if (Array.isArray(response.data)) {
        return {
          stores: response.data,
          total: response.data.length,
          page: filters?.page || 1,
          limit: filters?.limit || 5,
          totalPages: Math.ceil(response.data.length / (filters?.limit || 5)),
        };
      }
      return this.filterLocalStores(filters);
    } catch {
      return this.filterLocalStores(filters);
    }
  },

  filterLocalStores(filters?: Partial<StoreFilters>) {
    let filtered = [...MOCK_STORES];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q)
      );
    }

    if (filters?.region && filters.region !== 'ALL' && filters.region !== 'All Regions') {
      filtered = filtered.filter((s) => s.region.toLowerCase() === filters.region!.toLowerCase());
    }

    if (filters?.status && filters.status !== 'ALL' && filters.status !== 'All Status') {
      filtered = filtered.filter(
        (s) => s.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    const total = filtered.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 5;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      stores: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  /**
   * Fetch a single store by ID
   */
  async getStore(id: string): Promise<Store | null> {
    try {
      const response = await apiClient.get(`/stores/${id}`);
      return response.data;
    } catch {
      const match = MOCK_STORES.find((s) => s.id === id || s.code === id);
      return match || MOCK_STORES[0] || null;
    }
  },

  /**
   * Fetch summary KPI stats
   */
  async getStoreSummary(): Promise<StoreSummary> {
    try {
      const response = await apiClient.get('/stores/summary');
      if (response.data && typeof response.data.totalStores === 'number') {
        return response.data;
      }
      return STORE_SUMMARY;
    } catch {
      return STORE_SUMMARY;
    }
  },

  /**
   * Fetch store performance metrics
   */
  async getStorePerformance(): Promise<StorePerformanceItem[]> {
    try {
      const response = await apiClient.get('/stores/performance');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return STORE_PERFORMANCE_DATA;
    } catch {
      return STORE_PERFORMANCE_DATA;
    }
  },

  /**
   * Fetch device health metrics
   */
  async getStoreDeviceHealth(): Promise<DeviceCategoryHealth[]> {
    try {
      const response = await apiClient.get('/stores/device-health');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return DEVICE_HEALTH_DATA;
    } catch {
      return DEVICE_HEALTH_DATA;
    }
  },

  /**
   * Fetch store status distribution
   */
  async getStoreStatusDistribution(): Promise<StoreStatusDistributionItem[]> {
    try {
      const response = await apiClient.get('/stores/status-distribution');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return STORE_STATUS_DISTRIBUTION;
    } catch {
      return STORE_STATUS_DISTRIBUTION;
    }
  },

  /**
   * Create a new store
   */
  async createStore(input: CreateStoreInput): Promise<{ success: boolean; store: Store }> {
    try {
      const response = await apiClient.post('/stores', input);
      return { success: true, store: response.data };
    } catch {
      const newStore: Store = {
        id: `str-${String(MOCK_STORES.length + 1).padStart(3, '0')}`,
        organizationId: 'org-001',
        name: input.name,
        code: input.code,
        address: input.address,
        city: input.city,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        phone: input.phone,
        email: input.email,
        region: input.region,
        timezone: input.timezone,
        status: input.status || 'ONLINE',
        latitude: 28.6139,
        longitude: 77.2090,
        manager: input.manager || 'Unassigned',
        footfall: 0,
        footfallTrend: 0,
        sales: 0,
        salesTrend: 0,
        devicesOnline: 10,
        devicesTotal: 10,
        lastUpdatedAt: 'Just now',
        image: '/images/stores/store_001_tab.png',
      };
      return { success: true, store: newStore };
    }
  },

  /**
   * Update an existing store
   */
  async updateStore(id: string, updates: Partial<Store>): Promise<{ success: boolean; store?: Store }> {
    try {
      const response = await apiClient.patch(`/stores/${id}`, updates);
      return { success: true, store: response.data };
    } catch {
      return { success: true };
    }
  },

  /**
   * Delete a store
   */
  async deleteStore(id: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`/stores/${id}`);
      return { success: true };
    } catch {
      return { success: true };
    }
  },
};

export default storeService;
