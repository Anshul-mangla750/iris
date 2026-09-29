import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import type { LowStockProductItem } from '../../types/inventory';
import { PlusCircle } from 'lucide-react';

interface LowStockItemsTableProps {
  items: LowStockProductItem[];
  loading?: boolean;
  onViewAll?: () => void;
  onRestockItem?: (item: LowStockProductItem) => void;
}

export const LowStockItemsTable: React.FC<LowStockItemsTableProps> = ({
  items,
  loading,
  onViewAll,
  onRestockItem,
}) => {
  return (
    <DashboardCard
      title="Low Stock & Out of Stock Items"
      className="h-full"
      loading={loading}
      action={
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          View All
        </button>
      }
    >
      <div className="overflow-x-auto -mx-3.5 -mb-3.5 mt-1">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[9.5px] tracking-wider">
              <th className="py-2 pl-3.5 pr-2 w-8">#</th>
              <th className="py-2 px-2">Product Name</th>
              <th className="py-2 px-2">SKU</th>
              <th className="py-2 px-2 text-center">Current</th>
              <th className="py-2 px-2 text-center">Target</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Aisle / Shelf</th>
              <th className="py-2 px-2">Last Detected</th>
              <th className="py-2 pl-2 pr-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 pl-3.5 pr-2 text-slate-400 font-medium">{idx + 1}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-5 h-5 object-contain rounded shrink-0 border border-slate-200/60 bg-white"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="font-bold text-slate-800 whitespace-nowrap">
                      {item.productName}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 text-slate-500 font-mono text-[10.5px]">
                  {item.sku}
                </td>
                <td className="py-2 px-2 text-center">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10.5px] font-bold ${
                      item.currentStock === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.currentStock}
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-slate-600 font-medium">
                  {item.expectedStock}
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Out of Stock'
                        ? 'bg-red-50 text-red-600 border border-red-200/80'
                        : 'bg-amber-50 text-amber-600 border border-amber-200/80'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-slate-600 whitespace-nowrap">{item.aisleShelf}</td>
                <td className="py-2 px-2 text-slate-400 text-[10.5px] whitespace-nowrap">
                  {item.lastDetected}
                </td>
                <td className="py-2 pl-2 pr-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onRestockItem?.(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors shadow-2xs active:scale-95"
                  >
                    <PlusCircle className="w-3 h-3 text-emerald-600" />
                    <span>Restock</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default LowStockItemsTable;
