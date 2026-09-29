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
import DashboardCard from '../dashboard/DashboardCard';
import type { ShopperFootfallPoint } from '../../types/shopper';

interface ShopperFootfallTrendProps {
  data: ShopperFootfallPoint[];
  loading?: boolean;
}

export const ShopperFootfallTrend: React.FC<ShopperFootfallTrendProps> = ({
  data,
  loading,
}) => {
  const [interval, setInterval] = useState<'Hourly' | 'Daily'>('Hourly');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DashboardCard
      title="Footfall Trend"
      headerAction={
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0fa968] inline-block" />
              Today
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
              Yesterday
            </span>
          </div>

          {/* Interval Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <span>{interval}</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setInterval('Hourly');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 hover:bg-slate-50 font-medium"
                >
                  Hourly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInterval('Daily');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 hover:bg-slate-50 font-medium"
                >
                  Daily
                </button>
              </div>
            )}
          </div>
        </div>
      }
      loading={loading}
    >
      <div className="w-full h-44 sm:h-48 pt-2">
        <ResponsiveContainer width="100%" height={165}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="shopperFootfallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0fa968" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0fa968" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              domain={[0, 250]}
              ticks={[0, 50, 100, 150, 200, 250]}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any, name: any) => [
                `${val} shoppers`,
                name === 'today' ? 'Today' : 'Yesterday',
              ]}
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
              fill="url(#shopperFootfallGrad)"
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

export default ShopperFootfallTrend;
