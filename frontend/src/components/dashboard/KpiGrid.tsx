import React from 'react';
import type { KpiItem } from '../../types/dashboard';
import KpiCard from './KpiCard';

export interface KpiGridProps {
  kpis: KpiItem[];
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 w-full min-w-0 mb-3.5 select-none">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} item={kpi} />
      ))}
    </div>
  );
};

export default KpiGrid;
