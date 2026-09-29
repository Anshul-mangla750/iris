import React from 'react';
import type { AccessActivity } from '../../types/accessActivity';

interface RecentAccessActivityProps {
  activities: AccessActivity[];
  onViewAll?: () => void;
}

export const RecentAccessActivity: React.FC<RecentAccessActivityProps> = ({
  activities,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Recent Access Activity
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <span className="text-slate-400">→</span>
        </button>
      </div>

      {/* Activities Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-600 tracking-wider">
              <th className="py-2 px-2.5">User</th>
              <th className="py-2 px-2.5">Action</th>
              <th className="py-2 px-2.5">Module</th>
              <th className="py-2 px-2.5 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => (
              <tr
                key={act.id}
                className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700"
              >
                {/* User */}
                <td className="py-2 px-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${act.userAvatarBg}`}
                    >
                      {act.userInitials}
                    </div>
                    <span className="font-semibold text-slate-800 text-[11px] truncate">
                      {act.userName}
                    </span>
                  </div>
                </td>

                {/* Action */}
                <td className="py-2 px-2.5 text-[11px] text-slate-600 whitespace-nowrap">
                  {act.action}
                </td>

                {/* Module */}
                <td className="py-2 px-2.5 text-[11px] text-slate-500 whitespace-nowrap">
                  {act.module}
                </td>

                {/* Time */}
                <td className="py-2 px-2.5 text-[11px] text-slate-500 text-right whitespace-nowrap">
                  {act.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAccessActivity;
