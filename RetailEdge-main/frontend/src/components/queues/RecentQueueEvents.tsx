import React from 'react';
import { AlertTriangle, TrendingDown, PlusCircle, UserCheck } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { RecentQueueEventItem } from '../../types/queue';

interface RecentQueueEventsProps {
  events: RecentQueueEventItem[];
  loading?: boolean;
  onViewAll?: () => void;
}

export const RecentQueueEvents: React.FC<RecentQueueEventsProps> = ({
  events,
  loading,
  onViewAll,
}) => {
  const renderEventIcon = (type: RecentQueueEventItem['eventType']) => {
    switch (type) {
      case 'queue_high':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />;
      case 'queue_reduced':
        return <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'new_counter':
        return <PlusCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'staff_assist':
        return <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <DashboardCard
      title="Recent Queue Events"
      className="h-full"
      loading={loading}
      headerAction={
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          View All
        </button>
      }
    >
      <div className="overflow-x-auto -mx-3.5 -mb-3.5 mt-0.5">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[9.5px] tracking-wider">
              <th className="py-2 pl-3.5 pr-2">Time</th>
              <th className="py-2 px-2">Event</th>
              <th className="py-2 px-2">Counter</th>
              <th className="py-2 px-2">Details</th>
              <th className="py-2 pl-2 pr-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 pl-3.5 pr-2 text-slate-500 font-mono text-[10.5px] whitespace-nowrap">
                  {evt.time}
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-1.5">
                    {renderEventIcon(evt.eventType)}
                    <span className="font-semibold text-slate-700 whitespace-nowrap">
                      {evt.event}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 font-bold text-slate-800 whitespace-nowrap">
                  {evt.counter}
                </td>
                <td className="py-2 px-2 text-slate-500 whitespace-nowrap">{evt.details}</td>
                <td className="py-2 pl-2 pr-3.5 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      evt.status === 'Open'
                        ? 'bg-red-50 text-red-600 border border-red-200/80'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
                    }`}
                  >
                    {evt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default RecentQueueEvents;
