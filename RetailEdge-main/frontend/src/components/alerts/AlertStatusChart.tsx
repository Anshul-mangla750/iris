import React from 'react';
import type { AlertStatusItem } from '../../types/alert';
import { ALERT_STATUS_DATA } from '../../data/alertMockData';

interface AlertStatusChartProps {
  statusData?: AlertStatusItem[];
}

export const AlertStatusChart: React.FC<AlertStatusChartProps> = ({ statusData }) => {
  const safeStatusData = Array.isArray(statusData) && statusData.length > 0
    ? statusData
    : ALERT_STATUS_DATA;

  // Find maximum count to scale progress bars smoothly
  const maxVal = Math.max(...safeStatusData.map((s) => s.count), 50);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Alert Status
        </h3>
      </div>

      {/* Progress Bars Container */}
      <div className="flex flex-col justify-around h-[180px] sm:h-[190px] py-1">
        {safeStatusData.map((item) => {
          const percentage = Math.min(100, Math.round((item.count / maxVal) * 100));

          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="font-medium text-slate-600">{item.label}</span>
                <span className="font-bold text-slate-800">{item.count}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertStatusChart;
