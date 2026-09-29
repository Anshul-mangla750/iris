import React from 'react';
import { Package, CheckCircle2, Truck } from 'lucide-react';

export interface InventoryKpiCardProps {
  title: string;
  value: string;
  secondaryValue?: string;
  trendText?: string;
  trendColor?: 'green' | 'red';
  sparklineColor?: string;
  iconType: 'blue-package' | 'green-package' | 'amber-package' | 'red-package' | 'green-check' | 'blue-truck';
  actionText?: string;
  onActionClick?: () => void;
}

export const InventoryKpiCard: React.FC<InventoryKpiCardProps> = ({
  title,
  value,
  secondaryValue,
  trendText,
  trendColor = 'green',
  sparklineColor,
  iconType,
  actionText,
  onActionClick,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'blue-package':
        return (
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-sky-600" />
          </div>
        );
      case 'green-package':
        return (
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
        );
      case 'amber-package':
        return (
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-amber-600" />
          </div>
        );
      case 'red-package':
        return (
          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-red-600" />
          </div>
        );
      case 'green-check':
        return (
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        );
      case 'blue-truck':
        return (
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-sky-600" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
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
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[18px] sm:text-[20px] font-black text-slate-900 tracking-tight leading-tight truncate">
              {value}
            </span>
            {secondaryValue && (
              <span className="text-[12px] sm:text-[13px] font-bold text-slate-500 truncate">
                {secondaryValue}
              </span>
            )}
          </div>

          {trendText && (
            <p
              className={`text-[10px] font-bold leading-tight mt-0.5 flex items-center gap-1 ${
                trendColor === 'red' ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              <span>{trendText}</span>
            </p>
          )}

          {actionText && (
            <button
              type="button"
              onClick={onActionClick}
              className="text-[10.5px] font-bold text-blue-600 hover:text-blue-700 leading-tight mt-0.5 hover:underline inline-flex items-center gap-0.5"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>

      {/* Mini sparkline visualization */}
      {sparklineColor && (
        <svg className="w-8 h-4 shrink-0 opacity-80" viewBox="0 0 32 16" fill="none">
          {sparklineColor === '#EF4444' ? (
            <path
              d="M2 4 Q 10 12, 18 8 T 30 14"
              stroke={sparklineColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : sparklineColor === '#F59E0B' ? (
            <path
              d="M2 12 Q 10 6, 18 10 T 30 5"
              stroke={sparklineColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M2 13 Q 10 4, 18 10 T 30 3"
              stroke={sparklineColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      )}
    </div>
  );
};

export default InventoryKpiCard;
