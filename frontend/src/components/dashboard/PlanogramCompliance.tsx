import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardCard from './DashboardCard';
import type { PlanogramSummary } from '../../types/dashboard';

export interface PlanogramComplianceProps {
  data: PlanogramSummary;
  onViewDetails?: () => void;
}

export const PlanogramCompliance: React.FC<PlanogramComplianceProps> = ({
  data,
  onViewDetails,
}) => {
  const chartData = [
    { name: 'Correct', value: data.correct, color: '#0fa968' },
    { name: 'Misplaced', value: data.misplaced, color: '#f59e0b' },
    { name: 'Missing', value: data.missing, color: '#ef4444' },
  ];

  const headerAction = (
    <button
      type="button"
      onClick={onViewDetails}
      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
    >
      View Details
    </button>
  );

  return (
    <DashboardCard title="Planogram Compliance" headerAction={headerAction} className="h-full">
      <div className="flex items-center justify-between gap-2 h-36 pt-1">
        {/* Left: Donut Chart with Embedded 96% Center Label */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={50}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[17px] font-black text-slate-900 leading-tight">
              {data.compliancePercent}%
            </span>
          </div>
        </div>

        {/* Right: Legend Breakdown */}
        <div className="space-y-2 flex-1 pl-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0fa968]" />
              <span className="text-slate-600 font-medium">Correct</span>
            </div>
            <span className="font-bold text-slate-900">{data.correct}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-medium">Misplaced</span>
            </div>
            <span className="font-bold text-slate-900">{data.misplaced}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-slate-600 font-medium">Missing</span>
            </div>
            <span className="font-bold text-slate-900">{data.missing}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default PlanogramCompliance;
