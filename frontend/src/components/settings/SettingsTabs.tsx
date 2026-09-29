import React from 'react';

export type SettingsTabType =
  | 'General'
  | 'Store Configuration'
  | 'Integrations'
  | 'Notifications'
  | 'AI & Analytics'
  | 'Security'
  | 'System';

interface SettingsTabsProps {
  activeTab: SettingsTabType;
  onTabChange: (tab: SettingsTabType) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: SettingsTabType[] = [
    'General',
    'Store Configuration',
    'Integrations',
    'Notifications',
    'AI & Analytics',
    'Security',
    'System',
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl mb-4 shadow-2xs overflow-hidden">
      <div className="flex items-center overflow-x-auto scrollbar-none divide-x divide-slate-100">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`flex-1 min-w-fit px-5 py-3 text-xs sm:text-[13px] transition-all text-center relative whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-[#0fa968] font-semibold bg-emerald-50/20'
                  : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50/60'
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0fa968] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsTabs;
