import React from 'react';
import { X, Truck, AlertTriangle } from 'lucide-react';
import type { LowStockProductItem } from '../../types/inventory';

interface RestockListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LowStockProductItem[];
}

export const RestockListModal: React.FC<RestockListModalProps> = ({
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
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Restock Priority List</h2>
              <p className="text-[11px] text-slate-400">
                Items currently at or below minimum inventory threshold
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
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {items.map((item) => {
            const shortage = item.expectedStock - item.currentStock;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200/90 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.productName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      SKU: {item.sku} • {item.aisleShelf}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[10.5px] text-slate-400 font-medium">Shortage</div>
                    <div className="text-xs font-black text-red-600">+{shortage} units</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Out of Stock'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Total {items.length} items flagged for restock
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0fa968] text-white text-xs font-bold hover:bg-emerald-600 shadow-xs transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestockListModal;
