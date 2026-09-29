import React from 'react';
import {
  Package,
  ShoppingCart,
  Store,
  BarChart3,
  ShieldAlert,
  Camera,
  Users,
} from 'lucide-react';
import { LANDING_DATA } from '../../data/landingData';
import type { FeatureStripItem } from '../../data/landingData';

export const FeatureStrip: React.FC = () => {
  const { featureStrip } = LANDING_DATA;

  const renderIcon = (item: FeatureStripItem) => {
    const iconClass = 'w-5 h-5';

    switch (item.icon) {
      case 'box':
        return <Package className={`${iconClass} text-emerald-600`} />;
      case 'shopping-cart':
        return <ShoppingCart className={`${iconClass} text-purple-600`} />;
      case 'store':
        return <Store className={`${iconClass} text-amber-600`} />;
      case 'bar-chart':
        return <BarChart3 className={`${iconClass} text-blue-600`} />;
      case 'shield-alert':
        return <ShieldAlert className={`${iconClass} text-rose-600`} />;
      case 'camera':
        return <Camera className={`${iconClass} text-violet-600`} />;
      case 'users':
        return <Users className={`${iconClass} text-teal-600`} />;
      default:
        return <Package className={`${iconClass} text-emerald-600`} />;
    }
  };

  const getThemeClass = (theme: FeatureStripItem['theme']) => {
    switch (theme) {
      case 'green':
        return 'bg-emerald-50 border-emerald-200/80';
      case 'purple':
        return 'bg-purple-50 border-purple-200/80';
      case 'amber':
        return 'bg-amber-50 border-amber-200/80';
      case 'blue':
        return 'bg-blue-50 border-blue-200/80';
      case 'rose':
        return 'bg-rose-50 border-rose-200/80';
      case 'violet':
        return 'bg-violet-50 border-violet-200/80';
      case 'teal':
        return 'bg-teal-50 border-teal-200/80';
      default:
        return 'bg-emerald-50 border-emerald-200/80';
    }
  };

  return (
    <section id="features" className="py-8 bg-slate-50/70 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {featureStrip.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start p-3.5 bg-white rounded-xl border border-slate-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
            >
              {/* Colored Icon Box */}
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform ${getThemeClass(
                  item.theme
                )}`}
              >
                {renderIcon(item)}
              </div>

              {/* Title & Description */}
              <h3 className="text-[12.5px] font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-500 leading-snug mt-1 font-normal line-clamp-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
