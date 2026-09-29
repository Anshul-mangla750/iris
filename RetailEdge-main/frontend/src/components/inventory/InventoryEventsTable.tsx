import React from 'react';
import { AlertTriangle, XCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { InventoryEventItem } from '../../types/inventory';

interface InventoryEventsTableProps {
  events: InventoryEventItem[];
  loading?: boolean;
  onViewAll?: () => void;
}

export const InventoryEventsTable: React.FC<InventoryEventsTableProps> = ({
  events,
  loading,
  onViewAll,
}) => {
  const renderEventIcon = (type: InventoryEventItem['eventType']) => {
    switch (type) {
      case 'stock_low':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'stock_out':
        return <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />;
      case 'restocked':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'mismatch':
        return <RefreshCw className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const getStatusBadge = (status: InventoryEventItem['status']) => {
    switch (status) {
      case 'Out of Stock':
        return 'bg-red-50 text-red-600 border border-red-200/80';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-600 border border-amber-200/80';
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200/80';
      case 'Misplaced':
        return 'bg-orange-50 text-orange-600 border border-orange-200/80';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <DashboardCard
      title="Recent Inventory Events"
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
              <th className="py-2 pl-3.5 pr-2">Time</th>
              <th className="py-2 px-2">Event</th>
              <th className="py-2 px-2">Product</th>
              <th className="py-2 px-2">Aisle / Shelf</th>
              <th className="py-2 pl-2 pr-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 pl-3.5 pr-2 text-slate-500 font-mono text-[10.5px] whitespace-nowrap">
                  {evt.time}
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-1.5">
                    {renderEventIcon(evt.eventType)}
                    <span className="font-semibold text-slate-700 whitespace-nowrap">
                      {evt.event}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 font-bold text-slate-800 whitespace-nowrap">
                  {evt.product}
                </td>
                <td className="py-2 px-2 text-slate-500 whitespace-nowrap">{evt.aisleShelf}</td>
                <td className="py-2 pl-2 pr-3.5 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(
                      evt.status
                    )}`}
                  >
                    {evt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default InventoryEventsTable;
