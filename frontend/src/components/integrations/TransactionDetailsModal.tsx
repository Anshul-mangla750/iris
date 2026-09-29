import React from 'react';
import { X, ExternalLink, Receipt, CheckCircle, Clock } from 'lucide-react';
import type { PosTransaction } from '../../types/transaction';

interface TransactionDetailsModalProps {
  transaction: PosTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0fa968] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Transaction Details
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {transaction.transactionId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-slate-600">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Amount
              </span>
              <span className="text-lg font-bold text-slate-900">
                ₹ {transaction.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Status
              </span>
              <span
                className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                  transaction.syncStatus === 'Synced'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {transaction.syncStatus === 'Synced' ? (
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Clock className="w-3 h-3 text-amber-600" />
                )}
                {transaction.syncStatus}
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 space-y-2 pt-1">
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Time:</span>
              <span className="font-semibold text-slate-800">{transaction.timestamp}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Items Count:</span>
              <span className="font-semibold text-slate-800">{transaction.itemCount} items</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-semibold text-slate-800">{transaction.paymentMode}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">POS Source:</span>
              <span className="font-semibold text-slate-800">{transaction.posSource || 'POS Terminal 01'}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Store:</span>
              <span className="font-semibold text-slate-800">City Mall, Delhi (STORE001)</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Last Updated:</span>
              <span className="font-mono text-slate-600 text-[11px]">{transaction.createdAt || '2024-09-24T15:24:00Z'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => alert(`Opening raw payload for ${transaction.transactionId}`)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>View Source</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
