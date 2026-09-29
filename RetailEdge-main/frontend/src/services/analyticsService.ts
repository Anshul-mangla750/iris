import apiClient from './apiClient';
import {
  FOOTFALL_TREND_DATA,
  CUSTOMER_DISTRIBUTION_DATA,
  DWELL_TIME_DATA,
  FOOTFALL_BY_HOUR_DATA,
  SALES_FOOTFALL_DATA,
  TOP_CATEGORIES_DATA,
} from '../data/dashboardMockData';

export const analyticsService = {
  async getFootfallTrend() {
    try {
      const response = await apiClient.get('/analytics/footfall');
      return response.data;
    } catch {
      return FOOTFALL_TREND_DATA;
    }
  },

  async getCustomerDistribution() {
    try {
      const response = await apiClient.get('/analytics/demographics');
      return response.data;
    } catch {
      return CUSTOMER_DISTRIBUTION_DATA;
    }
  },

  async getDwellTimeByZone() {
    try {
      const response = await apiClient.get('/analytics/zones');
      return response.data;
    } catch {
      return DWELL_TIME_DATA;
    }
  },

  async getFootfallByHour() {
    try {
      const response = await apiClient.get('/analytics/footfall/hourly');
      return response.data;
    } catch {
      return FOOTFALL_BY_HOUR_DATA;
    }
  },

  async getSalesVsFootfall() {
    try {
      const response = await apiClient.get('/analytics/sales-correlation');
      return response.data;
    } catch {
      return SALES_FOOTFALL_DATA;
    }
  },

  async getTopCategories() {
    try {
      const response = await apiClient.get('/analytics/categories');
      return response.data;
    } catch {
      return TOP_CATEGORIES_DATA;
    }
  },
};

export default analyticsService;
