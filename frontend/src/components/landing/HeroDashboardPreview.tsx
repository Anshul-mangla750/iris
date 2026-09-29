import React from 'react';
import { Package, Store } from 'lucide-react';
import { LANDING_DATA } from '../../data/landingData';

export const HeroDashboardPreview: React.FC = () => {
  const { title, status, metrics } = LANDING_DATA.heroLiveOverview;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.09)] border border-slate-100 p-4 w-full max-w-md select-none transition-all duration-200 hover:shadow-xl">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 tracking-tight">
          {title}
        </h4>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#0fa968] border border-emerald-200/80 text-[10.5px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] animate-pulse" />
          <span>{status}</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-3 gap-2">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="flex flex-col p-2 rounded-xl bg-slate-50/80 border border-slate-100/90"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {metric.label}
              </span>
              <div className="w-4 h-4 rounded-full bg-emerald-100/70 flex items-center justify-center text-[#0fa968] text-[9px] shrink-0">
                {metric.icon === 'currency' && '₹'}
                {metric.icon === 'box' && <Package className="w-2.5 h-2.5" />}
                {metric.icon === 'store' && <Store className="w-2.5 h-2.5" />}
              </div>
            </div>
            <div className="text-[13px] font-extrabold text-slate-900 tracking-tight">
              {metric.value}
            </div>
            <div className="text-[9.5px] font-semibold text-[#0fa968] mt-0.5">
              {metric.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroDashboardPreview;
