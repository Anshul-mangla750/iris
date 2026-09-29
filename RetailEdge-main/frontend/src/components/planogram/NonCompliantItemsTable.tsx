import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import type { NonCompliantProductItem } from '../../types/planogram';

interface NonCompliantItemsTableProps {
  items: NonCompliantProductItem[];
  loading?: boolean;
  onViewAll?: () => void;
  onActionClick?: (item: NonCompliantProductItem) => void;
}

export const NonCompliantItemsTable: React.FC<NonCompliantItemsTableProps> = ({
  items,
  loading,
  onViewAll,
  onActionClick,
}) => {
  const getIssueBadge = (issue: NonCompliantProductItem['issueType']) => {
    switch (issue) {
      case 'Missing':
        return 'bg-red-50 text-red-600 border border-red-200/80';
      case 'Misplaced':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80';
      case 'Extra Product':
        return 'bg-purple-50 text-purple-700 border border-purple-200/80';
      case 'Wrong Position':
        return 'bg-orange-50 text-orange-700 border border-orange-200/80';
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    }
  };

  const getActionButton = (action: NonCompliantProductItem['actionText']) => {
    switch (action) {
      case 'Restock':
        return 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80';
      case 'Reposition':
        return 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80';
      case 'Remove':
        return 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80';
      default:
        return 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <DashboardCard
      title="Non-Compliant Items"
      className="h-full"
      loading={loading}
      headerAction={
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          View All
        </button>
      }
    >
      <div className="overflow-x-auto -mx-3.5 -mb-3.5 mt-0.5">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[9.5px] tracking-wider">
              <th className="py-2 pl-3.5 pr-2 w-7">#</th>
              <th className="py-2 px-2">Product</th>
              <th className="py-2 px-2">SKU</th>
              <th className="py-2 px-2">Issue Type</th>
              <th className="py-2 px-2">Aisle / Shelf</th>
              <th className="py-2 px-2 text-center">Image</th>
              <th className="py-2 pl-2 pr-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 pl-3.5 pr-2 text-slate-400 font-medium">{idx + 1}</td>
                <td className="py-2 px-2 font-bold text-slate-800 whitespace-nowrap">
                  {item.productName}
                </td>
                <td className="py-2 px-2 text-slate-500 font-mono text-[10.5px]">
                  {item.sku}
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getIssueBadge(
                      item.issueType
                    )}`}
                  >
                    {item.issueType}
                  </span>
                </td>
                <td className="py-2 px-2 text-slate-600 whitespace-nowrap">{item.aisleShelf}</td>
                <td className="py-2 px-2 text-center">
                  <div className="inline-block w-6 h-6 rounded overflow-hidden border border-slate-200/90 bg-slate-50">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </td>
                <td className="py-2 pl-2 pr-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onActionClick && onActionClick(item)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${getActionButton(
                      item.actionText
                    )}`}
                  >
                    {item.actionText}
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

export default NonCompliantItemsTable;
