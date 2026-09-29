import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Server } from 'lucide-react';
import type { SystemMaintenance, SystemStatus } from '../../types/settings';

interface SystemSettingsPanelProps {
  maintenance: SystemMaintenance;
  systemStatus: SystemStatus;
  onBackupNow: () => void;
  onManageDatabase: () => void;
  onClearCache: () => void;
}

export const SystemSettingsPanel: React.FC<SystemSettingsPanelProps> = ({
  maintenance,
  systemStatus,
  onBackupNow,
  onManageDatabase,
  onClearCache,
}) => {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const handleCheckUpdate = () => {
    setCheckingUpdate(true);
    setUpdateMsg(null);
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateMsg('RetailEdge AI is running the latest stable release (v2.4.1).');
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">System Infrastructure & Diagnostics</h2>
            <p className="text-xs text-slate-500">
              Host performance, database allocation, snapshot backups and updates
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCheckUpdate}
          disabled={checkingUpdate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdate ? 'animate-spin' : ''}`} />
          <span>Check for Updates</span>
        </button>
      </div>

      {updateMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* 4 Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-500 font-medium">Software Version</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-slate-900">{maintenance.softwareVersion}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Up to date
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-500 font-medium">Last Cloud Backup</p>
          <p className="text-xs font-bold text-slate-900 mt-1">{maintenance.lastBackupAt}</p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-500 font-medium">Database Allocated</p>
          <p className="text-sm font-bold text-slate-900 mt-1">
            {maintenance.databaseSizeGB} GB / {systemStatus.storageTotalGB} GB
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-500 font-medium">Memory Cache</p>
          <p className="text-sm font-bold text-slate-900 mt-1">{maintenance.cacheSizeMB} MB</p>
        </div>
      </div>

      {/* System Actions Row */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-900">Maintenance Operations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">Trigger Snapshot</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Generate hot backup to AWS S3</p>
            </div>
            <button
              type="button"
              onClick={onBackupNow}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              Backup Now
            </button>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">Storage Optimization</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Analyze table sizes and vacuum indices</p>
            </div>
            <button
              type="button"
              onClick={onManageDatabase}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              Manage Storage
            </button>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">Purge Application Cache</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Reclaim {maintenance.cacheSizeMB} MB of RAM</p>
            </div>
            <button
              type="button"
              onClick={onClearCache}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPanel;
