import React, { useState } from 'react';
import { ChevronDown, Power } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { CounterStatusItem } from '../../types/queue';
import { useToast } from '../../context/ToastContext';

interface QueueStatusTableProps {
  counters: CounterStatusItem[];
  loading?: boolean;
}

export const QueueStatusTable: React.FC<QueueStatusTableProps> = ({ counters: initialCounters, loading }) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All Counters');
  const [counters, setCounters] = useState(initialCounters);

  React.useEffect(() => {
    setCounters(initialCounters);
  }, [initialCounters]);

  const toggleCounterStatus = (id: string, name: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) return;
    const isOpening = target.status === 'Closed';
    const newStatus: 'Normal' | 'Closed' = isOpening ? 'Normal' : 'Closed';

    setCounters((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatus,
            currentQueue: isOpening ? 2 : 0,
            avgWaitTime: isOpening ? 1.2 : 0.0,
          };
        }
        return c;
      })
    );

    showToast(
      `${name} is now ${newStatus.toUpperCase()}`,
      isOpening ? 'success' : 'info'
    );
  };

  const filteredCounters =
    filter === 'All Counters'
      ? counters
      : counters.filter((c) => c.name === filter);

  return (
    <DashboardCard
      title="Queue Status - All Counters"
      className="h-full"
      loading={loading}
      headerAction={
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <option value="All Counters">All Counters</option>
            {counters.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      }
    >
      <div className="overflow-x-auto -mx-3.5 -mb-3.5 mt-0.5">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[9.5px] tracking-wider">
              <th className="py-2 pl-3.5 pr-2">Counter</th>
              <th className="py-2 px-2">Queue</th>
              <th className="py-2 px-2">Wait Time</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Toggle</th>
              <th className="py-2 pl-2 pr-3.5 text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCounters.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 pl-3.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.iconColor }}
                    />
                    <span className="font-bold text-slate-800 whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 font-semibold text-slate-700">
                  {item.currentQueue} people
                </td>
                <td className="py-2 px-2 text-slate-700 font-medium whitespace-nowrap">
                  {item.avgWaitTime} min
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'High'
                        ? 'bg-red-50 text-red-600 border border-red-200/80'
                        : item.status === 'Open' || item.status === 'Normal'
                        ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/80'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <button
                    type="button"
                    onClick={() => toggleCounterStatus(item.id, item.name)}
                    className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="Toggle Counter State"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="py-2 pl-2 pr-3.5 text-right">
                  <svg className="w-10 h-4 ml-auto inline-block" viewBox="0 0 40 16" fill="none">
                    {item.trend === 'up' ? (
                      <path
                        d="M2 13 Q 10 12, 20 6 T 38 2"
                        stroke="#EF4444"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    ) : item.trend === 'down' ? (
                      <path
                        d="M2 3 Q 12 5, 22 10 T 38 13"
                        stroke="#10B981"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    ) : (
                      <path
                        d="M2 8 Q 12 4, 22 10 T 38 7"
                        stroke="#10B981"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default QueueStatusTable;
