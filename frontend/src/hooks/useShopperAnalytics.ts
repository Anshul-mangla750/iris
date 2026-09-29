import { useState, useEffect, useCallback } from 'react';
import type { ShopperOverviewData, TimeRangeFilter } from '../types/shopper';
import shopperService from '../services/shopperService';
import { DEFAULT_SHOPPER_OVERVIEW } from '../data/shopperMockData';

export function useShopperAnalytics(initialStoreId: string = 'store-001') {
  const [data, setData] = useState<ShopperOverviewData>(DEFAULT_SHOPPER_OVERVIEW);
  const [activeStoreId, setActiveStoreId] = useState<string>(initialStoreId);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('today');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(
    async (storeId: string, range: TimeRangeFilter) => {
      setIsLoading(true);
      setError(null);
      try {
        const overview = await shopperService.getShopperOverview(storeId, range);
        setData(overview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shopper data');
        setData(DEFAULT_SHOPPER_OVERVIEW);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchOverview(activeStoreId, timeRange);
    const timer = setInterval(() => {
      shopperService
        .getShopperOverview(activeStoreId, timeRange)
        .then((res) => {
          if (res && res.kpis) {
            setData(res);
          }
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(timer);
  }, [activeStoreId, timeRange, fetchOverview]);

  const selectStore = useCallback((storeId: string) => {
    setActiveStoreId(storeId);
  }, []);

  const selectTimeRange = useCallback((range: TimeRangeFilter) => {
    setTimeRange(range);
  }, []);

  const refreshData = useCallback(() => {
    fetchOverview(activeStoreId, timeRange);
  }, [activeStoreId, timeRange, fetchOverview]);

  return {
    data,
    activeStoreId,
    selectStore,
    timeRange,
    selectTimeRange,
    isLoading,
    error,
    refreshData,
  };
}

export default useShopperAnalytics;
