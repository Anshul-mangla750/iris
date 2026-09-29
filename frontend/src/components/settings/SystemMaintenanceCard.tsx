import React from 'react';
import { Wrench } from 'lucide-react';
import type { SystemMaintenance } from '../../types/settings';

interface SystemMaintenanceCardProps {
  maintenance: SystemMaintenance;
  onBackupNow: () => void;
  onManageDatabase: () => void;
  onClearCache: () => void;
}

export const SystemMaintenanceCard: React.FC<SystemMaintenanceCardProps> = ({
  maintenance,
  onBackupNow,
  onManageDatabase,
  onClearCache,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs mt-4">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <Wrench className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">System Maintenance</h2>
          <p className="text-[11px] text-slate-500">System updates and maintenance tools.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* 1. Software Version */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-800">Software Version</span>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-600 font-medium">{maintenance.softwareVersion}</span>
            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#e8f8f0] text-[#0fa968] border border-[#0fa968]/20">
              Up to date
            </span>
          </div>
        </div>

        {/* 2. Last Backup */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-800">Last Backup</span>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-500">{maintenance.lastBackupAt}</span>
            <button
              type="button"
              onClick={onBackupNow}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              Backup Now
            </button>
          </div>
        </div>

        {/* 3. Database Size */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-800">Database Size</span>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-500">{maintenance.databaseSizeGB} GB</span>
            <button
              type="button"
              onClick={onManageDatabase}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              Manage
            </button>
          </div>
        </div>

        {/* 4. Clear Cache */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-800 leading-tight">Clear Cache</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Free up system cache</p>
          </div>
          <button
            type="button"
            onClick={onClearCache}
            className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemMaintenanceCard;
