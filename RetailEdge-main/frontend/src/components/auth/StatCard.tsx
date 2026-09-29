import React from 'react';
import { Store, Users, Box, Clock } from 'lucide-react';
import type { StatItem } from '../../types/auth';

interface StatCardProps {
  stat: StatItem;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const renderIcon = () => {
    const iconClass = 'w-5 h-5 text-emerald-400 shrink-0';

    switch (stat.iconName) {
      case 'store':
        return <Store className={iconClass} />;
      case 'users':
        return <Users className={iconClass} />;
      case 'cube':
        return <Box className={iconClass} />;
      case 'clock':
        return <Clock className={iconClass} />;
      default:
        return <Store className={iconClass} />;
    }
  };

  return (
    <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex-1 min-w-[130px]">
      {renderIcon()}
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg leading-tight tracking-tight">
          {stat.value}
        </span>
        <span className="text-gray-300 text-[11px] leading-tight whitespace-nowrap font-normal">
          {stat.label}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
