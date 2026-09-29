import React from 'react';
import { Package, AlertCircle } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { LowStockProductItem } from '../../types/dashboard';

interface LowStockProductsProps {
  products: LowStockProductItem[];
  loading?: boolean;
  className?: string;
}

export const LowStockProducts: React.FC<LowStockProductsProps> = ({
  products,
  loading,
  className = '',
}) => {
  return (
    <DashboardCard
      title="Low Stock Products"
      className={`h-full flex flex-col ${className}`}
      headerAction={
        <button className="text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
          View All
        </button>
      }
      loading={loading}
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              <th className="pb-2 font-medium">Product</th>
              <th className="pb-2 font-medium text-center">Current Stock</th>
              <th className="pb-2 font-medium text-center">Threshold</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((item) => {
              const isOutOfStock = item.status === 'Out of Stock';
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        {isOutOfStock ? (
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                        ) : (
                          <Package className="w-3 h-3 text-slate-500" />
                        )}
                      </div>
                      <span className="font-medium text-slate-800 truncate max-w-[110px]" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-1 text-center font-semibold text-rose-600">
                    {item.currentStock}
                  </td>
                  <td className="py-2 px-1 text-center text-slate-600">
                    {item.threshold}
                  </td>
                  <td className="py-2 px-1">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        isOutOfStock
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOutOfStock ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 pl-2 text-right">
                    <button
                      onClick={() => alert(`Initiating restock order for ${item.name}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-[11px]"
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default LowStockProducts;
