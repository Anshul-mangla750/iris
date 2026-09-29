import { useState, useEffect, useCallback } from 'react';
import type {
  Alert,
  AlertSummary,
  AlertFilters,
  AlertTrendPoint,
  AlertCategoryItem,
  AlertStatusItem,
} from '../types/alert';
import { alertService } from '../services/alertService';
import {
  ALERT_SUMMARY,
  ALERT_TREND_DATA,
  ALERT_CATEGORIES_DATA,
  ALERT_STATUS_DATA,
  MOCK_ALERTS,
} from '../data/alertMockData';

const DEFAULT_FILTERS: AlertFilters = {
  severity: ['CRITICAL'],
  category: [],
  status: ['OPEN'],
  timeRange: '24h',
  storeId: 'all',
  search: '',
};

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [summary, setSummary] = useState<AlertSummary>(ALERT_SUMMARY);
  const [trendData, setTrendData] = useState<AlertTrendPoint[]>(ALERT_TREND_DATA);
  const [categoriesData, setCategoriesData] = useState<AlertCategoryItem[]>(ALERT_CATEGORIES_DATA);
  const [statusBreakdown, setStatusBreakdown] = useState<AlertStatusItem[]>(ALERT_STATUS_DATA);
  const [selectedAlert, setSelectedAlert] = useState<Alert>(MOCK_ALERTS[0]);
  const [filters, setFilters] = useState<AlertFilters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<AlertFilters>(DEFAULT_FILTERS);
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('today');
  const [unreadCount, setUnreadCount] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlertsData = useCallback(async (activeFilters: AlertFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [alertsRes, summaryRes, trendsRes, catsRes, statusRes] = await Promise.all([
        alertService.getAlerts(activeFilters),
        alertService.getAlertSummary(activeFilters.storeId),
        alertService.getAlertTrends(activeFilters.timeRange),
        alertService.getAlertCategories(),
        alertService.getAlertStatusBreakdown(),
      ]);

      setAlerts(alertsRes.alerts);
      setSummary(summaryRes);
      setTrendData(trendsRes);
      setCategoriesData(catsRes);
      setStatusBreakdown(statusRes);

      // Keep selectedAlert in sync if it still exists in the list
      setSelectedAlert((prev) => {
        const found = alertsRes.alerts.find((a) => a.id === prev?.id);
        return found || alertsRes.alerts[0] || prev;
      });
    } catch {
      setError('Unable to load operational alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertsData(filters);
  }, [fetchAlertsData, filters]);

  const handleUpdatePendingFilter = <K extends keyof AlertFilters>(
    key: K,
    value: AlertFilters[K]
  ) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    setFilters({ ...pendingFilters });
  };

  const handleResetFilters = () => {
    const resetState: AlertFilters = {
      severity: [],
      category: [],
      status: [],
      timeRange: '24h',
      storeId: 'all',
      search: '',
    };
    setPendingFilters(resetState);
    setFilters(resetState);
  };

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const handleMarkAllRead = async () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    setUnreadCount(0);
    await alertService.markAllAlertsRead();
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    await alertService.acknowledgeAlert(alertId);
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const updated: Alert = {
            ...a,
            status: 'ACKNOWLEDGED',
            acknowledgedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            history: [
              ...a.history,
              {
                id: `h-ack-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: 'Marked in progress',
                description: 'Operational team investigating',
                dotColor: 'amber',
              },
            ],
          };
          if (selectedAlert.id === alertId) {
            setSelectedAlert(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const handleResolveAlert = async (alertId: string) => {
    await alertService.resolveAlert(alertId);
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const updated: Alert = {
            ...a,
            status: 'RESOLVED',
            resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            history: [
              ...a.history,
              {
                id: `h-res-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: 'Alert resolved',
                description: 'Corrective action verified',
                dotColor: 'green',
              },
            ],
          };
          if (selectedAlert.id === alertId) {
            setSelectedAlert(updated);
          }
          return updated;
        }
        return a;
      })
    );
    setSummary((prev) => ({
      ...prev,
      resolved: prev.resolved + 1,
    }));
  };

  const handleAssignStaff = async (alertId: string, staffName: string) => {
    await alertService.assignAlert(alertId, staffName);
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const updated: Alert = {
            ...a,
            assignedTo: staffName,
            history: [
              ...a.history,
              {
                id: `h-assign-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: 'Staff assigned',
                description: staffName,
                dotColor: 'blue',
              },
            ],
          };
          if (selectedAlert.id === alertId) {
            setSelectedAlert(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  return {
    alerts,
    summary,
    trendData,
    categoriesData,
    statusBreakdown,
    selectedAlert,
    filters,
    pendingFilters,
    dateRange,
    setDateRange,
    unreadCount,
    loading,
    error,
    handleUpdatePendingFilter,
    handleApplyFilters,
    handleResetFilters,
    handleSelectAlert,
    handleMarkAllRead,
    handleAcknowledgeAlert,
    handleResolveAlert,
    handleAssignStaff,
    refetch: () => fetchAlertsData(filters),
  };
}
