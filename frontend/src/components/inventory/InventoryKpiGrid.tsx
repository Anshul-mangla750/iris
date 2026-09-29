import React from 'react';
import InventoryKpiCard from './InventoryKpiCard';
import type { InventoryOverview } from '../../types/inventory';

interface InventoryKpiGridProps {
  overview: InventoryOverview;
  onViewRestockList?: () => void;
}

export const InventoryKpiGrid: React.FC<InventoryKpiGridProps> = ({
  overview,
  onViewRestockList,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-3.5">
      {/* 1. Total Products */}
      <InventoryKpiCard
        title="Total Products"
        value={overview.totalProducts.toLocaleString()}
        trendText={`↑ ${overview.totalProductsTrend}%`}
        trendColor="green"
        sparklineColor="#10B981"
        iconType="blue-package"
      />

      {/* 2. In Stock */}
      <InventoryKpiCard
        title="In Stock"
        value={overview.inStock.count.toLocaleString()}
        secondaryValue={`(${overview.inStock.percentage}%)`}
        trendText={`↑ ${overview.inStock.trend}%`}
        trendColor="green"
        sparklineColor="#10B981"
        iconType="green-package"
      />

      {/* 3. Low Stock */}
      <InventoryKpiCard
        title="Low Stock"
        value={overview.lowStock.count.toLocaleString()}
        secondaryValue={`(${overview.lowStock.percentage}%)`}
        sparklineColor="#F59E0B"
        iconType="amber-package"
      />

      {/* 4. Out of Stock */}
      <InventoryKpiCard
        title="Out of Stock"
        value={overview.outOfStock.count.toLocaleString()}
        secondaryValue={`(${overview.outOfStock.percentage}%)`}
        trendText={`↓ ${Math.abs(overview.outOfStock.trend)}%`}
        trendColor="red"
        sparklineColor="#EF4444"
        iconType="red-package"
      />

      {/* 5. Planogram Compliance */}
      <InventoryKpiCard
        title="Planogram Compliance"
        value={`${overview.planogramCompliance.percentage}%`}
        trendText={`↑ ${overview.planogramCompliance.trend}%`}
        trendColor="green"
        sparklineColor="#10B981"
        iconType="green-check"
      />

      {/* 6. Restock Required */}
      <InventoryKpiCard
        title="Restock Required"
        value={overview.restockRequired.count.toString()}
        actionText="View List →"
        onActionClick={onViewRestockList}
        iconType="blue-truck"
      />
    </div>
  );
};

export default InventoryKpiGrid;
