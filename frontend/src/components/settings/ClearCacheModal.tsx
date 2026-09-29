import React from 'react';
import { X, Trash2, RefreshCw } from 'lucide-react';

interface ClearCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cacheSizeMB?: number;
}

export const ClearCacheModal: React.FC<ClearCacheModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cacheSizeMB = 480,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Clear System Cache</h3>
              <p className="text-[11px] text-slate-500">Purge Redis and temporary asset caches</p>
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
            Are you sure you want to clear system cache? This will invalidate Redis in-memory query
            results, thumbnail buffers, and API response caches.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
            Estimated space to be reclaimed: <strong>{cacheSizeMB} MB</strong>. First-time queries may
            take a few milliseconds longer as fresh caches populate.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearCacheModal;
