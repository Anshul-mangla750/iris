import { useState, useEffect, useCallback } from 'react';
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
import inventoryService from '../services/inventoryService';
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

export type TimeRangeFilter = 'today' | '7d' | '30d';

export function useInventory(initialStoreId: string = 'store-001') {
  const [overview, setOverview] = useState<InventoryOverview>(INVENTORY_OVERVIEW_MOCK);
  const [distribution, setDistribution] = useState<InventoryStatusSegment[]>(INVENTORY_STATUS_DISTRIBUTION_MOCK);
  const [trend, setTrend] = useState<StockTrendPoint[]>(STOCK_TREND_MOCK);
  const [categories, setCategories] = useState<CategoryStockStatus[]>(CATEGORY_STOCK_STATUS_MOCK);
  const [shelfView, setShelfView] = useState<ShelfViewData>(SHELF_VIEW_MOCK);
  const [shelfHealth, setShelfHealth] = useState<ShelfHealthAnalysisData>(SHELF_HEALTH_MOCK);
  const [lowStockItems, setLowStockItems] = useState<LowStockProductItem[]>(LOW_STOCK_PRODUCTS_MOCK);
  const [events, setEvents] = useState<InventoryEventItem[]>(INVENTORY_EVENTS_MOCK);

  const [activeStoreId, setActiveStoreId] = useState<string>(initialStoreId);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('today');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async (storeId: string, range: TimeRangeFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        overviewRes,
        distRes,
        trendRes,
        catRes,
        shelfRes,
        healthRes,
        itemsRes,
        eventsRes,
      ] = await Promise.all([
        inventoryService.getInventoryOverview(storeId),
        inventoryService.getStatusDistribution(storeId),
        inventoryService.getStockTrend(storeId, range),
        inventoryService.getCategoryStatus(storeId),
        inventoryService.getLiveShelf(storeId),
        inventoryService.getShelfHealth(storeId),
        inventoryService.getLowStockItems(storeId),
        inventoryService.getRecentEvents(storeId),
      ]);

      setOverview(overviewRes);
      setDistribution(distRes);
      setTrend(trendRes);
      setCategories(catRes);
      setShelfView(shelfRes);
      setShelfHealth(healthRes);
      setLowStockItems(itemsRes);
      setEvents(eventsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(activeStoreId, timeRange);
    const interval = setInterval(async () => {
      try {
        const [overviewRes, itemsRes] = await Promise.all([
          inventoryService.getInventoryOverview(activeStoreId),
          inventoryService.getLowStockItems(activeStoreId),
        ]);
        if (overviewRes) setOverview(overviewRes);
        if (itemsRes && itemsRes.length > 0) setLowStockItems(itemsRes);
      } catch {
        // quiet background refresh
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [activeStoreId, timeRange, fetchAllData]);

  const selectStore = useCallback((storeId: string) => {
    setActiveStoreId(storeId);
  }, []);

  const selectTimeRange = useCallback((range: TimeRangeFilter) => {
    setTimeRange(range);
  }, []);

  const refreshData = useCallback(() => {
    fetchAllData(activeStoreId, timeRange);
  }, [activeStoreId, timeRange, fetchAllData]);

  return {
    overview,
    distribution,
    trend,
    categories,
    shelfView,
    shelfHealth,
    lowStockItems,
    events,
    activeStoreId,
    selectStore,
    timeRange,
    selectTimeRange,
    isLoading,
    error,
    refreshData,
  };
}

export default useInventory;
