import React, { useState } from 'react';
import { Calendar, ChevronDown, Plus, Search } from 'lucide-react';

interface CameraPageHeaderProps {
  dateRange: 'live' | 'today' | '7days' | '30days';
  onDateRangeChange: (range: 'live' | 'today' | '7days' | '30days') => void;
  onAddCamera: () => void;
  search?: string;
  onSearchChange?: (val: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: any) => void;
}

export const CameraPageHeader: React.FC<CameraPageHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onAddCamera,
  search = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
}) => {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    () => 'Today, ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  );

  const dateOptions = [
    'Today, 24 Sep 2024',
    'Yesterday, 23 Sep 2024',
    '22 Sep 2024',
    'Custom Range...',
  ];

  return (
    <div className="flex flex-col gap-3 pb-3 sm:pb-3.5 border-b border-slate-200/80">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Camera Management
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
            Monitor live feeds, manage devices, and get AI-powered insights from your store cameras.
          </p>
        </div>

        {/* Right Controls: Date Picker, Period Toggles, + Add Camera */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Date Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedDate}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedDate(opt);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                      selectedDate === opt ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Period Pill Toggles: Live | 7 Days | 30 Days */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => onDateRangeChange('live')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                dateRange === 'live'
                  ? 'bg-[#e8f8f0] text-[#0fa968] font-bold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Live
            </button>
            <button
              type="button"
              onClick={() => onDateRangeChange('7days')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                dateRange === '7days'
                  ? 'bg-[#e8f8f0] text-[#0fa968] font-bold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => onDateRangeChange('30days')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                dateRange === '30days'
                  ? 'bg-[#e8f8f0] text-[#0fa968] font-bold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Primary Action Button: + Add Camera */}
          <button
            type="button"
            onClick={onAddCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0fa968] hover:bg-[#0c8f58] text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Camera</span>
          </button>
        </div>
      </div>

      {/* Interactive Camera Search & Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'ONLINE', 'OFFLINE'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange?.(status)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'ALL' ? 'All Cameras' : status === 'ONLINE' ? '● Online' : '○ Offline'}
            </button>
          ))}
        </div>

        {/* Camera Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search cameras by name, zone..."
            className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
      </div>
    </div>
  );
};

export default CameraPageHeader;
