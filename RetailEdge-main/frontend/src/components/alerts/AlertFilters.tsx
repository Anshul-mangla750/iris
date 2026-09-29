import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { AlertFilters as FilterStateType, AlertSeverity, AlertSourceModule, AlertStatus } from '../../types/alert';

interface AlertFiltersProps {
  pendingFilters: FilterStateType;
  onChangePending: <K extends keyof FilterStateType>(key: K, value: FilterStateType[K]) => void;
  onReset: () => void;
  onApply: () => void;
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  pendingFilters,
  onChangePending,
  onReset,
  onApply,
}) => {
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

  const toggleSeverity = (sev: AlertSeverity) => {
    const current = pendingFilters.severity || [];
    const updated = current.includes(sev)
      ? current.filter((s) => s !== sev)
      : [...current, sev];
    onChangePending('severity', updated);
  };

  const toggleCategory = (cat: AlertSourceModule) => {
    const current = pendingFilters.category || [];
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onChangePending('category', updated);
  };

  const toggleStatus = (st: AlertStatus) => {
    const current = pendingFilters.status || [];
    const updated = current.includes(st)
      ? current.filter((s) => s !== st)
      : [...current, st];
    onChangePending('status', updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
            Filters
          </h3>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* 1. Alert Type */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Alert Type
          </div>
          <div className="space-y-1.5">
            {[
              { key: 'CRITICAL' as AlertSeverity, label: 'Critical', color: '#EF4444' },
              { key: 'WARNING' as AlertSeverity, label: 'Warning', color: '#F59E0B' },
              { key: 'INFO' as AlertSeverity, label: 'Info', color: '#3B82F6' },
            ].map(({ key, label, color }) => {
              const checked = pendingFilters.severity?.includes(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer select-none text-[11.5px] text-slate-700 hover:text-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => toggleSeverity(key)}
                    className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all border shrink-0"
                    style={{
                      borderColor: color,
                      backgroundColor: checked ? color : '#FFFFFF',
                    }}
                  >
                    {checked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </button>
                  <span className="font-medium">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 2. Category */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Category
          </div>
          <div className="space-y-1.5">
            {[
              { key: 'INVENTORY' as AlertSourceModule, label: 'Inventory', color: '#10B981' },
              { key: 'QUEUE' as AlertSourceModule, label: 'Queue', color: '#F59E0B' },
              { key: 'PLANOGRAM' as AlertSourceModule, label: 'Planogram', color: '#3B82F6' },
              { key: 'SHOPPER' as AlertSourceModule, label: 'Customer Behavior', color: '#8B5CF6' },
              { key: 'SYSTEM' as AlertSourceModule, label: 'System', color: '#64748B' },
            ].map(({ key, label, color }) => {
              const checked = pendingFilters.category?.includes(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer select-none text-[11.5px] text-slate-700 hover:text-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(key)}
                    className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all border shrink-0"
                    style={{
                      borderColor: color,
                      backgroundColor: checked ? color : '#FFFFFF',
                    }}
                  >
                    {checked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </button>
                  <span className="font-medium">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Status */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Status
          </div>
          <div className="space-y-1.5">
            {[
              { key: 'OPEN' as AlertStatus, label: 'Open', color: '#EF4444' },
              { key: 'ACKNOWLEDGED' as AlertStatus, label: 'In Progress', color: '#F59E0B' },
              { key: 'RESOLVED' as AlertStatus, label: 'Resolved', color: '#10B981' },
              { key: 'IGNORED' as AlertStatus, label: 'Ignored', color: '#64748B' },
            ].map(({ key, label, color }) => {
              const checked = pendingFilters.status?.includes(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer select-none text-[11.5px] text-slate-700 hover:text-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => toggleStatus(key)}
                    className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all border shrink-0"
                    style={{
                      borderColor: color,
                      backgroundColor: checked ? color : '#FFFFFF',
                    }}
                  >
                    {checked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </button>
                  <span className="font-medium">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. Time Range */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Time Range
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs"
            >
              <span>{pendingFilters.timeRange === '24h' ? 'Last 24 Hours' : pendingFilters.timeRange}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {timeDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {[
                  { value: '24h', label: 'Last 24 Hours' },
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      onChangePending('timeRange', item.value);
                      setTimeDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-slate-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. Store */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Store
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs"
            >
              <span>
                {pendingFilters.storeId === 'all' ? 'All Stores' : pendingFilters.storeId}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {storeDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {[
                  { value: 'all', label: 'All Stores' },
                  { value: 'str-001', label: 'Store 001 - City Mall, Delhi' },
                  { value: 'str-002', label: 'Store 002 - Phoenix Marketcity, Mumbai' },
                  { value: 'str-003', label: 'Store 003 - Forum Mall, Bengaluru' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      onChangePending('storeId', item.value);
                      setStoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-slate-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="pt-4 mt-2">
        <button
          type="button"
          onClick={onApply}
          className="w-full py-2 bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-bold rounded-lg shadow-2xs transition-all active:scale-[0.98]"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AlertFilters;
