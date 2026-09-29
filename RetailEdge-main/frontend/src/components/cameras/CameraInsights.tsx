import React from 'react';
import { Users, AlertTriangle, BarChart2, UserCheck } from 'lucide-react';
import type { CameraInsight } from '../../types/camera';

interface CameraInsightsProps {
  insights: CameraInsight[];
  onViewAll?: () => void;
}

export const CameraInsights: React.FC<CameraInsightsProps> = ({
  insights,
  onViewAll,
}) => {
  const getInsightVisual = (type: CameraInsight['type'], _severity?: CameraInsight['severity']) => {
    switch (type) {
      case 'HIGH_FOOTFALL':
        return {
          icon: Users,
          bg: 'bg-emerald-50',
          color: 'text-emerald-600',
        };
      case 'QUEUE_INCREASE':
        return {
          icon: AlertTriangle,
          bg: 'bg-red-50',
          color: 'text-red-500',
        };
      case 'UNUSUAL_ACTIVITY':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50',
          color: 'text-amber-500',
        };
      case 'EMPTY_SHELF':
        return {
          icon: BarChart2,
          bg: 'bg-purple-50',
          color: 'text-purple-600',
        };
      case 'NORMAL_ACTIVITY':
      default:
        return {
          icon: UserCheck,
          bg: 'bg-emerald-50',
          color: 'text-emerald-600',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs flex flex-col h-full">
      {/* Card Header: Title & View All */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight">
          AI Insights from Cameras
        </h2>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[11px] font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            View All
          </button>
        )}
      </div>

      {/* Insight Rows List */}
      <div className="divide-y divide-slate-100/90 flex-1 overflow-y-auto mt-1 scrollbar-thin">
        {insights.map((ins) => {
          const visual = getInsightVisual(ins.type, ins.severity);
          const Icon = visual.icon;

          return (
            <div
              key={ins.id}
              className="py-2 flex items-start gap-2.5 hover:bg-slate-50/60 rounded-md px-1 transition-colors group"
            >
              {/* Icon Container */}
              <div
                className={`w-7 h-7 rounded-lg ${visual.bg} ${visual.color} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>

              {/* Text Body */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-[11.5px] font-bold text-slate-800 truncate leading-tight">
                    {ins.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {ins.timeAgo}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5 leading-snug">
                  {ins.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CameraInsights;
