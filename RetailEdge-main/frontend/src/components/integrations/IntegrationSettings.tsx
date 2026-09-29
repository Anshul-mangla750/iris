import React from 'react';
import IntegrationSettingItem from './IntegrationSettingItem';
import type { IntegrationSettingItemData } from '../../types/integration';

interface IntegrationSettingsProps {
  settings: IntegrationSettingItemData[];
  onSelectSetting: (setting: IntegrationSettingItemData) => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  settings,
  onSelectSetting,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="mb-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Integration Settings
        </h2>
      </div>

      {/* Settings List */}
      <div className="flex-1 divide-y divide-slate-100 flex flex-col justify-around">
        {settings.map((item) => (
          <IntegrationSettingItem
            key={item.id}
            setting={item}
            onClick={onSelectSetting}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationSettings;
