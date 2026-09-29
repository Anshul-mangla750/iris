import React from 'react';
import PlanogramKpiCard from './PlanogramKpiCard';
import type { PlanogramOverview } from '../../types/planogram';

interface PlanogramKpiGridProps {
  overview: PlanogramOverview;
}

export const PlanogramKpiGrid: React.FC<PlanogramKpiGridProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-3.5">
      {/* 1. Overall Compliance */}
      <PlanogramKpiCard
        title="Overall Compliance"
        value={`${overview.overallCompliance}%`}
        trendText={`↑ ${overview.overallComplianceTrend}% vs yesterday`}
        trendColor="green"
        sparklineColor="#10B981"
        iconType="green-check"
      />

      {/* 2. Correctly Placed Products */}
      <PlanogramKpiCard
        title="Correctly Placed Products"
        value={overview.correctlyPlaced.toLocaleString()}
        trendText={`↑ ${overview.correctlyPlacedTrend}% vs yesterday`}
        trendColor="green"
        sparklineColor="#10B981"
        iconType="green-grid"
      />

      {/* 3. Misplaced Products */}
      <PlanogramKpiCard
        title="Misplaced Products"
        value={overview.misplacedProducts.toString()}
        trendText={`↓ ${Math.abs(overview.misplacedTrend)}% vs yesterday`}
        trendColor="red"
        sparklineColor="#EF4444"
        iconType="amber-warning"
      />

      {/* 4. Missing Products */}
      <PlanogramKpiCard
        title="Missing Products"
        value={overview.missingProducts.toString()}
        trendText={`↓ ${Math.abs(overview.missingTrend)}% vs yesterday`}
        trendColor="red"
        sparklineColor="#EF4444"
        iconType="red-package"
      />

      {/* 5. Extra / Unplanned Products */}
      <PlanogramKpiCard
        title="Extra / Unplanned Products"
        value={overview.extraProducts.toString()}
        trendText={`↓ ${Math.abs(overview.extraTrend)}% vs yesterday`}
        trendColor="red"
        sparklineColor="#EF4444"
        iconType="purple-extra"
      />
    </div>
  );
};

export default PlanogramKpiGrid;
