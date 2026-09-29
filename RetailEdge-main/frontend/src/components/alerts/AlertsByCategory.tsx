import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { AlertCategoryItem } from '../../types/alert';
import { ALERT_CATEGORIES_DATA } from '../../data/alertMockData';

interface AlertsByCategoryProps {
  categories?: AlertCategoryItem[];
  totalAlerts?: number;
}

export const AlertsByCategory: React.FC<AlertsByCategoryProps> = ({
  categories,
  totalAlerts = 28,
}) => {
  const safeCategories = Array.isArray(categories) && categories.length > 0
    ? categories
    : ALERT_CATEGORIES_DATA;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Alerts by Category
        </h3>
      </div>

      {/* Donut and Legend Layout */}
      <div className="flex items-center justify-between gap-2 h-[180px] sm:h-[190px]">
        {/* Donut container */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeCategories}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={65}
                paddingAngle={2}
                dataKey="count"
                strokeWidth={0}
                isAnimationActive={false}
              >
                {safeCategories.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as AlertCategoryItem;
                    return (
                      <div className="bg-slate-900/95 text-white p-2 rounded-lg text-[10.5px] shadow-lg border border-slate-800">
                        <div className="font-semibold text-slate-200">{data.name}</div>
                        <div className="text-emerald-400 font-bold">
                          {data.count} alerts ({data.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-black text-slate-900 leading-none">
              {totalAlerts}
            </span>
            <span className="text-[9.5px] font-medium text-slate-400 mt-0.5">
              Total Alerts
            </span>
          </div>
        </div>

        {/* Legend on Right Side */}
        <div className="flex-1 space-y-1.5 pl-2 min-w-0">
          {safeCategories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between text-[11px] text-slate-600 gap-1.5"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="truncate text-slate-700 font-medium">
                  {cat.name}
                </span>
              </div>
              <span className="text-slate-800 font-bold shrink-0 text-[10.5px]">
                {cat.count}{' '}
                <span className="text-slate-400 font-normal">({cat.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsByCategory;
