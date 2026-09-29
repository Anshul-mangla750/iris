import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { FootfallByHourPoint } from '../../types/dashboard';

interface FootfallByHourProps {
  data: FootfallByHourPoint[];
  loading?: boolean;
}

export const FootfallByHour: React.FC<FootfallByHourProps> = ({ data, loading }) => {
  const [timeFilter] = useState('Today');

  return (
    <DashboardCard
      title="Footfall by Hour"
      headerAction={
        <div className="relative">
          <button className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-md transition-colors">
            <span>{timeFilter}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      }
      loading={loading}
    >
      <div className="h-[155px] w-full pt-1">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              domain={[0, 300]}
              ticks={[0, 100, 200, 300]}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any) => [`${val} visitors`, 'Footfall']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '11px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '4px 8px',
              }}
            />
            <Line
              type="linear"
              dataKey="visitors"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3.5, fill: '#10B981', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default FootfallByHour;
