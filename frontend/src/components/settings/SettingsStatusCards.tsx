import React from 'react';
import { Settings, Database, ShieldCheck, Cloud } from 'lucide-react';
import type { SystemStatus } from '../../types/settings';

interface SettingsStatusCardsProps {
  status: SystemStatus;
}

export const SettingsStatusCards: React.FC<SettingsStatusCardsProps> = ({ status }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
      {/* 1. System Status */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium">System Status</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-sm font-bold text-slate-900">
              {status.systemHealth === 'HEALTHY' ? 'Healthy' : status.systemHealth}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">All services are running</p>
        </div>
      </div>

      {/* 2. Data Sync */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium">Data Sync</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-sm font-bold text-slate-900">
              {status.dataSync === 'UP_TO_DATE' ? 'Up to date' : 'Syncing'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            Last sync: {status.lastSyncTimestamp}
          </p>
        </div>
      </div>

      {/* 3. Security */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium">Security</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-sm font-bold text-slate-900">
              {status.security === 'PROTECTED' ? 'Protected' : 'Warning'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {status.twoFactorEnabled ? '2FA enabled' : '2FA disabled'}
          </p>
        </div>
      </div>

      {/* 4. Storage Usage */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
          <Cloud className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium">Storage Usage</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{status.storageUsedPercent}% Used</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${status.storageUsedPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
              {status.storageUsedGB} GB of {status.storageTotalGB} GB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsStatusCards;
