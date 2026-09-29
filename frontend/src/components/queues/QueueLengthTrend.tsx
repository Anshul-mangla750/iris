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
import type { QueueLengthTrendPoint } from '../../types/queue';

interface QueueLengthTrendProps {
  data: QueueLengthTrendPoint[];
  loading?: boolean;
}

export const QueueLengthTrend: React.FC<QueueLengthTrendProps> = ({ data, loading }) => {
  const [timeRange, setTimeRange] = useState('Today');

  return (
    <DashboardCard
      title="Queue Length Trend"
      className="h-full"
      loading={loading}
      headerAction={
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last 7 Days">Last 7 Days</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      }
    >
      <div className="w-full pt-1">
        {/* Custom Legend */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[10px] mb-2 font-medium">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Counter 1
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Counter 2
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            Counter 3
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Counter 4
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            Counter 5
          </span>
        </div>

        {/* Chart */}
        <div className="h-36 sm:h-40 w-full">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={[0, 20]}
                ticks={[0, 5, 10, 15, 20]}
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
                dataKey="counter1"
                name="Counter 1"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 3, fill: '#EF4444' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="counter2"
                name="Counter 2"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10B981' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="counter3"
                name="Counter 3"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3B82F6' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="counter4"
                name="Counter 4"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3, fill: '#F59E0B' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="counter5"
                name="Counter 5"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#8B5CF6' }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
};

export default QueueLengthTrend;
