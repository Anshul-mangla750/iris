import React from 'react';
import { Sparkles, TrendingUp, Clock, Package, Target } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { AIInsightItem } from '../../types/dashboard';

export interface AIInsightsProps {
  insights: AIInsightItem[];
  onViewAll?: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, onViewAll }) => {
  const headerTitle = (
    <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[13px] sm:text-[14px]">
      <Sparkles className="w-3.5 h-3.5 text-[#0fa968]" />
      <span>AI Insights</span>
    </div>
  );

  const headerAction = (
    <button
      type="button"
      onClick={onViewAll}
      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
    >
      View All
    </button>
  );

  const getInsightIcon = (type: AIInsightItem['type']) => {
    switch (type) {
      case 'footfall':
        return <TrendingUp className="w-3.5 h-3.5 text-[#0fa968] shrink-0" />;
      case 'queue':
        return <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'restock':
        return <Package className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'layout':
        return <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#0fa968] shrink-0" />;
    }
  };

  return (
    <DashboardCard title={headerTitle} headerAction={headerAction} className="h-full">
      <div className="space-y-1.5 pt-1 h-36 overflow-y-auto scrollbar-thin">
        {insights.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
          >
            <div className="mt-0.5">{getInsightIcon(item.type)}</div>
            <div className="min-w-0 flex-1 leading-tight">
              <h4 className="text-[10.5px] font-bold text-slate-800 truncate">
                {item.title}
              </h4>
              <p className="text-[9.5px] text-slate-500 font-normal mt-0.5 truncate">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default AIInsights;
