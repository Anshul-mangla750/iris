import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { DwellTimePoint } from '../../types/dashboard';

interface DwellTimeByZoneProps {
  data: DwellTimePoint[];
  loading?: boolean;
}

export const DwellTimeByZone: React.FC<DwellTimeByZoneProps> = ({ data, loading }) => {
  const [timeRange] = useState('Today');

  return (
    <DashboardCard
      title="Dwell Time by Zone"
      headerAction={
        <div className="relative">
          <button className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-md transition-colors">
            <span>{timeRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      }
      loading={loading}
    >
      <div className="h-[155px] w-full pt-1">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data} margin={{ top: 16, right: 8, left: -22, bottom: 0 }} barSize={26}>
            <XAxis
              dataKey="zone"
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              domain={[0, 15]}
              ticks={[0, 5, 10, 15]}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any) => [`${val} min`, 'Avg Dwell']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '11px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '4px 8px',
              }}
            />
            <Bar dataKey="minutes" fill="#10B981" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="minutes"
                position="top"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => (typeof val === 'number' ? val.toFixed(1) : val)}
                style={{ fontSize: 9, fill: '#334155', fontWeight: 600 }}
                offset={4}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default DwellTimeByZone;
