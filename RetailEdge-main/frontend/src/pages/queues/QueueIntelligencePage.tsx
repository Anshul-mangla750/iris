import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import QueueHeader from '../../components/queues/QueueHeader';
import QueueKpiGrid from '../../components/queues/QueueKpiGrid';
import LiveQueueCameraFeed from '../../components/queues/LiveQueueCameraFeed';
import QueueStatusTable from '../../components/queues/QueueStatusTable';
import QueueHeatmap from '../../components/queues/QueueHeatmap';
import QueueLengthTrend from '../../components/queues/QueueLengthTrend';
import PredictedQueueChart from '../../components/queues/PredictedQueueChart';
import WaitTimeDistribution from '../../components/queues/WaitTimeDistribution';
import PeakHoursHeatmap from '../../components/queues/PeakHoursHeatmap';
import CustomerFlowInsights from '../../components/queues/CustomerFlowInsights';
import RecentQueueEvents from '../../components/queues/RecentQueueEvents';
import QueueEventsModal from '../../components/queues/QueueEventsModal';

import useQueueAnalytics from '../../hooks/useQueueAnalytics';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import { useToast } from '../../context/ToastContext';

export const QueueIntelligencePage: React.FC = () => {
  const { showToast } = useToast();
  const {
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
  } = useQueueAnalytics('store-001');

  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  const currentStore: StoreOption =
    STORE_OPTIONS.find((s) => s.id === activeStoreId) || STORE_OPTIONS[0];

  const handleSelectStore = (store: StoreOption) => {
    selectStore(store.id);
  };

  const handleExport = () => {
    const headers = ['Counter', 'Current Queue (people)', 'Avg Wait Time (min)', 'Status', 'Trend'];
    const rows = counters.map((c) => [
      `"${c.name}"`,
      c.currentQueue,
      c.avgWaitTime,
      `"${c.status}"`,
      `"${c.trend}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `queue-analytics-${activeStoreId}-${timeRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Queue intelligence report exported to CSV', 'success');
  };

  return (
    <DashboardLayout
      currentStore={currentStore}
      onSelectStore={handleSelectStore}
    >
      {/* 1. Header with Page Title, Subtitle, Date Selector, Period Filter, and Counter Filter */}
      <QueueHeader
        dateFormatted={new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        timeRange={timeRange}
        onSelectTimeRange={selectTimeRange}
        selectedCounter={selectedCounter}
        onSelectCounter={selectCounterFilter}
        onExport={handleExport}
      />

      {/* 2. 6 KPI Cards in 1 Row on Desktop */}
      <QueueKpiGrid overview={overview} />

      {/* 3. Operations Row: Live Queue Camera Feed + Queue Status - All Counters + Queue Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr_0.9fr] gap-3 mb-3.5 items-stretch">
        <LiveQueueCameraFeed
          imageUrl={heatmap.imageUrl ? '/images/queues/camera_feed.png' : undefined}
          counters={counters}
          loading={isLoading}
        />
        <QueueStatusTable
          counters={counters}
          loading={isLoading}
        />
        <QueueHeatmap
          data={heatmap}
          loading={isLoading}
        />
      </div>

      {/* 4. Analytics Row: Queue Length Trend + Predicted Queue Length (XGBoost) + Wait Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.1fr_0.9fr] gap-3 mb-3.5 items-stretch">
        <QueueLengthTrend
          data={trend}
          loading={isLoading}
        />
        <PredictedQueueChart
          data={prediction}
          loading={isLoading}
        />
        <WaitTimeDistribution
          data={waitTimeDist}
          loading={isLoading}
        />
      </div>

      {/* 5. Insights Row: Peak Hours Analysis + Customer Flow Insights + Recent Queue Events */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1.1fr] gap-3 items-stretch">
        <PeakHoursHeatmap
          data={peakHours}
          loading={isLoading}
        />
        <CustomerFlowInsights
          insights={flowInsights}
          loading={isLoading}
        />
        <RecentQueueEvents
          events={recentEvents}
          loading={isLoading}
          onViewAll={() => setIsEventsModalOpen(true)}
        />
      </div>

      {/* Events Modal */}
      <QueueEventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        events={recentEvents}
      />
    </DashboardLayout>
  );
};

export default QueueIntelligencePage;
