import apiClient from './apiClient';
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

export const queueService = {
  /**
   * Retrieves aggregated queue overview metrics.
   * Endpoint: GET /api/queues/overview
   */
  async getQueueOverview(storeId: string = 'store-001'): Promise<QueueOverview> {
    try {
      const response = await apiClient.get<QueueOverview>('/queues/overview', {
        params: { store_id: storeId },
      });
      if (response.data && typeof response.data === 'object' && response.data.totalCustomersServed) {
        return response.data;
      }
      return QUEUE_OVERVIEW_MOCK;
    } catch {
      return QUEUE_OVERVIEW_MOCK;
    }
  },

  /**
   * Retrieves real-time counter status and queue lengths.
   * Endpoint: GET /api/queues/live
   */
  async getLiveQueues(storeId: string = 'store-001'): Promise<CounterStatusItem[]> {
    try {
      const response = await apiClient.get<CounterStatusItem[]>('/queues/live', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return COUNTER_STATUS_MOCK;
    } catch {
      return COUNTER_STATUS_MOCK;
    }
  },

  /**
   * Retrieves queue heatmap data.
   * Endpoint: GET /api/queues/heatmap
   */
  async getQueueHeatmap(storeId: string = 'store-001'): Promise<QueueHeatmapData> {
    try {
      const response = await apiClient.get<QueueHeatmapData>('/queues/heatmap', {
        params: { store_id: storeId },
      });
      if (response.data && typeof response.data === 'object' && response.data.imageUrl) {
        return response.data;
      }
      return QUEUE_HEATMAP_MOCK;
    } catch {
      return QUEUE_HEATMAP_MOCK;
    }
  },

  /**
   * Retrieves queue length trend history.
   * Endpoint: GET /api/queues/trend
   */
  async getQueueTrend(storeId: string = 'store-001', range: string = 'today'): Promise<QueueLengthTrendPoint[]> {
    try {
      const response = await apiClient.get<QueueLengthTrendPoint[]>('/queues/trend', {
        params: { store_id: storeId, range },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return QUEUE_LENGTH_TREND_MOCK;
    } catch {
      return QUEUE_LENGTH_TREND_MOCK;
    }
  },

  /**
   * Retrieves ML-based queue predictions.
   * Endpoint: GET /api/queues/predictions
   */
  async getPredictedQueue(storeId: string = 'store-001'): Promise<PredictedQueuePoint[]> {
    try {
      const response = await apiClient.get<PredictedQueuePoint[]>('/queues/predictions', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return PREDICTED_QUEUE_MOCK;
    } catch {
      return PREDICTED_QUEUE_MOCK;
    }
  },

  /**
   * Retrieves wait-time distribution buckets.
   * Endpoint: GET /api/queues/wait-time-distribution
   */
  async getWaitTimeDistribution(storeId: string = 'store-001'): Promise<WaitTimeBucket[]> {
    try {
      const response = await apiClient.get<WaitTimeBucket[]>('/queues/wait-time-distribution', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return WAIT_TIME_DISTRIBUTION_MOCK;
    } catch {
      return WAIT_TIME_DISTRIBUTION_MOCK;
    }
  },

  /**
   * Retrieves peak hours matrix.
   * Endpoint: GET /api/queues/peak-hours
   */
  async getPeakHoursMatrix(storeId: string = 'store-001'): Promise<PeakHourCell[]> {
    try {
      const response = await apiClient.get<PeakHourCell[]>('/queues/peak-hours', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return PEAK_HOURS_MATRIX;
    } catch {
      return PEAK_HOURS_MATRIX;
    }
  },

  /**
   * Retrieves customer flow insights.
   * Endpoint: GET /api/queues/insights
   */
  async getFlowInsights(storeId: string = 'store-001'): Promise<CustomerFlowInsightItem[]> {
    try {
      const response = await apiClient.get<CustomerFlowInsightItem[]>('/queues/insights', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return CUSTOMER_FLOW_INSIGHTS_MOCK;
    } catch {
      return CUSTOMER_FLOW_INSIGHTS_MOCK;
    }
  },

  /**
   * Retrieves recent queue events.
   * Endpoint: GET /api/queues/events
   */
  async getRecentEvents(storeId: string = 'store-001'): Promise<RecentQueueEventItem[]> {
    try {
      const response = await apiClient.get<RecentQueueEventItem[]>('/queues/events', {
        params: { store_id: storeId },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return RECENT_QUEUE_EVENTS_MOCK;
    } catch {
      return RECENT_QUEUE_EVENTS_MOCK;
    }
  },
};

export default queueService;
