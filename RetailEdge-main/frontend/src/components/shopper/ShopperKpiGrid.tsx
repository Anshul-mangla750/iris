import React from 'react';
import type { ShopperKpiItem } from '../../types/shopper';
import ShopperKpiCard from './ShopperKpiCard';

interface ShopperKpiGridProps {
  kpis: ShopperKpiItem[];
}

export const ShopperKpiGrid: React.FC<ShopperKpiGridProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3.5 select-none">
      {kpis.map((kpi) => (
        <ShopperKpiCard key={kpi.id} item={kpi} />
      ))}
    </div>
  );
};

export default ShopperKpiGrid;
