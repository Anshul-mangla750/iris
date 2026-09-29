import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { WaitTimeBucket } from '../../types/queue';

interface WaitTimeDistributionProps {
  data: WaitTimeBucket[];
  loading?: boolean;
}

export const WaitTimeDistribution: React.FC<WaitTimeDistributionProps> = ({ data, loading }) => {
  const [filter, setFilter] = useState('Today');

  return (
    <DashboardCard
      title="Wait Time Distribution"
      className="h-full"
      loading={loading}
      headerAction={
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
        <div className="h-44 sm:h-48 w-full">
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={data} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
                unit="%"
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                <LabelList
                  dataKey="percentage"
                  position="top"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => `${val}%`}
                  style={{ fill: '#334155', fontSize: '10px', fontWeight: 'bold' }}
                />
                {data.map((entry) => (
                  <Cell key={entry.range} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
};

export default WaitTimeDistribution;
