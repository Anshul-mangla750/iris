import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { CustomerDistributionItem } from '../../types/dashboard';

export interface CustomerDistributionProps {
  totalVisitors?: number;
  items: CustomerDistributionItem[];
}

export const CustomerDistribution: React.FC<CustomerDistributionProps> = ({
  totalVisitors = 1482,
  items,
}) => {
  const [filter, setFilter] = useState<'By Gender' | 'By Age Group'>('By Gender');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const headerAction = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
      >
        <span>{filter}</span>
        <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-[10.5px] w-28">
          {(['By Gender', 'By Age Group'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setDropdownOpen(false);
              }}
              className={`w-full px-2.5 py-1 text-left ${
                filter === f ? 'bg-emerald-50 text-[#0fa968] font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DashboardCard title="Customer Distribution" headerAction={headerAction} className="h-full">
      <div className="flex items-center justify-between gap-3 h-44 sm:h-48 pt-1">
        {/* Left / Center: Donut Chart with Embedded Center Label */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={64}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {items.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Embedded Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[17px] font-black text-slate-900 leading-tight">
              {totalVisitors.toLocaleString()}
            </span>
            <span className="text-[9.5px] text-slate-400 font-normal leading-tight">
              Visitors
            </span>
          </div>
        </div>

        {/* Right Side Legend */}
        <div className="space-y-2.5 shrink-0 pr-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium text-[11px]">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900 text-[11.5px]">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default CustomerDistribution;
