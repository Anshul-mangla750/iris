import React from 'react';
import { Clock, Activity, Lightbulb, CheckCircle2 } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { CustomerFlowInsightItem } from '../../types/queue';

interface CustomerFlowInsightsProps {
  insights: CustomerFlowInsightItem[];
  loading?: boolean;
}

export const CustomerFlowInsights: React.FC<CustomerFlowInsightsProps> = ({
  insights,
  loading,
}) => {
  const renderIcon = (type: CustomerFlowInsightItem['iconType']) => {
    switch (type) {
      case 'clock':
        return (
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
        );
      case 'activity':
        return (
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
        );
      case 'lightbulb':
        return (
          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
        );
      case 'check':
        return (
          <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <DashboardCard title="Customer Flow Insights" className="h-full" loading={loading}>
      <div className="space-y-2.5 pt-0.5">
        {insights.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5">
            {renderIcon(item.iconType)}
            <div className="min-w-0">
              <h4 className="text-[11.5px] font-bold text-slate-800 leading-tight">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default CustomerFlowInsights;
