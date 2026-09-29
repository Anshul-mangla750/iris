import React from 'react';
import IntegrationStatusRow from './IntegrationStatusRow';
import type { Integration } from '../../types/integration';

interface IntegrationStatusProps {
  integrations: Integration[];
  onConfigure: (integration: Integration) => void;
  onTestConnection: (integration: Integration) => void;
  onSyncNow: (integration: Integration) => void;
  onToggleStatus: (integration: Integration) => void;
  onViewAll?: () => void;
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  integrations,
  onConfigure,
  onTestConnection,
  onSyncNow,
  onToggleStatus,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Integration Status
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <span className="text-slate-400">→</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-600 tracking-wider">
              <th className="py-2 px-2">System</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Last Sync</th>
              <th className="py-2 px-2">Sync Frequency</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((item) => (
              <IntegrationStatusRow
                key={item.id}
                integration={item}
                onConfigure={onConfigure}
                onTestConnection={onTestConnection}
                onSyncNow={onSyncNow}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IntegrationStatus;
