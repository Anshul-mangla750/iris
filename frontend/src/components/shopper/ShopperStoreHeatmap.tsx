import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { ShopperHeatmapZone } from '../../types/shopper';

interface ShopperStoreHeatmapProps {
  floorPlanUrl?: string;
  isLive?: boolean;
  zones?: ShopperHeatmapZone[];
  loading?: boolean;
}

export const ShopperStoreHeatmap: React.FC<ShopperStoreHeatmapProps> = ({
  floorPlanUrl = '/images/shopper/heatmap_floorplan.jpg',
  isLive = true,
  loading,
}) => {
  const [filter, setFilter] = useState<'Entire Store' | 'Produce Area' | 'Beverages'>('Entire Store');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DashboardCard
      title={
        <div className="flex items-center gap-2">
          <span className="text-[13px] sm:text-[14px] font-bold text-slate-800">Store Heatmap - Live</span>
          {isLive && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#0fa968] border border-emerald-200/80 text-[9.5px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] animate-pulse" />
              Live
            </span>
          )}
        </div>
      }
      headerAction={
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>{filter}</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setFilter('Entire Store');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-1 hover:bg-slate-50 font-medium"
              >
                Entire Store
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter('Produce Area');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-1 hover:bg-slate-50 font-medium"
              >
                Produce Area
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter('Beverages');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-1 hover:bg-slate-50 font-medium"
              >
                Beverages
              </button>
            </div>
          )}
        </div>
      }
      loading={loading}
    >
      <div className="flex items-center gap-2 h-44 sm:h-48 pt-1">
        {/* Heatmap Visual Container */}
        <div className="flex-1 h-full rounded-lg bg-slate-50 border border-slate-200/70 overflow-hidden relative flex items-center justify-center p-1">
          <img
            src={floorPlanUrl}
            alt="Store Floor Plan Heatmap"
            className="w-full h-full object-contain select-none"
          />
        </div>

        {/* Vertical Traffic Gradient Legend */}
        <div className="flex flex-col items-center justify-between h-36 py-1 shrink-0 px-1 text-[9.5px] font-bold text-slate-500">
          <span className="text-rose-600">High Traffic</span>
          <div className="w-1.5 flex-1 mx-auto my-1 rounded-full bg-gradient-to-b from-rose-500 via-amber-400 to-blue-500" />
          <span className="text-amber-600">Medium Traffic</span>
          <div className="w-1.5 flex-1 mx-auto my-1 rounded-full bg-gradient-to-b from-amber-400 to-blue-500" />
          <span className="text-blue-500">Low Traffic</span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default ShopperStoreHeatmap;
