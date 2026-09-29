import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import DashboardCard from '../dashboard/DashboardCard';
import type { InventoryStatusSegment } from '../../types/inventory';

interface InventoryStatusDistributionProps {
  totalProducts?: number;
  segments: InventoryStatusSegment[];
  loading?: boolean;
}

export const InventoryStatusDistribution: React.FC<InventoryStatusDistributionProps> = ({
  totalProducts = 1248,
  segments,
  loading,
}) => {
  return (
    <DashboardCard title="Inventory Status Distribution" className="h-full" loading={loading}>
      <div className="flex items-center justify-between gap-2 h-40 sm:h-44 pt-1">
        {/* Donut Chart with Centered Total Callout */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={58}
                paddingAngle={2}
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

          {/* Centered Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center leading-none">
            <span className="text-[16px] sm:text-[18px] font-black text-slate-800 tracking-tight">
              {totalProducts.toLocaleString()}
            </span>
            <span className="text-[9.5px] font-semibold text-slate-400 mt-1">
              Total Products
            </span>
          </div>
        </div>

        {/* Legend Right Aligned */}
        <div className="space-y-2.5 shrink-0 pr-2 text-[11px]">
          {segments.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 min-w-[70px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium whitespace-nowrap">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800 text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default InventoryStatusDistribution;
