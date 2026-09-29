import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import type { PlanogramComparisonData } from '../../types/planogram';

interface PlanogramComparisonProps {
  data: PlanogramComparisonData;
  loading?: boolean;
}

export const PlanogramComparison: React.FC<PlanogramComparisonProps> = ({ data, loading }) => {
  return (
    <DashboardCard
      title="Planogram vs Actual"
      className="h-full"
      loading={loading}
      headerAction={
        <div className="flex items-center gap-2 sm:gap-2.5 text-[9.5px] font-medium">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Correct
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Misplaced
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Missing
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            Extra
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2.5 pt-0.5 h-full items-stretch">
        {/* Expected Planogram */}
        <div className="flex flex-col items-center justify-between gap-1.5">
          <div className="w-full rounded-md overflow-hidden border border-slate-200/90 bg-slate-100 flex-1 flex items-center justify-center">
            <img
              src={data.expectedImageUrl || '/images/planogram/expected_planogram.png'}
              alt="Expected Planogram"
              className="w-full h-auto object-cover block aspect-4/3"
            />
          </div>
          <span className="w-full py-1 text-center text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-200/60">
            Expected Planogram
          </span>
        </div>

        {/* Actual Shelf View */}
        <div className="flex flex-col items-center justify-between gap-1.5">
          <div className="w-full rounded-md overflow-hidden border border-slate-200/90 bg-slate-100 flex-1 flex items-center justify-center">
            <img
              src={data.actualImageUrl || '/images/planogram/actual_shelf.png'}
              alt="Actual Shelf View"
              className="w-full h-auto object-cover block aspect-4/3"
            />
          </div>
          <span className="w-full py-1 text-center text-[10px] font-bold text-slate-800 bg-slate-100 rounded border border-slate-200/80">
            Actual Shelf View
          </span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default PlanogramComparison;
