import React from 'react';
import { Wrench, Network, Clock, AlertTriangle, Link2, ChevronRight } from 'lucide-react';
import type { IntegrationSettingItemData } from '../../types/integration';

interface IntegrationSettingItemProps {
  setting: IntegrationSettingItemData;
  onClick: (setting: IntegrationSettingItemData) => void;
}

export const IntegrationSettingItem: React.FC<IntegrationSettingItemProps> = ({
  setting,
  onClick,
}) => {
  const getIcon = () => {
    switch (setting.iconName) {
      case 'key':
        return <Wrench className="w-4 h-4 text-emerald-600" />;
      case 'workflow':
        return <Network className="w-4 h-4 text-purple-600" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'link':
        return <Link2 className="w-4 h-4 text-sky-600" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => onClick(setting)}
      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${setting.iconBg}`}
        >
          {getIcon()}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
            {setting.title}
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {setting.description}
          </p>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 ml-2" />
    </button>
  );
};

export default IntegrationSettingItem;
