import React from 'react';
import { Users, Clock, Hourglass, Smile } from 'lucide-react';

export interface QueueKpiCardProps {
  title: string;
  value: string;
  trendText?: string;
  trendColor?: 'green' | 'red';
  statusText?: string;
  statusType?: 'normal' | 'high';
  supportingText?: string;
  sparklineColor?: string;
  iconType: 'green-users' | 'purple-clock' | 'blue-users' | 'red-hourglass' | 'red-users' | 'green-smile';
}

export const QueueKpiCard: React.FC<QueueKpiCardProps> = ({
  title,
  value,
  trendText,
  trendColor = 'green',
  statusText,
  statusType = 'normal',
  supportingText,
  sparklineColor,
  iconType,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'green-users':
        return (
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
        );
      case 'purple-clock':
        return (
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
        );
      case 'blue-users':
        return (
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-sky-600" />
          </div>
        );
      case 'red-hourglass':
        return (
          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Hourglass className="w-4 h-4 text-red-600" />
          </div>
        );
      case 'red-users':
        return (
          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-red-600" />
          </div>
        );
      case 'green-smile':
        return (
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Smile className="w-4 h-4 text-emerald-600" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-3 sm:p-3.5 flex items-center justify-between gap-2 min-w-0 transition-all hover:border-slate-300">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {renderIcon()}

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-slate-500 leading-tight truncate">
            {title}
          </p>
          <p className="text-[18px] sm:text-[20px] font-black text-slate-900 tracking-tight leading-tight mt-0.5 truncate">
            {value}
          </p>

          {trendText && (
            <p
              className={`text-[10px] font-bold leading-tight mt-0.5 flex items-center gap-1 ${
                trendColor === 'red' ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              <span>{trendText}</span>
            </p>
          )}

          {statusText && (
            <p
              className={`text-[10px] font-bold leading-tight mt-0.5 flex items-center gap-1 ${
                statusType === 'high' ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              <span>{statusText}</span>
            </p>
          )}

          {supportingText && (
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
              {supportingText}
            </p>
          )}
        </div>
      </div>

      {/* Mini sparkline visualization */}
      {sparklineColor && (
        <svg className="w-8 h-4 shrink-0 opacity-80" viewBox="0 0 32 16" fill="none">
          <path
            d="M2 13 Q 10 4, 18 10 T 30 3"
            stroke={sparklineColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};

export default QueueKpiCard;
