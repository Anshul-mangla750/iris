import React from 'react';
import {
  Users,
  Clock,
  GitBranch,
  Package,
  Boxes,
  ShieldCheck,
} from 'lucide-react';
import type { KpiItem } from '../../types/dashboard';

export interface KpiCardProps {
  item: KpiItem;
}

export const KpiCard: React.FC<KpiCardProps> = ({ item }) => {
  const renderIcon = () => {
    switch (item.icon) {
      case 'users':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'queue':
        return <GitBranch className="w-4 h-4 text-indigo-600" />;
      case 'package':
        return <Package className="w-4 h-4 text-red-500" />;
      case 'box':
        return <Boxes className="w-4 h-4 text-[#0fa968]" />;
      case 'health':
        return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      default:
        return <Users className="w-4 h-4 text-blue-600" />;
    }
  };

  const getContainerStyle = () => {
    switch (item.theme) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'red':
        return 'bg-red-50 text-red-500 border-red-100';
      case 'emerald':
        return 'bg-emerald-50 text-[#0fa968] border-emerald-100';
      case 'teal':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      default:
        return 'bg-emerald-50 text-[#0fa968] border-emerald-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-colors flex items-start gap-2.5 min-w-0">
      {/* Pastel Rounded Square Icon Container */}
      <div
        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getContainerStyle()}`}
      >
        {renderIcon()}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-medium text-slate-500 block truncate leading-tight">
          {item.title}
        </span>

        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span
            className={`text-lg sm:text-[21px] font-black tracking-tight leading-none ${
              item.id === 'system-health' ? 'text-[#0fa968]' : 'text-slate-900'
            }`}
          >
            {item.value}
          </span>
        </div>

        {/* Trend / Status Subtitle */}
        {item.trendText && (
          <div
            className={`text-[10px] font-bold mt-1 leading-tight truncate flex items-center gap-1 ${
              item.isAlert
                ? 'text-red-500'
                : item.trendDirection === 'neutral'
                ? 'text-[#0fa968]'
                : 'text-[#0fa968]'
            }`}
          >
            {item.trendText}
          </div>
        )}

        {item.subtitle && (
          <p className="text-[9.5px] text-slate-400 font-normal mt-1 leading-tight truncate">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
