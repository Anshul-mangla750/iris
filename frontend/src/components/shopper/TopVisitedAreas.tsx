import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import type { VisitedAreaItem } from '../../types/shopper';

interface TopVisitedAreasProps {
  areas: VisitedAreaItem[];
  loading?: boolean;
}

export const TopVisitedAreas: React.FC<TopVisitedAreasProps> = ({ areas, loading }) => {
  return (
    <DashboardCard
      title="Top Visited Areas"
      headerAction={
        <button
          type="button"
          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
        >
          View All
        </button>
      }
      className="h-full"
      loading={loading}
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              <th className="pb-2 font-medium w-6">#</th>
              <th className="pb-2 font-medium">Zone</th>
              <th className="pb-2 font-medium text-center">Visits</th>
              <th className="pb-2 font-medium text-center">Avg Dwell Time</th>
              <th className="pb-2 font-medium text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {areas.map((item) => {
              const isUp = item.trendDirection === 'up';
              return (
                <tr key={item.rank} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2 text-slate-400 font-medium">{item.rank}</td>
                  <td className="py-2 font-semibold text-slate-800">{item.zone}</td>
                  <td className="py-2 text-center text-slate-700">{item.visits}</td>
                  <td className="py-2 text-center text-slate-600">{item.avgDwellTime}</td>
                  <td className="py-2 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10.5px] font-bold ${
                        isUp ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.trend}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default TopVisitedAreas;
