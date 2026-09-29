import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { SalesFootfallPoint } from '../../types/dashboard';

interface SalesFootfallCorrelationProps {
  data: SalesFootfallPoint[];
  loading?: boolean;
  className?: string;
}

export const SalesFootfallCorrelation: React.FC<SalesFootfallCorrelationProps> = ({
  data,
  loading,
  className = '',
}) => {
  const [range] = useState('Last 7 Days');

  return (
    <DashboardCard
      title="Sales vs Footfall Correlation"
      className={`h-full flex flex-col ${className}`}
      bodyClassName="flex-1 flex flex-col justify-center items-center"
      headerAction={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Footfall
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              Sales (₹)
            </span>
          </div>
          <button className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-md transition-colors">
            <span>{range}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      }
      loading={loading}
    >
      <div className="w-full flex-1 flex flex-col items-center justify-center my-auto min-h-[190px] pt-1">
        <ResponsiveContainer width="100%" height={190}>
          <ComposedChart data={data} margin={{ top: 12, right: 6, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              tick={{ fontSize: 9, fill: '#64748b' }}
            />
            {/* Left Y-Axis for Footfall */}
            <YAxis
              yAxisId="footfall"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
            />
            {/* Right Y-Axis for Sales */}
            <YAxis
              yAxisId="sales"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              domain={[0, 60000]}
              ticks={[0, 20000, 40000, 60000]}
              tickFormatter={(val: number) => (val === 0 ? '0' : `${val / 1000}K`)}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any, name: any) => {
                if (name === 'footfall') return [`${val} visitors`, 'Footfall'];
                return [`₹${Number(val).toLocaleString()}`, 'Sales'];
              }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '11px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '4px 8px',
              }}
            />
            <Bar
              yAxisId="footfall"
              dataKey="footfall"
              fill="#6EE7B7"
              radius={[3, 3, 0, 0]}
              barSize={18}
              isAnimationActive={false}
            />
            <Line
              yAxisId="sales"
              type="linear"
              dataKey="sales"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 3, fill: '#2563EB', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#2563EB', stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default SalesFootfallCorrelation;
