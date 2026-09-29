import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetSettingsModal: React.FC<ResetSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Reset Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to restore settings to their default values? All system preferences,
            store parameters, and notification defaults will be reverted to factory presets.
          </p>
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200/60 text-[11px] text-amber-800">
            <strong>Notice:</strong> This action will not delete store master data or user accounts.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetSettingsModal;
