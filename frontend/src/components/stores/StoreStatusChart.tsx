import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { StoreStatusDistributionItem } from '../../types/store';
import { STORE_STATUS_DISTRIBUTION } from '../../data/storeMockData';

interface StoreStatusChartProps {
  data?: StoreStatusDistributionItem[];
  totalStores?: number;
}

export const StoreStatusChart: React.FC<StoreStatusChartProps> = ({
  data,
  totalStores = 12,
}) => {
  const safeData = Array.isArray(data) && data.length > 0 ? data : STORE_STATUS_DISTRIBUTION;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-100">
        <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight">
          Store Status
        </h3>
      </div>

      {/* Donut and Legend */}
      <div className="flex items-center justify-between gap-2 h-[105px]">
        {/* Donut */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={42}
                paddingAngle={2}
                dataKey="count"
                strokeWidth={0}
                isAnimationActive={false}
              >
                {safeData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as StoreStatusDistributionItem;
                    return (
                      <div className="bg-slate-900/95 text-white p-1.5 rounded-md text-[10px] shadow-lg border border-slate-800">
                        <div className="font-semibold text-slate-200">{d.name}</div>
                        <div className="text-emerald-400 font-bold">
                          {d.count} stores ({d.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg font-black text-slate-900 leading-none">
              {totalStores}
            </span>
            <span className="text-[8px] font-medium text-slate-400 mt-0.5">
              Total Stores
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1 pl-1 min-w-0">
          {safeData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-[10px] text-slate-600 gap-1.5"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-slate-700 font-medium">
                  {item.name}
                </span>
              </div>
              <span className="text-slate-800 font-bold shrink-0 text-[10px]">
                {item.count}{' '}
                <span className="text-slate-400 font-normal">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreStatusChart;
