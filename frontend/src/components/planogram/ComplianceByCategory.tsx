import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import type { CategoryComplianceItem } from '../../types/planogram';

interface ComplianceByCategoryProps {
  categories: CategoryComplianceItem[];
  loading?: boolean;
}

export const ComplianceByCategory: React.FC<ComplianceByCategoryProps> = ({
  categories,
  loading,
}) => {
  return (
    <DashboardCard title="Compliance by Category" className="h-full" loading={loading}>
      <div className="space-y-1.5 pt-0.5">
        {categories.map((item) => (
          <div key={item.category} className="flex items-center gap-2.5 text-[11px]">
            <span className="w-22 text-slate-700 font-medium truncate shrink-0">
              {item.category}
            </span>

            {/* Progress bar */}
            <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100 flex items-center">
              <div
                className={`h-full rounded-full transition-all ${
                  item.percentage < 92 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                }`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            <span className="w-8 text-right font-bold text-slate-800 shrink-0">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default ComplianceByCategory;
