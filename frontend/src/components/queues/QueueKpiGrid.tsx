import React from 'react';
import QueueKpiCard from './QueueKpiCard';
import type { QueueOverview } from '../../types/queue';

interface QueueKpiGridProps {
  overview: QueueOverview;
}

export const QueueKpiGrid: React.FC<QueueKpiGridProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-3.5">
      {/* 1. Total Customers Served */}
      <QueueKpiCard
        title="Total Customers Served"
        value={overview.totalCustomersServed.toLocaleString()}
        trendText={`↑ ${overview.totalCustomersTrend}% vs yesterday`}
        trendColor="green"
        sparklineColor="#10B981"
        iconType="green-users"
      />

      {/* 2. Average Wait Time */}
      <QueueKpiCard
        title="Average Wait Time"
        value={`${overview.avgWaitTime} min`}
        trendText={`↓ ${Math.abs(overview.avgWaitTimeTrend)}% vs yesterday`}
        trendColor="green"
        iconType="purple-clock"
      />

      {/* 3. Current Queue Length */}
      <QueueKpiCard
        title="Current Queue Length"
        value={`${overview.currentQueueLength} people`}
        statusText={`● ${overview.currentQueueStatus}`}
        statusType="normal"
        iconType="blue-users"
      />

      {/* 4. Predicted Wait Time */}
      <QueueKpiCard
        title="Predicted Wait Time"
        value={`${overview.predictedWaitTime} min`}
        supportingText={`◇ ${overview.predictedHorizon}`}
        iconType="red-hourglass"
      />

      {/* 5. Busiest Counter */}
      <QueueKpiCard
        title="Busiest Counter"
        value={overview.busiestCounter}
        statusText={`✦ ${overview.busiestCounterTraffic}`}
        statusType="high"
        iconType="red-users"
      />

      {/* 6. Queue Satisfaction */}
      <QueueKpiCard
        title="Queue Satisfaction"
        value={`${overview.queueSatisfaction}%`}
        trendText={`↑ ${overview.queueSatisfactionTrend}% vs yesterday`}
        trendColor="green"
        iconType="green-smile"
      />
    </div>
  );
};

export default QueueKpiGrid;
