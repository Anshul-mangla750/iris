import React from 'react';
import { X, Database, CheckCircle2 } from 'lucide-react';
import type { SystemMaintenance } from '../../types/settings';

interface DatabaseManageModalProps {
  maintenance: SystemMaintenance;
  isOpen: boolean;
  onClose: () => void;
  onOptimize: () => void;
}

export const DatabaseManageModal: React.FC<DatabaseManageModalProps> = ({
  maintenance,
  isOpen,
  onClose,
  onOptimize,
}) => {
  if (!isOpen) return null;

  const storageBreakdown = [
    { label: 'Event Logs & Footfall Dwell Times', size: '5.6 GB', percent: 45, color: 'bg-emerald-500' },
    { label: 'Planogram Image Snapshots & Bounding Boxes', size: '3.8 GB', percent: 31, color: 'bg-blue-500' },
    { label: 'PostgreSQL Relational Tables & Indexes', size: '2.1 GB', percent: 17, color: 'bg-amber-500' },
    { label: 'Audit Trail & Access Logs', size: '0.9 GB', percent: 7, color: 'bg-indigo-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database & Storage Manager</h3>
              <p className="text-[11px] text-slate-500">
                Total utilized space: {maintenance.databaseSizeGB} GB / 20 GB allocated
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4">
          {/* Visual Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium mb-1.5">
              <span>Disk Utilization</span>
              <span className="font-bold text-slate-900">62% Used</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              {storageBreakdown.map((item) => (
                <div
                  key={item.label}
                  className={`h-full ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                  title={`${item.label}: ${item.size}`}
                />
              ))}
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            {storageBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-slate-700">{item.label}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.size}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Database health is optimal. Auto-vacuuming runs daily at 03:00 AM UTC.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onOptimize();
              onClose();
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Optimize & Reindex
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManageModal;
