import React, { useState } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { QueueCounterItem } from '../../types/dashboard';

export interface QueueStatusProps {
  counters: QueueCounterItem[];
}

export const QueueStatus: React.FC<QueueStatusProps> = ({ counters }) => {
  const [filter, setFilter] = useState<'All Checkout Counters' | 'Active Only'>('All Checkout Counters');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const headerAction = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
      >
        <span>{filter}</span>
        <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-[10.5px] w-36">
          {(['All Checkout Counters', 'Active Only'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setDropdownOpen(false);
              }}
              className={`w-full px-2.5 py-1 text-left ${
                filter === f ? 'bg-emerald-50 text-[#0fa968] font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const getStatusBadge = (status: QueueCounterItem['status']) => {
    switch (status) {
      case 'High':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Normal':
        return 'bg-emerald-50 text-[#0fa968] border-emerald-200';
      case 'Open':
        return 'bg-teal-50 text-teal-600 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getBarColor = (status: QueueCounterItem['status']) => {
    switch (status) {
      case 'High':
        return 'bg-red-500';
      case 'Normal':
        return 'bg-[#0fa968]';
      case 'Open':
        return 'bg-teal-400';
      default:
        return 'bg-slate-300';
    }
  };

  const getIconBg = (status: QueueCounterItem['status']) => {
    switch (status) {
      case 'High':
        return 'bg-red-100 text-red-600';
      case 'Normal':
        return 'bg-emerald-100 text-[#0fa968]';
      case 'Open':
        return 'bg-teal-100 text-teal-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <DashboardCard title="Queue Status" headerAction={headerAction} className="h-full">
      <div className="space-y-2 pt-1">
        {counters.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-2.5 p-1 rounded-lg hover:bg-slate-50/70 transition-colors text-xs"
          >
            {/* Left: Counter Icon & Name */}
            <div className="flex items-center gap-1.5 w-24 shrink-0">
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${getIconBg(c.status)}`}>
                <Users className="w-3 h-3" />
              </div>
              <span className="font-bold text-slate-800 text-[11.5px] truncate">
                {c.name}
              </span>
            </div>

            {/* People Count */}
            <div className="flex items-center gap-1 text-[11px] text-slate-600 w-18 shrink-0">
              <span className="text-[10px] text-slate-400">👤</span>
              <span className="font-medium">{c.peopleCount} people</span>
            </div>

            {/* Wait Time */}
            <div className="text-[11px] font-medium text-slate-600 w-14 shrink-0 text-right">
              {c.waitTimeMinutes} min
            </div>

            {/* Wait Progress Bar */}
            <div className="flex-1 max-w-[90px] h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0">
              <div
                className={`h-full rounded-full ${getBarColor(c.status)}`}
                style={{ width: `${Math.min(c.capacityPercent, 100)}%` }}
              />
            </div>

            {/* Status Badge */}
            <div className="w-14 text-right shrink-0">
              <span
                className={`inline-block px-2 py-0.5 rounded-md border text-[9.5px] font-bold text-center w-full leading-tight ${getStatusBadge(
                  c.status
                )}`}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default QueueStatus;
