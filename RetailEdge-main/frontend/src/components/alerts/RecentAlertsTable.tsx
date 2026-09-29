import React, { useState } from 'react';
import { ChevronDown, MoreVertical, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { Alert } from '../../types/alert';
import { getAlertStatusMeta, getAlertSourceMeta } from '../../utils/alertMeta';

interface RecentAlertsTableProps {
  alerts: Alert[];
  selectedAlertId?: string;
  onSelectAlert: (alert: Alert) => void;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onOpenAssignModal: (alert: Alert) => void;
}

export const RecentAlertsTable: React.FC<RecentAlertsTableProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onAcknowledge,
  onResolve,
  onOpenAssignModal,
}) => {
  const [filterType, setFilterType] = useState('All Alerts');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  const filteredAlerts = safeAlerts.filter((a) => {
    if (filterType === 'All Alerts') return true;
    if (filterType === 'Critical') return a.severity === 'CRITICAL';
    if (filterType === 'Warning') return a.severity === 'WARNING';
    if (filterType === 'Info') return a.severity === 'INFO';
    if (filterType === 'Open') return a.status === 'OPEN';
    return true;
  });

  const renderTypeIcon = (alert: Alert) => {
    if (alert.status === 'RESOLVED') {
      return (
        <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-500 flex items-center justify-center">
          <CheckCircle className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>
      );
    }
    if (alert.severity === 'CRITICAL') {
      return (
        <div className="w-5 h-5 rounded bg-red-50 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>
      );
    }
    if (alert.severity === 'WARNING') {
      return (
        <div className="w-5 h-5 rounded bg-amber-50 text-amber-500 flex items-center justify-center">
          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
        <Info className="w-3.5 h-3.5 stroke-[2.2]" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Recent Alerts
        </h3>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 hover:border-slate-300 shadow-2xs"
          >
            <span>{filterType}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {filterDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-[11px]">
              {['All Alerts', 'Critical', 'Warning', 'Info', 'Open'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setFilterType(t);
                    setFilterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1 hover:bg-slate-50 transition-colors ${
                    filterType === t ? 'text-emerald-600 font-bold' : 'text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-w-0">
        <table className="w-full text-left text-[11.5px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="py-1.5 px-2 font-medium">Time</th>
              <th className="py-1.5 px-1.5 font-medium">Type</th>
              <th className="py-1.5 px-2 font-medium">Category</th>
              <th className="py-1.5 px-2 font-medium min-w-[160px]">Message</th>
              <th className="py-1.5 px-2 font-medium">Store</th>
              <th className="py-1.5 px-2 font-medium text-center">Status</th>
              <th className="py-1.5 px-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                  No alerts match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => {
                const statusMeta = getAlertStatusMeta(alert.status);
                const sourceMeta = getAlertSourceMeta(alert.sourceModule);
                const isSelected = alert.id === selectedAlertId;

                // Format time string e.g. 03:24 PM
                const timeString = alert.createdAt.split(',')[0].trim();

                return (
                  <tr
                    key={alert.id}
                    className={`hover:bg-slate-50/80 transition-colors group ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    {/* Time */}
                    <td className="py-1 px-2 text-slate-500 whitespace-nowrap font-medium text-[10.5px]">
                      {timeString}
                    </td>

                    {/* Type */}
                    <td className="py-1 px-1.5 whitespace-nowrap">
                      {renderTypeIcon(alert)}
                    </td>

                    {/* Category */}
                    <td className="py-1 px-2 text-slate-700 whitespace-nowrap font-medium text-[11px]">
                      {sourceMeta.label}
                    </td>

                    {/* Message */}
                    <td className="py-1 px-2 text-slate-800 font-medium text-[11px]">
                      <span className="line-clamp-1">{alert.message}</span>
                    </td>

                    {/* Store */}
                    <td className="py-1 px-2 text-slate-500 whitespace-nowrap text-[10.5px]">
                      Store 001
                    </td>

                    {/* Status */}
                    <td className="py-1 px-2 whitespace-nowrap text-center">
                      <span
                        className={`inline-block px-2 py-0.2 rounded-full text-[9.5px] font-semibold ${statusMeta.pillClass}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-1 px-2 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5 relative">
                        <button
                          type="button"
                          onClick={() => onSelectAlert(alert)}
                          className={`px-2 py-0.5 rounded border text-[10.5px] font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(openMenuId === alert.id ? null : alert.id)
                          }
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Context Menu */}
                        {openMenuId === alert.id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-left text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectAlert(alert);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              View Details
                            </button>
                            {alert.status === 'OPEN' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onAcknowledge(alert.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-amber-600 font-medium"
                              >
                                Mark as In Progress
                              </button>
                            )}
                            {alert.status !== 'RESOLVED' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onResolve(alert.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-emerald-600 font-medium"
                              >
                                Mark as Resolved
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                onOpenAssignModal(alert);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              Assign to Staff
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAlertsTable;
