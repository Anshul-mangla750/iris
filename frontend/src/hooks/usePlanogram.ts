import { useState, useEffect, useCallback } from 'react';
import type {
  PlanogramOverview,
  LiveShelfDetectionData,
  PlanogramComparisonData,
  CategoryComplianceItem,
  ShelfComplianceTrendPoint,
  NonCompliantProductItem,
  PlanogramAIInsight,
} from '../types/planogram';
import planogramService from '../services/planogramService';
import {
  PLANOGRAM_OVERVIEW_MOCK,
  LIVE_SHELF_DETECTION_MOCK,
  PLANOGRAM_COMPARISON_MOCK,
  CATEGORY_COMPLIANCE_MOCK,
  SHELF_COMPLIANCE_TREND_MOCK,
  NON_COMPLIANT_ITEMS_MOCK,
  PLANOGRAM_AI_INSIGHTS_MOCK,
} from '../data/planogramMockData';

export type PlanogramTimeRangeFilter = 'today' | '7d' | '30d';

export function usePlanogram(initialStoreId: string = 'store-001') {
  const [overview, setOverview] = useState<PlanogramOverview>(PLANOGRAM_OVERVIEW_MOCK);
  const [liveShelf, setLiveShelf] = useState<LiveShelfDetectionData>(LIVE_SHELF_DETECTION_MOCK);
  const [comparison, setComparison] = useState<PlanogramComparisonData>(PLANOGRAM_COMPARISON_MOCK);
  const [categories, setCategories] = useState<CategoryComplianceItem[]>(CATEGORY_COMPLIANCE_MOCK);
  const [trend, setTrend] = useState<ShelfComplianceTrendPoint[]>(SHELF_COMPLIANCE_TREND_MOCK);
  const [nonCompliantItems, setNonCompliantItems] = useState<NonCompliantProductItem[]>(NON_COMPLIANT_ITEMS_MOCK);
  const [insights, setInsights] = useState<PlanogramAIInsight[]>(PLANOGRAM_AI_INSIGHTS_MOCK);

  const [activeStoreId, setActiveStoreId] = useState<string>(initialStoreId);
  const [timeRange, setTimeRange] = useState<PlanogramTimeRangeFilter>('today');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async (storeId: string, range: PlanogramTimeRangeFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        overviewRes,
        liveShelfRes,
        compRes,
        catRes,
        trendRes,
        itemsRes,
        insightsRes,
      ] = await Promise.all([
        planogramService.getOverview(storeId),
        planogramService.getLiveShelfDetection(storeId),
        planogramService.getComparison(storeId),
        planogramService.getCategoryCompliance(storeId),
        planogramService.getComplianceTrend(storeId, range),
        planogramService.getNonCompliantItems(storeId),
        planogramService.getAIInsights(storeId),
      ]);

      setOverview(overviewRes);
      setLiveShelf(liveShelfRes);
      setComparison(compRes);
      setCategories(catRes);
      setTrend(trendRes);
      setNonCompliantItems(itemsRes);
      setInsights(insightsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load planogram data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(activeStoreId, timeRange);
  }, [activeStoreId, timeRange, fetchAllData]);

  const selectStore = useCallback((storeId: string) => {
    setActiveStoreId(storeId);
  }, []);

  const selectTimeRange = useCallback((range: PlanogramTimeRangeFilter) => {
    setTimeRange(range);
  }, []);

  const refreshData = useCallback(() => {
    fetchAllData(activeStoreId, timeRange);
  }, [activeStoreId, timeRange, fetchAllData]);

  return {
    overview,
    liveShelf,
    comparison,
    categories,
    trend,
    nonCompliantItems,
    insights,
    activeStoreId,
    selectStore,
    timeRange,
    selectTimeRange,
    isLoading,
    error,
    refreshData,
  };
}

export default usePlanogram;
