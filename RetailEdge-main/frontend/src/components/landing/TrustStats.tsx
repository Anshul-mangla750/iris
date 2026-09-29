import React from 'react';
import { Store, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { LANDING_DATA } from '../../data/landingData';
import type { TrustStatItem } from '../../data/landingData';

export const TrustStats: React.FC = () => {
  const { trustStats } = LANDING_DATA;

  const renderIcon = (icon: TrustStatItem['icon']) => {
    const iconClass = 'w-6 h-6 text-[#0fa968]';
    switch (icon) {
      case 'store':
        return <Store className={iconClass} />;
      case 'users':
        return <Users className={iconClass} />;
      case 'trending-up':
        return <TrendingUp className={iconClass} />;
      case 'shield-check':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Store className={iconClass} />;
    }
  };

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Title Block */}
          <div className="text-center lg:text-left shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
              {trustStats.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {trustStats.headline}
            </h2>
          </div>

          {/* Right Statistics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto">
            {trustStats.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-2 select-none justify-center lg:justify-start"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  {renderIcon(stat.icon)}
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1 leading-tight whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
