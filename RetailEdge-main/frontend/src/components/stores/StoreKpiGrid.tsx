import React from 'react';
import { Store, AlertTriangle, Users, IndianRupee } from 'lucide-react';
import StoreKpiCard from './StoreKpiCard';
import type { StoreSummary } from '../../types/store';
import { formatCurrencyINR, formatNumberIN } from '../../utils/formatters';

interface StoreKpiGridProps {
  summary: StoreSummary;
}

export const StoreKpiGrid: React.FC<StoreKpiGridProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {/* 1. Total Stores */}
      <StoreKpiCard
        title="Total Stores"
        showGreenDot={true}
        value={summary.totalStores}
        trend="↑ 20%"
        trendColor="text-emerald-500"
        icon={Store}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10B981"
        sparklinePoints={[8, 9, 9, 10, 11, 11, 12]}
      />

      {/* 2. Active Stores */}
      <StoreKpiCard
        title="Active Stores"
        value={summary.activeStores}
        trend="↑ 10%"
        trendColor="text-emerald-500"
        icon={Store}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10B981"
        sparklinePoints={[8, 8, 9, 10, 10, 11, 11]}
      />

      {/* 3. Stores with Alerts */}
      <StoreKpiCard
        title="Stores with Alerts"
        value={summary.storesWithAlerts}
        trend="↓ 40%"
        trendColor="text-red-500"
        icon={AlertTriangle}
        iconBg="bg-red-50"
        iconColor="text-red-500"
        sparklineColor="#EF4444"
        sparklinePoints={[6, 5, 5, 4, 4, 3, 3]}
      />

      {/* 4. Avg. Store Footfall */}
      <StoreKpiCard
        title="Avg. Store Footfall"
        value={formatNumberIN(summary.averageFootfall)}
        trend="↑ 12%"
        trendColor="text-emerald-500"
        icon={Users}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
        sparklineColor="#10B981"
        sparklinePoints={[2200, 2400, 2350, 2600, 2750, 2700, 2854]}
      />

      {/* 5. Avg. Sales per Store */}
      <StoreKpiCard
        title="Avg. Sales per Store"
        value={formatCurrencyINR(summary.averageSalesPerStore)}
        trend="↑ 8%"
        trendColor="text-emerald-500"
        icon={IndianRupee}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10B981"
        sparklinePoints={[380000, 395000, 390000, 410000, 415000, 420000, 428760]}
      />
    </div>
  );
};

export default StoreKpiGrid;
