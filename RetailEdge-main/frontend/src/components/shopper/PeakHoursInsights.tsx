import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import type { PeakHourInsightItem } from '../../types/shopper';

interface PeakHoursInsightsProps {
  insights: PeakHourInsightItem[];
  loading?: boolean;
}

export const PeakHoursInsights: React.FC<PeakHoursInsightsProps> = ({ insights, loading }) => {
  return (
    <DashboardCard
      title="Peak Hours & Insights"
      headerAction={
        <button
          type="button"
          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
        >
          View Detailed Report
        </button>
      }
      className="h-full"
      loading={loading}
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              <th className="pb-2 font-medium">Time Slot</th>
              <th className="pb-2 font-medium text-center">Footfall</th>
              <th className="pb-2 font-medium text-center">Avg Dwell Time</th>
              <th className="pb-2 font-medium text-center">Conversion Rate</th>
              <th className="pb-2 font-medium text-right">Insights</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {insights.map((item) => {
              const isPeak = item.isPeak;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isPeak
                      ? 'bg-emerald-50/80 font-semibold text-emerald-950 border-y border-emerald-200/60'
                      : 'hover:bg-slate-50/50 text-slate-800'
                  }`}
                >
                  <td className="py-2 pr-2 font-medium">{item.timeSlot}</td>
                  <td className="py-2 px-1 text-center font-bold">{item.footfall}</td>
                  <td className="py-2 px-1 text-center text-slate-600">{item.avgDwellTime}</td>
                  <td className="py-2 px-1 text-center font-semibold text-slate-700">
                    {item.conversionRate}
                  </td>
                  <td className="py-2 pl-2 text-right">
                    <span
                      className={`text-[10.5px] ${
                        isPeak ? 'text-[#0fa968] font-bold' : 'text-slate-500'
                      }`}
                    >
                      {item.insights}
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

export default PeakHoursInsights;
