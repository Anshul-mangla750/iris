import React from 'react';
import { X, HardDrive, Check } from 'lucide-react';

interface BackupConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isBackingUp?: boolean;
}

export const BackupConfirmModal: React.FC<BackupConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isBackingUp = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">System Backup</h3>
              <p className="text-[11px] text-slate-500">Create a snapshot of platform data</p>
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

        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Create an immediate system snapshot? This will archive database tables, store
            configurations, user access logs, and integration mappings to encrypted cold storage.
          </p>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/60 text-[11px] text-emerald-800">
            Estimated archive size: <strong>~12.4 GB</strong> (Stored securely in AWS S3 ap-south-1).
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isBackingUp}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isBackingUp}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0fa968] hover:bg-[#0d8f58] rounded-lg transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isBackingUp ? 'Creating Backup...' : 'Backup Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupConfirmModal;
