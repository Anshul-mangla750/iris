import React from 'react';
import { AlertTriangle, Video, AlertCircle } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { RecentAlertItem } from '../../types/dashboard';

export interface RecentAlertsProps {
  alerts: RecentAlertItem[];
  onViewAll?: () => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts, onViewAll }) => {
  const headerAction = (
    <button
      type="button"
      onClick={onViewAll}
      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
    >
      View All
    </button>
  );

  const getAlertIcon = (type: RecentAlertItem['type']) => {
    switch (type) {
      case 'out-of-stock':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />;
      case 'high-queue':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'misplaced':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'camera-offline':
        return <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    }
  };

  return (
    <DashboardCard title="Recent Alerts" headerAction={headerAction} className="h-full">
      <div className="space-y-2 pt-1 h-36 overflow-y-auto scrollbar-thin">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {getAlertIcon(alert.type)}
              <span className="text-[11px] font-medium text-slate-700 truncate leading-snug">
                {alert.message}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal shrink-0">
              {alert.timeAgo}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default RecentAlerts;
