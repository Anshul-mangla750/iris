import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { ShelfComplianceTrendPoint } from '../../types/planogram';

interface ShelfComplianceTrendProps {
  data: ShelfComplianceTrendPoint[];
  loading?: boolean;
}

export const ShelfComplianceTrend: React.FC<ShelfComplianceTrendProps> = ({ data, loading }) => {
  const [range, setRange] = useState('Last 7 Days');

  return (
    <DashboardCard
      title="Shelf Compliance Trend"
      className="h-full"
      loading={loading}
      headerAction={
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
      }
    >
      <div className="w-full pt-1">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] mb-2 font-medium">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Overall
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            Correct
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Misplaced
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Missing
          </span>
        </div>

        {/* Chart */}
        <div className="h-44 sm:h-48 w-full">
          <ResponsiveContainer width="100%" height={165}>
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              />
              <Area
                type="monotone"
                dataKey="overall"
                fill="#10B981"
                fillOpacity={0.12}
                stroke="transparent"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="overall"
                name="Overall"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10B981' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="correct"
                name="Correct"
                stroke="#059669"
                strokeWidth={1.8}
                dot={{ r: 2.5, fill: '#059669' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="misplaced"
                name="Misplaced"
                stroke="#F59E0B"
                strokeWidth={1.8}
                dot={{ r: 2.5, fill: '#F59E0B' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="missing"
                name="Missing"
                stroke="#EF4444"
                strokeWidth={1.8}
                dot={{ r: 2.5, fill: '#EF4444' }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
};

export default ShelfComplianceTrend;
