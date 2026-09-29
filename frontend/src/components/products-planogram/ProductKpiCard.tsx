import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ProductKpiCardProps {
  title: string;
  value: string | number;
  trend: number; // e.g. 8 or -28
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  sparklineColor: string;
}

export const ProductKpiCard: React.FC<ProductKpiCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  iconBgColor,
  iconColor,
  sparklineColor,
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between min-h-[82px] hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3">
        {/* Icon Container */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>

        {/* Content */}
        <div>
          <span className="text-[11px] font-medium text-slate-500 block leading-tight">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              {value}
            </span>
            <span
              className={`inline-flex items-center text-[11px] font-semibold ${
                isPositive ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
              )}
              {Math.abs(trend)}%
            </span>
          </div>
        </div>
      </div>

      {/* Mini Sparkline Curve */}
      <div className="w-16 h-8 shrink-0 flex items-center justify-end">
        <svg className="w-14 h-6 overflow-visible" viewBox="0 0 60 25" fill="none">
          {isPositive ? (
            <path
              d="M2 18 Q 15 19, 25 12 T 45 10 T 58 4"
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M2 6 Q 15 8, 25 14 T 45 18 T 58 22"
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default ProductKpiCard;
