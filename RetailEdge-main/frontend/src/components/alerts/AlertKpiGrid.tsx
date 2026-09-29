import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import AlertKpiCard from './AlertKpiCard';
import type { AlertSummary } from '../../types/alert';

interface AlertKpiGridProps {
  summary: AlertSummary;
}

export const AlertKpiGrid: React.FC<AlertKpiGridProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {/* 1. Total Alerts */}
      <AlertKpiCard
        title="Total Alerts"
        value={summary.total}
        trend="↑ 12% vs yesterday"
        trendColor="text-red-500"
        icon={AlertTriangle}
        iconBg="bg-red-50"
        iconColor="text-red-500"
        sparklineColor="#EF4444"
        sparklinePoints={[14, 18, 16, 22, 25, 20, 28]}
      />

      {/* 2. Critical */}
      <AlertKpiCard
        title="Critical"
        value={summary.critical}
        trend="↑ 25% vs yesterday"
        trendColor="text-red-500"
        icon={AlertTriangle}
        iconBg="bg-red-50"
        iconColor="text-red-500"
        sparklineColor="#EF4444"
        sparklinePoints={[2, 3, 2, 4, 3, 5, 5]}
      />

      {/* 3. Warning */}
      <AlertKpiCard
        title="Warning"
        value={summary.warning}
        trend="↑ 8% vs yesterday"
        trendColor="text-amber-500"
        icon={AlertTriangle}
        iconBg="bg-amber-50"
        iconColor="text-amber-500"
        sparklineColor="#F59E0B"
        sparklinePoints={[8, 10, 9, 13, 11, 14, 12]}
      />

      {/* 4. Info */}
      <AlertKpiCard
        title="Info"
        value={summary.info}
        trend="↓ 15% vs yesterday"
        trendColor="text-blue-500"
        icon={Info}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
        sparklineColor="#3B82F6"
        sparklinePoints={[15, 14, 13, 12, 10, 12, 11]}
      />

      {/* 5. Resolved */}
      <AlertKpiCard
        title="Resolved"
        value={summary.resolved}
        trend="↑ 30% vs yesterday"
        trendColor="text-emerald-500"
        icon={CheckCircle}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-500"
        sparklineColor="#10B981"
        sparklinePoints={[25, 28, 32, 30, 36, 40, 42]}
      />
    </div>
  );
};

export default AlertKpiGrid;
