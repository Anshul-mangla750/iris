import React, { useState } from 'react';
import { ChevronDown, Coffee, Cookie, Sparkles, Milk, Home } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { CategoryPerformanceItem } from '../../types/dashboard';

export interface TopCategoriesProps {
  categories: CategoryPerformanceItem[];
  onViewAll?: () => void;
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ categories, onViewAll }) => {
  const [metricFilter, setMetricFilter] = useState<'By Sales' | 'By Volume'>('By Sales');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getCategoryIcon = (iconName: CategoryPerformanceItem['iconName']) => {
    switch (iconName) {
      case 'beverages':
        return <Coffee className="w-3.5 h-3.5 text-blue-500" />;
      case 'snacks':
        return <Cookie className="w-3.5 h-3.5 text-amber-500" />;
      case 'personal-care':
        return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
      case 'dairy':
        return <Milk className="w-3.5 h-3.5 text-emerald-500" />;
      case 'household':
        return <Home className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <Coffee className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const headerAction = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <span>{metricFilter}</span>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-[10.5px] w-24">
            {(['By Sales', 'By Volume'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMetricFilter(m);
                  setDropdownOpen(false);
                }}
                className={`w-full px-2.5 py-1 text-left ${
                  metricFilter === m ? 'bg-emerald-50 text-[#0fa968] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
      >
        View All
      </button>
    </div>
  );

  return (
    <DashboardCard title="Top Performing Categories" headerAction={headerAction} className="h-full">
      <div className="space-y-2 pt-1">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2.5 text-xs">
            {/* Category Icon & Name */}
            <div className="flex items-center gap-1.5 w-24 shrink-0">
              <div className="w-5 h-5 rounded bg-slate-100/80 flex items-center justify-center shrink-0">
                {getCategoryIcon(cat.iconName)}
              </div>
              <span className="font-bold text-slate-700 text-[11px] truncate">{cat.name}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0fa968]"
                style={{ width: `${cat.sharePercent * 2.5}%` }}
              />
            </div>

            {/* Percentage Share */}
            <span className="w-8 text-right font-bold text-slate-800 text-[11px] shrink-0">
              {cat.sharePercent}%
            </span>

            {/* Change Trend */}
            <span
              className={`w-11 text-right text-[10.5px] font-bold shrink-0 ${
                cat.trend === 'up' ? 'text-[#0fa968]' : 'text-red-500'
              }`}
            >
              {cat.trend === 'up' ? `↑ ${cat.changePercent}%` : `↓ ${cat.changePercent}%`}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default TopCategories;
