import React, { useState } from 'react';
import { Calendar, ChevronDown, Download } from 'lucide-react';
import type { TimeRangeFilter } from '../../hooks/useInventory';

interface InventoryHeaderProps {
  dateFormatted?: string;
  timeRange: TimeRangeFilter;
  onSelectTimeRange: (range: TimeRangeFilter) => void;
  onExport: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  dateFormatted = 'Today, 24 Sep 2024',
  timeRange,
  onSelectTimeRange,
  onExport,
}) => {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5 select-none">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Inventory Management
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
          Real-time shelf monitoring, stock status and product analytics.
        </p>
      </div>

      {/* Right Controls: Date Selector + Time Range Pills + Export Button */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Date Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:border-slate-300 shadow-2xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateFormatted}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
              <button
                type="button"
                onClick={() => setDateDropdownOpen(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
              >
                Today, 24 Sep 2024
              </button>
              <button
                type="button"
                onClick={() => setDateDropdownOpen(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
              >
                Yesterday, 23 Sep 2024
              </button>
              <button
                type="button"
                onClick={() => setDateDropdownOpen(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
              >
                Last 7 Days
              </button>
            </div>
          )}
        </div>

        {/* Time Range Filter Pills */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => onSelectTimeRange('today')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              timeRange === 'today'
                ? 'bg-emerald-100 text-[#0fa968] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onSelectTimeRange('7d')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              timeRange === '7d'
                ? 'bg-emerald-100 text-[#0fa968] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => onSelectTimeRange('30d')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              timeRange === '30d'
                ? 'bg-emerald-100 text-[#0fa968] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0fa968] border border-emerald-200/80 hover:bg-emerald-100 font-bold text-xs shadow-2xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#0fa968]" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default InventoryHeader;
