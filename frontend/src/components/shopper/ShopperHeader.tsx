import React, { useState } from 'react';
import { Calendar, ChevronDown, Video, Download } from 'lucide-react';
import type { TimeRangeFilter } from '../../types/shopper';

interface ShopperHeaderProps {
  dateFormatted?: string;
  timeRange: TimeRangeFilter;
  onSelectTimeRange: (range: TimeRangeFilter) => void;
  onOpenLiveView: () => void;
  onExport?: () => void;
}

export const ShopperHeader: React.FC<ShopperHeaderProps> = ({
  dateFormatted,
  timeRange,
  onSelectTimeRange,
  onOpenLiveView,
  onExport,
}) => {
  const defaultDate =
    dateFormatted ||
    new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(defaultDate);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5 select-none">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Shopper Analytics
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
          Understand customer behavior, footfall traffic, and zone dwell times in real-time.
        </p>
      </div>

      {/* Right Controls: Date Selector + Time Range Pills + Live View Button */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Date Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:border-slate-300 shadow-2xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDate}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
              {['Today, 24 Sep 2024', 'Yesterday, 23 Sep 2024', 'Last 7 Days', 'Last 30 Days'].map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => {
                    setCurrentDate(date);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                    currentDate === date ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  {date}
                </button>
              ))}
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

        {/* Export Data Button */}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        )}

        {/* Live View Button */}
        <button
          type="button"
          onClick={onOpenLiveView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0fa968] border border-emerald-200/80 hover:bg-emerald-100 font-bold text-xs shadow-2xs transition-colors"
        >
          <Video className="w-3.5 h-3.5 text-[#0fa968]" />
          <span>Live View</span>
        </button>
      </div>
    </div>
  );
};

export default ShopperHeader;
