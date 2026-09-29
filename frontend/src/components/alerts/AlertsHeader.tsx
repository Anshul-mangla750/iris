import React from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

interface AlertsHeaderProps {
  dateRange: 'today' | '7days' | '30days';
  onDateRangeChange: (range: 'today' | '7days' | '30days') => void;
  onMarkAllRead: () => void;
  unreadCount?: number;
}

export const AlertsHeader: React.FC<AlertsHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onMarkAllRead,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Alerts & Notifications
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
          Get real-time alerts and actionable insights to keep your store running smoothly.
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Today, 24 Sep 2024</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
        </div>

        {/* Range Toggle Pills */}
        <div className="flex items-center p-0.5 bg-slate-100/90 rounded-lg border border-slate-200/60 text-xs">
          <button
            type="button"
            onClick={() => onDateRangeChange('today')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              dateRange === 'today'
                ? 'bg-[#dcfce7] text-[#15803d] font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onDateRangeChange('7days')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              dateRange === '7days'
                ? 'bg-[#dcfce7] text-[#15803d] font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => onDateRangeChange('30days')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              dateRange === '30days'
                ? 'bg-[#dcfce7] text-[#15803d] font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
        </div>

        {/* Mark All Read Button */}
        <button
          type="button"
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f8f0] hover:bg-[#d2f3e2] text-[#0fa968] border border-[#a7f3d0] rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Mark All Read</span>
        </button>
      </div>
    </div>
  );
};

export default AlertsHeader;
