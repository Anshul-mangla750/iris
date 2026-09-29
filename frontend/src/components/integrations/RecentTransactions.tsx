import React from 'react';
import type { PosTransaction } from '../../types/transaction';

interface RecentTransactionsProps {
  transactions: PosTransaction[];
  onSelectTransaction: (tx: PosTransaction) => void;
  onViewAll?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onSelectTransaction,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Recent POS Transactions
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
            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-600 tracking-wider">
              <th className="py-1.5 px-2">Time</th>
              <th className="py-1.5 px-2">Transaction ID</th>
              <th className="py-1.5 px-1.5 text-center">Items</th>
              <th className="py-1.5 px-2 text-right">Amount (₹)</th>
              <th className="py-1.5 px-2">Payment Mode</th>
              <th className="py-1.5 px-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer transition-colors text-xs text-slate-700"
              >
                <td className="py-1.5 px-2 text-[11px] text-slate-500 whitespace-nowrap">
                  {tx.timestamp}
                </td>
                <td className="py-1.5 px-2 text-[11px] font-semibold text-slate-800 whitespace-nowrap">
                  {tx.transactionId}
                </td>
                <td className="py-1.5 px-1.5 text-[11px] text-center text-slate-600 whitespace-nowrap">
                  {tx.itemCount}
                </td>
                <td className="py-1.5 px-2 text-[11px] font-semibold text-slate-800 text-right whitespace-nowrap">
                  {tx.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-1.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                  {tx.paymentMode}
                </td>
                <td className="py-1.5 px-2 text-center whitespace-nowrap">
                  {tx.syncStatus === 'Synced' ? (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10.5px] font-medium">
                      Synced
                    </span>
                  ) : tx.syncStatus === 'Syncing' ? (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10.5px] font-medium">
                      Syncing
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10.5px] font-medium">
                      Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
