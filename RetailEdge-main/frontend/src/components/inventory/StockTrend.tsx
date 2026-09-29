import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { StockTrendPoint } from '../../types/inventory';

interface StockTrendProps {
  data: StockTrendPoint[];
  loading?: boolean;
}

export const StockTrend: React.FC<StockTrendProps> = ({ data, loading }) => {
  const [range, setRange] = useState('Last 7 Days');

  return (
    <DashboardCard
      title="Stock Trend"
      className="h-full"
      loading={loading}
      action={
        <div className="flex items-center gap-3">
          {/* Custom inline Legend */}
          <div className="hidden sm:flex items-center gap-2.5 text-[10.5px]">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              In Stock
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              Low Stock
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              Out of Stock
            </span>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 14 Days">Last 14 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      }
    >
      <div className="h-40 sm:h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height={165}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              domain={[0, 1200]}
              ticks={[0, 400, 800, 1200]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '6px',
                fontSize: '11px',
              }}
            />
            <Line
              type="monotone"
              dataKey="inStock"
              name="In Stock"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3, fill: '#10B981' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="lowStock"
              name="Low Stock"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 3, fill: '#F59E0B' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="outOfStock"
              name="Out of Stock"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 3, fill: '#EF4444' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default StockTrend;
