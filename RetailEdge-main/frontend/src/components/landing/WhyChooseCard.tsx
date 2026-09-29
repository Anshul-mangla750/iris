import React from 'react';
import { Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import type { WhyChooseItem } from '../../data/landingData';

export interface WhyChooseCardProps {
  item: WhyChooseItem;
}

export const WhyChooseCard: React.FC<WhyChooseCardProps> = ({ item }) => {
  const renderIcon = () => {
    switch (item.icon) {
      case 'zap':
        return <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case 'currency':
        return <span className="text-sm font-black text-[#0fa968] leading-none">₹</span>;
      case 'trending-up':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'shield':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Zap className="w-4 h-4 text-amber-500" />;
    }
  };

  const getContainerStyle = () => {
    switch (item.color) {
      case 'amber':
        return 'bg-amber-50/80 border-amber-200/60 text-amber-500';
      case 'green':
        return 'bg-emerald-50/80 border-emerald-200/60 text-[#0fa968]';
      case 'emerald':
        return 'bg-teal-50/80 border-teal-200/60 text-emerald-600';
      case 'blue':
        return 'bg-blue-50/80 border-blue-200/60 text-blue-600';
      default:
        return 'bg-emerald-50/80 border-emerald-200/60 text-[#0fa968]';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-xs transition-all duration-150 min-w-0">
      {/* Pastel Rounded Square Icon Container on the Left */}
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center shrink-0 ${getContainerStyle()}`}
      >
        {renderIcon()}
      </div>

      {/* Content on the Right */}
      <div className="min-w-0 flex-1">
        <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
          {item.title}
        </h4>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-normal">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default WhyChooseCard;
