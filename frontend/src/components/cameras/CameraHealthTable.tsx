import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CameraHealthItem } from '../../types/camera';

interface CameraHealthTableProps {
  healthItems: CameraHealthItem[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  onViewAll?: () => void;
}

export const CameraHealthTable: React.FC<CameraHealthTableProps> = ({
  healthItems,
  selectedFilter,
  onFilterChange,
  onViewAll,
}) => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const filterOptions = ['All Cameras', 'Online', 'Offline', 'Maintenance', 'Error'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs flex flex-col h-full">
      {/* Card Header: Title & Filter Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight">
          Camera Health Status
        </h2>

        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <span>{selectedFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onFilterChange(opt);
                      setFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                      selectedFilter === opt ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-[11px] font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Health Table */}
      <div className="overflow-x-auto min-w-0 flex-1 mt-1">
        <table className="w-full text-left text-[10.5px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="py-1.5 px-1 font-medium">Camera Name</th>
              <th className="py-1.5 px-1 font-medium text-center">Status</th>
              <th className="py-1.5 px-1 font-medium text-right">Uptime</th>
              <th className="py-1.5 px-1 font-medium text-right">Storage</th>
              <th className="py-1.5 px-1 font-medium text-right">Last Checked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {healthItems.map((item) => {
              const isOffline = item.status === 'OFFLINE';

              return (
                <tr
                  key={item.cameraId}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Name */}
                  <td className="py-1.5 px-1 font-bold text-slate-800 truncate max-w-[130px]" title={item.cameraName}>
                    {item.cameraName}
                  </td>

                  {/* Status */}
                  <td className="py-1.5 px-1 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        isOffline
                          ? 'bg-red-50 text-red-700 border border-red-200/70'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOffline ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                      />
                      <span>{isOffline ? 'Offline' : 'Online'}</span>
                    </span>
                  </td>

                  {/* Uptime */}
                  <td className="py-1.5 px-1 text-right font-medium text-slate-600 whitespace-nowrap">
                    {item.uptime}
                  </td>

                  {/* Storage */}
                  <td className="py-1.5 px-1 text-right font-medium text-slate-600 whitespace-nowrap">
                    {item.storageUsage}
                  </td>

                  {/* Last Checked */}
                  <td
                    className={`py-1.5 px-1 text-right font-medium whitespace-nowrap ${
                      isOffline ? 'text-red-500 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {item.lastCheckedAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CameraHealthTable;
