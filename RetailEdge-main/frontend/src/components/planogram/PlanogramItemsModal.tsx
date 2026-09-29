import React from 'react';
import { X, ClipboardCheck } from 'lucide-react';
import type { NonCompliantProductItem } from '../../types/planogram';

interface PlanogramItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: NonCompliantProductItem[];
}

export const PlanogramItemsModal: React.FC<PlanogramItemsModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">All Non-Compliant Planogram Items</h2>
              <p className="text-[11px] text-slate-400">
                Detailed audit trail of items requiring restocking, repositioning, or removal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200/90 bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded overflow-hidden border border-slate-200 flex items-center justify-center shrink-0 bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.productName}</h4>
                  <p className="text-[10.5px] text-slate-400 font-mono">
                    SKU: {item.sku} • {item.aisleShelf}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {item.issueType}
                </span>
                <span className="px-2.5 py-1 rounded text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.actionText}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Total {items.length} items flagged for compliance correction
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0fa968] text-white text-xs font-bold hover:bg-emerald-600 shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanogramItemsModal;
