import React, { useState } from 'react';
import { Calendar, ChevronDown, Download } from 'lucide-react';
import type { QueueTimeRangeFilter } from '../../hooks/useQueueAnalytics';

interface QueueHeaderProps {
  dateFormatted?: string;
  timeRange: QueueTimeRangeFilter;
  onSelectTimeRange: (range: QueueTimeRangeFilter) => void;
  selectedCounter: string;
  onSelectCounter: (counter: string) => void;
  onExport?: () => void;
}

export const QueueHeader: React.FC<QueueHeaderProps> = ({
  dateFormatted = 'Today, 24 Sep 2024',
  timeRange,
  onSelectTimeRange,
  selectedCounter,
  onSelectCounter,
  onExport,
}) => {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [counterDropdownOpen, setCounterDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Queue Intelligence
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
          Monitor queue length, waiting time and predict congestion in real-time.
        </p>
      </div>

      {/* Right Controls: Date Selector + Time Range Pills + Counter Filter */}
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

        {/* Counter Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCounterDropdownOpen(!counterDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:border-slate-300 shadow-2xs transition-colors"
          >
            <span>{selectedCounter === 'all' ? 'All Counters' : selectedCounter}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {counterDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
              <button
                type="button"
                onClick={() => {
                  onSelectCounter('all');
                  setCounterDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                  selectedCounter === 'all' ? 'text-[#0fa968] font-bold bg-emerald-50/50' : 'text-slate-700'
                }`}
              >
                All Counters
              </button>
              {['Counter 1', 'Counter 2', 'Counter 3', 'Counter 4', 'Counter 5'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onSelectCounter(c);
                    setCounterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                    selectedCounter === c ? 'text-[#0fa968] font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export CSV Button */}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QueueHeader;
