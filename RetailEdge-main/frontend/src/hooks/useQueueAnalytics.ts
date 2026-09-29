import { useState, useEffect, useCallback } from 'react';
import type {
  QueueOverview,
  CounterStatusItem,
  QueueHeatmapData,
  QueueLengthTrendPoint,
  PredictedQueuePoint,
  WaitTimeBucket,
  PeakHourCell,
  CustomerFlowInsightItem,
  RecentQueueEventItem,
} from '../types/queue';
import queueService from '../services/queueService';
import {
  QUEUE_OVERVIEW_MOCK,
  COUNTER_STATUS_MOCK,
  QUEUE_HEATMAP_MOCK,
  QUEUE_LENGTH_TREND_MOCK,
  PREDICTED_QUEUE_MOCK,
  WAIT_TIME_DISTRIBUTION_MOCK,
  PEAK_HOURS_MATRIX,
  CUSTOMER_FLOW_INSIGHTS_MOCK,
  RECENT_QUEUE_EVENTS_MOCK,
} from '../data/queueMockData';

export type QueueTimeRangeFilter = 'today' | '7d' | '30d';

export function useQueueAnalytics(initialStoreId: string = 'store-001') {
  const [overview, setOverview] = useState<QueueOverview>(QUEUE_OVERVIEW_MOCK);
  const [counters, setCounters] = useState<CounterStatusItem[]>(COUNTER_STATUS_MOCK);
  const [heatmap, setHeatmap] = useState<QueueHeatmapData>(QUEUE_HEATMAP_MOCK);
  const [trend, setTrend] = useState<QueueLengthTrendPoint[]>(QUEUE_LENGTH_TREND_MOCK);
  const [prediction, setPrediction] = useState<PredictedQueuePoint[]>(PREDICTED_QUEUE_MOCK);
  const [waitTimeDist, setWaitTimeDist] = useState<WaitTimeBucket[]>(WAIT_TIME_DISTRIBUTION_MOCK);
  const [peakHours, setPeakHours] = useState<PeakHourCell[]>(PEAK_HOURS_MATRIX);
  const [flowInsights, setFlowInsights] = useState<CustomerFlowInsightItem[]>(CUSTOMER_FLOW_INSIGHTS_MOCK);
  const [recentEvents, setRecentEvents] = useState<RecentQueueEventItem[]>(RECENT_QUEUE_EVENTS_MOCK);

  const [activeStoreId, setActiveStoreId] = useState<string>(initialStoreId);
  const [timeRange, setTimeRange] = useState<QueueTimeRangeFilter>('today');
  const [selectedCounter, setSelectedCounter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async (storeId: string, range: QueueTimeRangeFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        overviewRes,
        countersRes,
        heatmapRes,
        trendRes,
        predictionRes,
        distRes,
        peakRes,
        insightsRes,
        eventsRes,
      ] = await Promise.all([
        queueService.getQueueOverview(storeId),
        queueService.getLiveQueues(storeId),
        queueService.getQueueHeatmap(storeId),
        queueService.getQueueTrend(storeId, range),
        queueService.getPredictedQueue(storeId),
        queueService.getWaitTimeDistribution(storeId),
        queueService.getPeakHoursMatrix(storeId),
        queueService.getFlowInsights(storeId),
        queueService.getRecentEvents(storeId),
      ]);

      setOverview(overviewRes);
      setCounters(countersRes);
      setHeatmap(heatmapRes);
      setTrend(trendRes);
      setPrediction(predictionRes);
      setWaitTimeDist(distRes);
      setPeakHours(peakRes);
      setFlowInsights(insightsRes);
      setRecentEvents(eventsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queue data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(activeStoreId, timeRange);
    const interval = setInterval(async () => {
      try {
        const [overviewRes, countersRes] = await Promise.all([
          queueService.getQueueOverview(activeStoreId),
          queueService.getLiveQueues(activeStoreId),
        ]);
        if (overviewRes) setOverview(overviewRes);
        if (countersRes && countersRes.length > 0) setCounters(countersRes);
      } catch {
        // quiet background refresh
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [activeStoreId, timeRange, fetchAllData]);

  const selectStore = useCallback((storeId: string) => {
    setActiveStoreId(storeId);
  }, []);

  const selectTimeRange = useCallback((range: QueueTimeRangeFilter) => {
    setTimeRange(range);
  }, []);

  const selectCounterFilter = useCallback((counterId: string) => {
    setSelectedCounter(counterId);
  }, []);

  const refreshData = useCallback(() => {
    fetchAllData(activeStoreId, timeRange);
  }, [activeStoreId, timeRange, fetchAllData]);

  return {
    overview,
    counters,
    heatmap,
    trend,
    prediction,
    waitTimeDist,
    peakHours,
    flowInsights,
    recentEvents,
    activeStoreId,
    selectStore,
    timeRange,
    selectTimeRange,
    selectedCounter,
    selectCounterFilter,
    isLoading,
    error,
    refreshData,
  };
}

export default useQueueAnalytics;
