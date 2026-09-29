import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import DashboardCard from '../dashboard/DashboardCard';
import type { CustomerTypeSegment } from '../../types/shopper';

interface RepeatVsNewCustomersProps {
  totalUnique?: number;
  segments: CustomerTypeSegment[];
  loading?: boolean;
  className?: string;
}

export const RepeatVsNewCustomers: React.FC<RepeatVsNewCustomersProps> = ({
  totalUnique = 1126,
  segments,
  loading,
  className = '',
}) => {
  const newSegment = segments.find((s) => s.name.toLowerCase().includes('new')) || segments[0];
  const returningSegment =
    segments.find((s) => s.name.toLowerCase().includes('return') || s.name.toLowerCase().includes('repeat')) ||
    segments[1];

  return (
    <DashboardCard
      title="Repeat vs New Customers"
      className={`h-full flex flex-col ${className}`}
      bodyClassName="flex-1 flex flex-col justify-between p-3.5 sm:p-4 min-w-0"
      loading={loading}
    >
      {/* Top Section: Donut Chart & Legend */}
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* Donut Chart with Centered Total Callout */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={50}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
              >
                {segments.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any, name: any) => [
                  `${val} (${segments.find((s) => s.name === name)?.percentage}%)`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center leading-none">
            <span className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
              {totalUnique.toLocaleString()}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
              Unique
            </span>
          </div>
        </div>

        {/* Legend Flexibly Formatted without Overflows */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 pl-1">
          {segments.map((item) => (
            <div
              key={item.name}
              className="p-2 rounded-lg bg-slate-50 border border-slate-100/80 flex items-center justify-between gap-1.5 min-w-0"
            >
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="text-slate-700 font-semibold text-[11px] truncate"
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1 shrink-0 text-right">
                <span className="font-bold text-slate-900 text-xs">{item.percentage}%</span>
                <span className="text-[10px] text-slate-400 font-medium">({item.value})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Retention Bar: Fits Card Height Perfectly & Prevents Vertical Gaps */}
      <div className="pt-3 mt-3 border-t border-slate-100 min-w-0">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
          <span className="font-medium text-slate-600">Customer Ratio Breakdown</span>
          <span className="font-bold text-emerald-600 text-xs">
            {returningSegment?.percentage || 32}% Returning
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${newSegment?.percentage || 68}%` }}
            title={`${newSegment?.name}: ${newSegment?.percentage}%`}
          />
          <div
            className="h-full bg-emerald-300 transition-all duration-300"
            style={{ width: `${returningSegment?.percentage || 32}%` }}
            title={`${returningSegment?.name}: ${returningSegment?.percentage}%`}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
            {newSegment?.value || 766} New
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
            {returningSegment?.value || 360} Repeat
          </span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default RepeatVsNewCustomers;
