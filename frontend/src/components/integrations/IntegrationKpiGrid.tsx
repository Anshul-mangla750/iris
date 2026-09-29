import React from 'react';
import { RefreshCw, IndianRupee, Package, CheckCircle2, AlertTriangle } from 'lucide-react';
import IntegrationKpiCard from './IntegrationKpiCard';
import type { IntegrationSummary } from '../../types/integration';

interface IntegrationKpiGridProps {
  summary: IntegrationSummary;
}

export const IntegrationKpiGrid: React.FC<IntegrationKpiGridProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-4">
      {/* 1. Total Transactions */}
      <IntegrationKpiCard
        title="Total Transactions"
        value={summary?.totalTransactions ? summary.totalTransactions.toLocaleString() : '2,854'}
        trendText={`↑ ${summary?.trends?.totalTransactions ?? 12}%`}
        trendType="up"
        icon={RefreshCw}
        iconBg="bg-[#eaf8f0]"
        iconColor="text-[#0fa968]"
        sparklineColor="#0fa968"
        sparklinePoints={[18, 22, 19, 25, 24, 28, 30]}
      />

      {/* 2. Total Sales (POS) */}
      <IntegrationKpiCard
        title="Total Sales (POS)"
        value={summary?.totalSales ? `₹ ${summary.totalSales.toLocaleString('en-IN')}` : '₹ 4,28,760'}
        trendText={`↑ ${summary?.trends?.totalSales ?? 8}%`}
        trendType="up"
        icon={IndianRupee}
        iconBg="bg-[#edf5ff]"
        iconColor="text-[#2563eb]"
        sparklineColor="#2563eb"
        sparklinePoints={[20, 24, 21, 26, 23, 29, 31]}
      />

      {/* 3. Items Synced */}
      <IntegrationKpiCard
        title="Items Synced"
        value={summary?.itemsSynced ? summary.itemsSynced.toLocaleString() : '1,248'}
        trendText={`↑ ${summary?.trends?.itemsSynced ?? 15}%`}
        trendType="up"
        icon={Package}
        iconBg="bg-[#f5eeff]"
        iconColor="text-[#8b5cf6]"
        sparklineColor="#8b5cf6"
        sparklinePoints={[15, 18, 20, 22, 21, 26, 29]}
      />

      {/* 4. Sync Success Rate */}
      <IntegrationKpiCard
        title="Sync Success Rate"
        value={summary?.syncSuccessRate ? `${summary.syncSuccessRate}%` : '99.2%'}
        trendText={`↑ ${summary?.trends?.syncSuccessRate ?? 0.8}%`}
        trendType="up"
        icon={CheckCircle2}
        iconBg="bg-[#eaf8f0]"
        iconColor="text-[#0fa968]"
        sparklineColor="#0fa968"
        sparklinePoints={[25, 26, 27, 26, 28, 29, 30]}
      />

      {/* 5. Sync Errors */}
      <IntegrationKpiCard
        title="Sync Errors"
        value={summary?.syncErrors !== undefined ? summary.syncErrors.toString() : '8'}
        trendText={`↓ ${Math.abs(summary?.trends?.syncErrors ?? 60)}%`}
        trendType="down"
        icon={AlertTriangle}
        iconBg="bg-[#fef2f2]"
        iconColor="text-[#ef4444]"
        sparklineColor="#ef4444"
        sparklinePoints={[32, 28, 25, 20, 18, 14, 10]}
      />
    </div>
  );
};

export default IntegrationKpiGrid;
