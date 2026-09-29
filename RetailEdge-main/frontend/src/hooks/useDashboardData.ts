import { useState, useEffect, useCallback } from 'react';
import type { DashboardOverviewData } from '../types/dashboard';
import dashboardService from '../services/dashboardService';
import { DEFAULT_DASHBOARD_OVERVIEW } from '../data/dashboardMockData';

export function useDashboardData(initialStoreId: string = 'store-001') {
  const [data, setData] = useState<DashboardOverviewData>(DEFAULT_DASHBOARD_OVERVIEW);
  const [activeStoreId, setActiveStoreId] = useState<string>(initialStoreId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (storeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const overview = await dashboardService.getOverview(storeId);
      setData(overview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      setData(DEFAULT_DASHBOARD_OVERVIEW);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(activeStoreId);
    const interval = setInterval(() => {
      dashboardService
        .getOverview(activeStoreId)
        .then((res) => {
          if (res && res.greeting) {
            setData(res);
          }
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [activeStoreId, fetchDashboard]);

  const selectStore = useCallback((storeId: string) => {
    setActiveStoreId(storeId);
  }, []);

  const refreshData = useCallback(() => {
    fetchDashboard(activeStoreId);
  }, [activeStoreId, fetchDashboard]);

  return {
    data,
    setData,
    activeStoreId,
    selectStore,
    isLoading,
    error,
    refreshData,
  };
}

export default useDashboardData;
