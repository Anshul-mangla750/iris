import React from 'react';
import { Package, Store, BarChart3, ShieldCheck } from 'lucide-react';
import type { FloatingCardItem } from '../../data/landingData';

export interface FloatingFeatureCardProps {
  item: FloatingCardItem;
  className?: string;
}

export const FloatingFeatureCard: React.FC<FloatingFeatureCardProps> = ({
  item,
  className = '',
}) => {
  const renderIcon = () => {
    switch (item.icon) {
      case 'package':
        return <Package className="w-5 h-5 text-[#0fa968]" />;
      case 'store':
        return <Store className="w-5 h-5 text-teal-600" />;
      case 'bar-chart':
        return <BarChart3 className="w-5 h-5 text-[#0fa968]" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-[#0fa968]" />;
      default:
        return <Package className="w-5 h-5 text-[#0fa968]" />;
    }
  };

  const getIconBg = () => {
    switch (item.icon) {
      case 'store':
        return 'bg-teal-50 border-teal-200/80';
      default:
        return 'bg-emerald-50 border-emerald-200/80';
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-3 px-3.5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 select-none ${className}`}
    >
      <div
        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getIconBg()}`}
      >
        {renderIcon()}
      </div>
      <div className="text-[12.5px] font-bold text-slate-800 leading-tight whitespace-pre-line text-left">
        {item.title}
      </div>
    </div>
  );
};

export default FloatingFeatureCard;
