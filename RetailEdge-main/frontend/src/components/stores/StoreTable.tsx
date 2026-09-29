import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Store } from '../../types/store';
import { getStoreStatusMeta } from '../../utils/storeMeta';
import { formatCurrencyINR, formatNumberIN } from '../../utils/formatters';

interface StoreTableProps {
  stores: Store[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  region: string;
  status: string;
  onSearchChange: (search: string) => void;
  onRegionChange: (region: string) => void;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onViewStore: (store: Store) => void;
  onSelectStore: (store: Store) => void;
}

export const StoreTable: React.FC<StoreTableProps> = ({
  stores,
  total,
  page,
  limit,
  totalPages,
  search,
  region,
  status,
  onSearchChange,
  onRegionChange,
  onStatusChange,
  onPageChange,
  onExport,
  onViewStore,
  onSelectStore,
}) => {
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const regionOptions = ['All Regions', 'North', 'South', 'East', 'West'];
  const statusOptions = ['All Status', 'Online', 'Alert', 'Offline', 'Maintenance'];

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
            All Stores
          </h3>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stores..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white w-44 sm:w-56 transition-all"
            />
          </div>
        </div>

        {/* Right Filter Dropdowns & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRegionDropdownOpen(!regionDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs"
            >
              <span>{region}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {regionDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {regionOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onRegionChange(r);
                      setRegionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 hover:bg-slate-50 transition-colors ${
                      region === r ? 'text-emerald-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setRegionDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 shadow-2xs"
            >
              <span>{status}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onStatusChange(s);
                      setStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 hover:bg-slate-50 transition-colors ${
                      status === s ? 'text-emerald-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0fa968] hover:bg-[#0c8f58] text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-w-0">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="py-2 px-2 font-medium w-8">#</th>
              <th className="py-2 px-2 font-medium min-w-[160px]">Store Name</th>
              <th className="py-2 px-2 font-medium">Location</th>
              <th className="py-2 px-2 font-medium">Region</th>
              <th className="py-2 px-2 font-medium text-center">Status</th>
              <th className="py-2 px-2 font-medium">Footfall (Today)</th>
              <th className="py-2 px-2 font-medium">Sales (Today)</th>
              <th className="py-2 px-2 font-medium">Devices</th>
              <th className="py-2 px-2 font-medium min-w-[130px]">Last Updated</th>
              <th className="py-2 px-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stores.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                  No stores match the selected search or filter criteria.
                </td>
              </tr>
            ) : (
              stores.map((store, index) => {
                const statusMeta = getStoreStatusMeta(store.status);
                const rowNum = (page - 1) * limit + index + 1;

                return (
                  <tr
                    key={store.id}
                    onClick={() => onSelectStore(store)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Index */}
                    <td className="py-2 px-2 text-slate-400 font-medium">{rowNum}</td>

                    {/* Store Name + Thumbnail */}
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={store.image || '/images/stores/store_001_tab.png'}
                          alt={store.name}
                          className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {store.name}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-2 px-2 text-slate-600 font-medium">
                      {store.city}
                    </td>

                    {/* Region */}
                    <td className="py-2 px-2 text-slate-500 font-medium">
                      {store.region}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2 px-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-semibold ${statusMeta.pillClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                        <span>{statusMeta.label}</span>
                      </span>
                    </td>

                    {/* Footfall (Today) */}
                    <td className="py-2 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">
                          {formatNumberIN(store.footfall)}
                        </span>
                        <span
                          className={`text-[9.5px] font-semibold ${
                            store.footfallTrend >= 0 ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {store.footfallTrend >= 0 ? `↑ ${store.footfallTrend}%` : `↓ ${Math.abs(store.footfallTrend)}%`}
                        </span>
                      </div>
                    </td>

                    {/* Sales (Today) */}
                    <td className="py-2 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">
                          {formatCurrencyINR(store.sales)}
                        </span>
                        <span
                          className={`text-[9.5px] font-semibold ${
                            store.salesTrend >= 0 ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {store.salesTrend >= 0 ? `↑ ${store.salesTrend}%` : `↓ ${Math.abs(store.salesTrend)}%`}
                        </span>
                      </div>
                    </td>

                    {/* Devices */}
                    <td className="py-2 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            store.status === 'ALERT' || (store.devicesOnline / store.devicesTotal < 0.75)
                              ? 'bg-red-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-700">
                          {store.devicesOnline} / {store.devicesTotal}
                        </span>
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="py-2 px-2 text-slate-500 whitespace-nowrap text-[10.5px]">
                      {store.lastUpdatedAt}
                    </td>

                    {/* Action */}
                    <td className="py-2 px-2 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewStore(store);
                          }}
                          className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-medium transition-colors shadow-2xs"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === store.id ? null : store.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Options Menu */}
                        {openMenuId === store.id && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-left text-xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewStore(store);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectStore(store);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              Show on Map
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

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="text-slate-500 font-medium">
          Showing {total > 0 ? startIndex : 0} to {endIndex} of {total} stores
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-6 h-6 rounded text-[11px] font-bold transition-all ${
                page === p
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreTable;
