import React from 'react';
import { AlertTriangle, Lightbulb, TrendingUp, AlertCircle, BarChart3, ChevronRight } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { PlanogramAIInsight } from '../../types/planogram';

interface AIInsightsRecommendationsProps {
  insights: PlanogramAIInsight[];
  loading?: boolean;
  onViewAll?: () => void;
}

export const AIInsightsRecommendations: React.FC<AIInsightsRecommendationsProps> = ({
  insights,
  loading,
  onViewAll,
}) => {
  const renderIcon = (type: PlanogramAIInsight['iconType']) => {
    switch (type) {
      case 'warning':
        return (
          <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        );
      case 'lightbulb':
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
        );
      case 'trend':
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        );
      case 'info':
        return (
          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        );
      case 'barchart':
        return (
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <DashboardCard
      title="AI Insights & Recommendations"
      className="h-full"
      loading={loading}
      headerAction={
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          View All
        </button>
      }
    >
      <div className="space-y-2 pt-0.5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {renderIcon(item.iconType)}
              <div className="min-w-0">
                <h4 className="text-[11.5px] font-bold text-slate-800 leading-tight truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5 truncate">
                  {item.description}
                </p>
              </div>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default AIInsightsRecommendations;
