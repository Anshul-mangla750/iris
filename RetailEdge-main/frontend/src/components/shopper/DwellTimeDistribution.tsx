import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';
import DashboardCard from '../dashboard/DashboardCard';
import type { DwellTimeBucket } from '../../types/shopper';

interface DwellTimeDistributionProps {
  data: DwellTimeBucket[];
  loading?: boolean;
}

export const DwellTimeDistribution: React.FC<DwellTimeDistributionProps> = ({
  data,
  loading,
}) => {
  return (
    <DashboardCard title="Dwell Time Distribution" className="h-full" loading={loading}>
      <div className="h-40 sm:h-44 pt-1 w-full">
        <ResponsiveContainer width="100%" height={145}>
          <BarChart data={data} margin={{ top: 16, right: 8, left: -24, bottom: 0 }} barSize={22}>
            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              tick={{ fontSize: 9, fill: '#64748b' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 8, fill: '#94a3b8' }}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any) => [`${val}%`, 'Share']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '11px',
                padding: '4px 8px',
              }}
            />
            <Bar dataKey="percentage" fill="#10B981" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="top"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => `${val}%`}
                style={{ fontSize: 8.5, fill: '#1e293b', fontWeight: 700 }}
                offset={4}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default DwellTimeDistribution;
