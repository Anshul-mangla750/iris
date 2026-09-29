import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { FootfallPoint } from '../../types/dashboard';

export interface FootfallTrendProps {
  data: FootfallPoint[];
}

export const FootfallTrend: React.FC<FootfallTrendProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<'Today' | 'Yesterday' | 'This Week'>('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const headerAction = (
    <div className="flex items-center gap-3">
      {/* Legend */}
      <div className="flex items-center gap-2.5 text-[10.5px]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#0fa968]" />
          <span className="text-slate-600 font-medium">Today</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-slate-400 font-normal">Yesterday</span>
        </div>
      </div>

      {/* Timeframe Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <span>{timeframe}</span>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-[10.5px] w-24">
            {(['Today', 'Yesterday', 'This Week'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTimeframe(t);
                  setDropdownOpen(false);
                }}
                className={`w-full px-2.5 py-1 text-left ${
                  timeframe === t ? 'bg-emerald-50 text-[#0fa968] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardCard title="Footfall Trend" headerAction={headerAction} className="h-full">
      <div className="w-full h-44 sm:h-48 pt-2">
        <ResponsiveContainer width="100%" height={165}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="footfallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0fa968" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0fa968" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9.5, fill: '#94a3b8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9.5, fill: '#94a3b8' }}
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            {/* Yesterday Line (Muted Gray Dashed) */}
            <Line
              type="monotone"
              dataKey="yesterday"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              isAnimationActive={false}
            />
            {/* Today Area & Line (Vibrant Green) */}
            <Area
              type="monotone"
              dataKey="today"
              stroke="#0fa968"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#footfallGrad)"
              dot={{ r: 3, fill: '#0fa968', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 5, fill: '#0fa968' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default FootfallTrend;
