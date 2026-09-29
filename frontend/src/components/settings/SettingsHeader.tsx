import React from 'react';
import { RotateCcw } from 'lucide-react';

interface SettingsHeaderProps {
  onResetToDefault: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onResetToDefault }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
          Configure your stores, system preferences, integrations and all platform settings.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={onResetToDefault}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset to Default</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsHeader;
