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
import type { AlertTrendPoint } from '../../types/alert';
import { ALERT_TREND_DATA } from '../../data/alertMockData';

interface AlertTrendProps {
  data?: AlertTrendPoint[];
}

export const AlertTrend: React.FC<AlertTrendProps> = ({ data }) => {
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 24 Hours');

  const safeData = Array.isArray(data) && data.length > 0 ? data : ALERT_TREND_DATA;

  // Filter X-axis labels to match reference ticks: 6AM, 9AM, 12PM, 3PM, 6PM, 9PM
  const keyTicks = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header with Title, Legend and Dropdown */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Alert Trend
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>Info</span>
          </div>
        </div>

        {/* Range Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 hover:border-slate-300 shadow-2xs"
          >
            <span>{selectedRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {rangeDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-[11px]">
              {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRange(r);
                    setRangeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1 hover:bg-slate-50 transition-colors ${
                    selectedRange === r ? 'text-emerald-600 font-bold' : 'text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[180px] sm:h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={safeData}
            margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              fontSize={10.5}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              ticks={keyTicks}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={10.5}
              tickLine={false}
              axisLine={false}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/95 text-white p-2 rounded-lg text-[10.5px] shadow-lg border border-slate-800 space-y-1">
                      <div className="font-semibold text-slate-300 border-b border-slate-700 pb-0.5">
                        {label}
                      </div>
                      {payload.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="capitalize">{entry.name}:</span>
                          </span>
                          <span className="font-bold">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Critical Line (Red) */}
            <Line
              type="monotone"
              dataKey="critical"
              name="Critical"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#EF4444', stroke: '#fff', strokeWidth: 1 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            {/* Warning Line (Amber) */}
            <Line
              type="monotone"
              dataKey="warning"
              name="Warning"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#F59E0B', stroke: '#fff', strokeWidth: 1 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            {/* Info Line (Blue) */}
            <Line
              type="monotone"
              dataKey="info"
              name="Info"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 1 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AlertTrend;
