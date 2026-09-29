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
import { ChevronDown, Check } from 'lucide-react';
import type { DataSyncPoint } from '../../types/sync';

interface SyncOverviewChartProps {
  dataPoints: DataSyncPoint[];
  selectedRange?: string;
  onSelectRange?: (range: string) => void;
}

export const SyncOverviewChart: React.FC<SyncOverviewChartProps> = ({
  dataPoints,
  selectedRange = 'Last 7 Days',
  onSelectRange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ranges = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'This Month'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Card Header & Range Selector */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Data Sync Overview
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 bg-white hover:border-slate-300 text-[11px] font-medium transition-colors shadow-2xs"
          >
            <span>{selectedRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
              {ranges.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    if (onSelectRange) onSelectRange(r);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 text-[11px] ${
                    selectedRange === r ? 'text-emerald-600 font-semibold bg-emerald-50/40' : 'text-slate-700'
                  }`}
                >
                  <span>{r}</span>
                  {selectedRange === r && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0fa968]" />
          <span>POS Sales</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
          <span>Inventory Updates</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#eab308]" />
          <span>Product Data</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
          <span>Store Data</span>
        </div>
      </div>

      {/* Recharts Multi-line Chart */}
      <div className="flex-1 w-full h-[180px] min-h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataPoints}
            margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
              domain={[0, 2000]}
              ticks={[0, 500, 1000, 1500, 2000]}
              tickFormatter={(v) => (v >= 1000 ? `${v.toLocaleString()}` : `${v}`)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '11px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: any, name: any) => {
                const labels: Record<string, string> = {
                  posSales: 'POS Sales',
                  inventoryUpdates: 'Inventory Updates',
                  productData: 'Product Data',
                  storeData: 'Store Data',
                };
                return [Number(value).toLocaleString(), labels[name] || name];
              }}
            />
            {/* 4 Line Series matching the screenshot */}
            <Line
              type="monotone"
              dataKey="posSales"
              stroke="#0fa968"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0fa968', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="inventoryUpdates"
              stroke="#0284c7"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0284c7', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="productData"
              stroke="#eab308"
              strokeWidth={2}
              dot={{ r: 3, fill: '#eab308', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="storeData"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SyncOverviewChart;
