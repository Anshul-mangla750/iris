import React from 'react';
import {
  BarChart2,
  Box,
  Users,
  ClipboardList,
  Bell,
  LineChart,
  Camera,
} from 'lucide-react';
import type { FeatureItem } from '../../types/auth';

interface FeatureCardProps {
  feature: FeatureItem;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const renderIcon = () => {
    const iconProps = { className: 'w-4 h-4 text-emerald-400' };

    switch (feature.iconName) {
      case 'bar-chart':
        return <BarChart2 {...iconProps} />;
      case 'box':
        return <Box {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'clipboard':
        return <ClipboardList {...iconProps} />;
      case 'bell':
        return <Bell {...iconProps} />;
      case 'analytics':
        return <LineChart {...iconProps} />;
      case 'camera':
        return <Camera {...iconProps} />;
      default:
        return <BarChart2 {...iconProps} />;
    }
  };

  return (
    <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-emerald-500/30 transition-all duration-200 group">
      {/* Icon with dark green container */}
      <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
        {renderIcon()}
      </div>

      {/* Feature Content */}
      <div className="min-w-0">
        <h4 className="text-white font-medium text-[13px] tracking-tight leading-snug truncate">
          {feature.title}
        </h4>
        <p className="text-gray-300 text-[11.5px] leading-tight truncate">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
