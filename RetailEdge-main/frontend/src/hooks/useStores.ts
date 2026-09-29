import { useState, useEffect, useCallback } from 'react';
import type {
  Store,
  StoreSummary,
  StorePerformanceItem,
  DeviceCategoryHealth,
  StoreStatusDistributionItem,
  StoreFilters,
  CreateStoreInput,
} from '../types/store';
import { storeService } from '../services/storeService';
import {
  STORE_SUMMARY,
  STORE_PERFORMANCE_DATA,
  DEVICE_HEALTH_DATA,
  STORE_STATUS_DISTRIBUTION,
  MOCK_STORES,
} from '../data/storeMockData';
import { exportStoresToCsv } from '../utils/csvExport';

const DEFAULT_FILTERS: StoreFilters = {
  search: '',
  region: 'All Regions',
  status: 'All Status',
  dateRange: 'today',
  page: 1,
  limit: 5,
};

export function useStores() {
  const [stores, setStores] = useState<Store[]>(MOCK_STORES.slice(0, 5));
  const [allStores, setAllStores] = useState<Store[]>(MOCK_STORES);
  const [total, setTotal] = useState<number>(MOCK_STORES.length);
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(MOCK_STORES.length / 5));
  const [summary, setSummary] = useState<StoreSummary>(STORE_SUMMARY);
  const [performanceData, setPerformanceData] = useState<StorePerformanceItem[]>(STORE_PERFORMANCE_DATA);
  const [performanceMetric, setPerformanceMetric] = useState<string>('Sales Revenue (₹)');
  const [deviceHealth, setDeviceHealth] = useState<DeviceCategoryHealth[]>(DEVICE_HEALTH_DATA);
  const [statusDistribution, setStatusDistribution] = useState<StoreStatusDistributionItem[]>(STORE_STATUS_DISTRIBUTION);
  const [selectedStore, setSelectedStore] = useState<Store | null>(MOCK_STORES[0]);
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_FILTERS);
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('today');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStoresData = useCallback(async (activeFilters: StoreFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, summaryRes, perfRes, healthRes, distRes] = await Promise.all([
        storeService.getStores(activeFilters),
        storeService.getStoreSummary(),
        storeService.getStorePerformance(),
        storeService.getStoreDeviceHealth(),
        storeService.getStoreStatusDistribution(),
      ]);

      setStores(listRes.stores);
      setTotal(listRes.total);
      setTotalPages(listRes.totalPages);
      setSummary(summaryRes);
      setPerformanceData(perfRes);
      setDeviceHealth(healthRes);
      setStatusDistribution(distRes);
    } catch {
      setError('Unable to load stores data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoresData(filters);
  }, [fetchStoresData, filters]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const setRegion = (region: string) => {
    setFilters((prev) => ({ ...prev, region, page: 1 }));
  };

  const setStatus = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleCreateStore = async (input: CreateStoreInput): Promise<boolean> => {
    try {
      const res = await storeService.createStore(input);
      if (res.success) {
        setAllStores((prev) => [res.store, ...prev]);
        setStores((prev) => [res.store, ...prev.slice(0, 4)]);
        setTotal((prev) => prev + 1);
        setSummary((prev) => ({
          ...prev,
          totalStores: prev.totalStores + 1,
          activeStores: prev.activeStores + 1,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleExport = () => {
    exportStoresToCsv(allStores, `retailedge-stores-${dateRange}.csv`);
  };

  return {
    stores,
    allStores,
    total,
    totalPages,
    page: filters.page,
    limit: filters.limit,
    summary,
    performanceData,
    performanceMetric,
    deviceHealth,
    statusDistribution,
    selectedStore,
    filters,
    dateRange,
    loading,
    error,
    setDateRange,
    setPage,
    setSearch,
    setRegion,
    setStatus,
    setPerformanceMetric,
    setSelectedStore,
    handleCreateStore,
    handleExport,
    refetch: () => fetchStoresData(filters),
  };
}
