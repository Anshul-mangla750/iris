import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AlertKpiCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendDirection?: 'up' | 'down';
  trendColor?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  sparklineColor: string;
  sparklinePoints: number[];
}

export const AlertKpiCard: React.FC<AlertKpiCardProps> = ({
  title,
  value,
  trend,
  trendColor = 'text-slate-500',
  icon: Icon,
  iconBg,
  iconColor,
  sparklineColor,
  sparklinePoints,
}) => {
  // Generate SVG path from points
  const min = Math.min(...sparklinePoints);
  const max = Math.max(...sparklinePoints);
  const range = max - min || 1;
  const width = 64;
  const height = 24;

  const points = sparklinePoints.map((pt, i) => {
    const x = (i / (sparklinePoints.length - 1)) * width;
    const y = height - ((pt - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="text-[11.5px] font-medium text-slate-500 truncate">
            {title}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {value}
          </div>
          <div className={`text-[10.5px] font-semibold flex items-center gap-0.5 mt-0.5 ${trendColor}`}>
            <span>{trend}</span>
          </div>
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="w-16 h-7 shrink-0 flex items-center justify-end pr-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-16 h-6 overflow-visible"
          fill="none"
        >
          <path
            d={pathD}
            stroke={sparklineColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default AlertKpiCard;
