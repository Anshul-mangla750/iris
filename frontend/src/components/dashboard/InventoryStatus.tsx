import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardCard from './DashboardCard';
import type { InventoryStatusSummary } from '../../types/dashboard';

export interface InventoryStatusProps {
  data: InventoryStatusSummary;
  onViewAll?: () => void;
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ data, onViewAll }) => {
  const chartData = [
    { name: 'In Stock', value: data.inStock.count, color: '#0fa968' },
    { name: 'Low Stock', value: data.lowStock.count, color: '#f59e0b' },
    { name: 'Out of Stock', value: data.outOfStock.count, color: '#ef4444' },
  ];

  const headerAction = (
    <button
      type="button"
      onClick={onViewAll}
      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
    >
      View All
    </button>
  );

  return (
    <DashboardCard title="Inventory Status" headerAction={headerAction} className="h-full">
      <div className="flex items-center justify-between gap-2 h-36 pt-1">
        {/* Left: Donut Chart with Embedded Center Count */}
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

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[15px] font-black text-slate-900 leading-tight">
              {data.totalProducts.toLocaleString()}
            </span>
            <span className="text-[8.5px] text-slate-400 font-normal leading-tight">
              Total Products
            </span>
          </div>
        </div>

        {/* Right: Legend Breakdown */}
        <div className="space-y-1.5 flex-1 pl-2">
          <div className="flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0fa968]" />
              <span className="text-slate-600 font-medium">In Stock</span>
            </div>
            <span className="font-bold text-slate-900">
              {data.inStock.count.toLocaleString()} ({data.inStock.percent}%)
            </span>
          </div>

          <div className="flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-medium">Low Stock</span>
            </div>
            <span className="font-bold text-slate-900">
              {data.lowStock.count} ({data.lowStock.percent}%)
            </span>
          </div>

          <div className="flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-slate-600 font-medium">Out of Stock</span>
            </div>
            <span className="font-bold text-slate-900">
              {data.outOfStock.count} ({data.outOfStock.percent}%)
            </span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default InventoryStatus;
