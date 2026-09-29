import React from 'react';
import { Users, UserCheck, Clock, ShoppingCart, BarChart3 } from 'lucide-react';
import type { ShopperKpiItem } from '../../types/shopper';

interface ShopperKpiCardProps {
  item: ShopperKpiItem;
}

export const ShopperKpiCard: React.FC<ShopperKpiCardProps> = ({ item }) => {
  const getIcon = () => {
    switch (item.icon) {
      case 'users':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'cart':
        return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case 'bar-chart':
        return <BarChart3 className="w-4 h-4 text-teal-600" />;
      default:
        return <Users className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getContainerBg = () => {
    switch (item.theme) {
      case 'blue':
        return 'bg-blue-50';
      case 'green':
        return 'bg-emerald-50';
      case 'purple':
        return 'bg-purple-50';
      case 'emerald':
        return 'bg-emerald-50';
      case 'teal':
        return 'bg-teal-50';
      default:
        return 'bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-3 sm:p-3.5 flex items-center justify-between gap-2.5 min-w-0 transition-all hover:border-slate-300">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Icon Container */}
        <div
          className={`w-9 h-9 rounded-lg ${getContainerBg()} flex items-center justify-center shrink-0`}
        >
          {getIcon()}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-500 leading-tight truncate">
            {item.title}
          </p>
          <p className="text-[19px] sm:text-[21px] font-black text-slate-900 tracking-tight leading-tight mt-0.5 truncate">
            {item.value}
          </p>
          {item.trendText && (
            <p className="text-[10px] font-semibold text-emerald-600 leading-tight mt-0.5 flex items-center gap-1">
              <span>{item.trendText}</span>
            </p>
          )}
          {item.supportingText && (
            <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5 truncate">
              {item.supportingText}
            </p>
          )}
        </div>
      </div>

      {/* Decorative sparkline on cards 1-4 */}
      {item.trendText && (
        <svg
          className="w-10 h-5 text-emerald-500 shrink-0 opacity-80"
          viewBox="0 0 40 20"
          fill="none"
        >
          <path
            d="M2 15 Q 10 5, 20 12 T 38 4"
            stroke="#10B981"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};

export default ShopperKpiCard;
