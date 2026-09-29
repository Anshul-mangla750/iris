import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import {
  PEAK_HOURS_TIME_SLOTS,
  PEAK_HOURS_COUNTERS,
} from '../../data/queueMockData';
import type { PeakHourCell } from '../../types/queue';

interface PeakHoursHeatmapProps {
  data: PeakHourCell[];
  loading?: boolean;
}

export const PeakHoursHeatmap: React.FC<PeakHoursHeatmapProps> = ({ data, loading }) => {
  const [selectedCounter, setSelectedCounter] = useState('All Counters');

  const getCellColor = (level: PeakHourCell['level']) => {
    switch (level) {
      case 'very_high':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-amber-300';
      case 'low':
        return 'bg-emerald-300';
      case 'empty':
      default:
        return 'bg-emerald-50';
    }
  };

  const getCellLevel = (counter: string, slot: string) => {
    const item = data.find((d) => d.counter === counter && d.timeSlot === slot);
    return item ? item.level : 'empty';
  };

  const countersToDisplay =
    selectedCounter === 'All Counters'
      ? PEAK_HOURS_COUNTERS
      : [selectedCounter];

  return (
    <DashboardCard
      title="Peak Hours Analysis"
      className="h-full"
      loading={loading}
      headerAction={
        <div className="relative">
          <select
            value={selectedCounter}
            onChange={(e) => setSelectedCounter(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <option value="All Counters">All Counters</option>
            {PEAK_HOURS_COUNTERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      }
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Heatmap Grid */}
        <div className="flex-1 w-full overflow-x-auto">
          <div className="min-w-[260px] space-y-1">
            {countersToDisplay.map((counter) => (
              <div key={counter} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-14 text-slate-500 font-medium truncate shrink-0">
                  {counter}
                </span>
                <div className="flex-1 grid grid-cols-9 gap-0.5">
                  {PEAK_HOURS_TIME_SLOTS.map((slot) => {
                    const level = getCellLevel(counter, slot);
                    return (
                      <div
                        key={slot}
                        className={`h-4 sm:h-5 rounded-xs transition-opacity hover:opacity-80 ${getCellColor(
                          level
                        )}`}
                        title={`${counter} at ${slot}: ${level.replace('_', ' ')}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Time Slot Labels */}
            <div className="flex items-center gap-1.5 text-[8.5px] font-medium text-slate-400 pt-1">
              <span className="w-14 shrink-0" />
              <div className="flex-1 grid grid-cols-9 text-center gap-0.5">
                {PEAK_HOURS_TIME_SLOTS.map((slot) => (
                  <span key={slot} className="truncate">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend Side Panel */}
        <div className="flex sm:flex-col flex-wrap gap-1.5 shrink-0 sm:w-22 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-600 shrink-0" />
            <span className="text-slate-600 font-medium">Very High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 shrink-0" />
            <span className="text-slate-600 font-medium">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-300 shrink-0" />
            <span className="text-slate-600 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-300 shrink-0" />
            <span className="text-slate-600 font-medium">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-50 border border-slate-200 shrink-0" />
            <span className="text-slate-600 font-medium">Empty</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default PeakHoursHeatmap;
