import React from 'react';

export type TabType = 'Users' | 'Roles' | 'Permissions' | 'Access Control' | 'Activity Logs';

interface UsersAccessTabsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const UsersAccessTabs: React.FC<UsersAccessTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: TabType[] = ['Users', 'Roles', 'Permissions', 'Access Control', 'Activity Logs'];

  return (
    <div className="flex items-center gap-6 border-b border-slate-200/90 mb-4 px-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelectTab(tab)}
            className={`pb-2.5 text-xs font-semibold transition-colors relative ${
              isActive ? 'text-[#0fa968]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0fa968] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default UsersAccessTabs;
