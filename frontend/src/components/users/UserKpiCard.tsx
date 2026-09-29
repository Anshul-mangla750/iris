import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface UserKpiCardProps {
  title: string;
  value: string | number;
  trendText: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  sparklineColor: string;
  sparklinePoints: number[];
}

export const UserKpiCard: React.FC<UserKpiCardProps> = ({
  title,
  value,
  trendText,
  trendType = 'up',
  icon: Icon,
  iconBg,
  iconColor,
  sparklineColor,
  sparklinePoints,
}) => {
  const width = 64;
  const height = 26;
  const min = Math.min(...sparklinePoints);
  const max = Math.max(...sparklinePoints);
  const range = max - min || 1;

  const pointsString = sparklinePoints
    .map((val, idx) => {
      const x = (idx / (sparklinePoints.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const getTrendColor = () => {
    if (trendType === 'neutral') return 'text-slate-500';
    if (trendType === 'down') return 'text-red-500';
    return 'text-emerald-600';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-medium text-slate-500 whitespace-nowrap">{title}</p>
          <div className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-tight mt-0.5 whitespace-nowrap">
            {value}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[11px] font-semibold flex items-center ${getTrendColor()}`}>
              {trendText}
            </span>
          </div>
        </div>
      </div>

      {/* Mini Sparkline Chart */}
      <div className="shrink-0 pl-2">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          <path
            d={pointsString}
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default UserKpiCard;
