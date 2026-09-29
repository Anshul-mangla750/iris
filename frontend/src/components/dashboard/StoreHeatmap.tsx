import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { HeatmapZone } from '../../types/dashboard';

export interface StoreHeatmapProps {
  floorPlanUrl?: string;
  isLive?: boolean;
  zones?: HeatmapZone[];
}

export const StoreHeatmap: React.FC<StoreHeatmapProps> = ({
  floorPlanUrl = '/images/dashboard/heatmap_floorplan.jpg',
  isLive = true,
}) => {
  const [zoneFilter, setZoneFilter] = useState<'Entire Store' | 'Zone A' | 'Zone B'>('Entire Store');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const headerTitle = (
    <div className="flex items-center gap-2">
      <span className="text-[13px] sm:text-[14px] font-bold text-slate-800">Store Heatmap - Live</span>
      {isLive && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#0fa968] border border-emerald-200/80 text-[9.5px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] animate-pulse" />
          Live
        </span>
      )}
    </div>
  );

  const headerAction = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
      >
        <span>{zoneFilter}</span>
        <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-[10.5px] w-28">
          {(['Entire Store', 'Zone A', 'Zone B'] as const).map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => {
                setZoneFilter(z);
                setDropdownOpen(false);
              }}
              className={`w-full px-2.5 py-1 text-left ${
                zoneFilter === z ? 'bg-emerald-50 text-[#0fa968] font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DashboardCard title={headerTitle} headerAction={headerAction} className="h-full">
      <div className="flex items-center justify-between gap-3 h-44 sm:h-48 pt-1">
        {/* Store Floor Plan Blueprint with Heatmap Overlay */}
        <div className="relative flex-1 h-full rounded-lg overflow-hidden border border-slate-200/80 bg-slate-900/5 flex items-center justify-center">
          <img
            src={floorPlanUrl}
            alt="Store Heatmap Floorplan"
            className="w-full h-full object-contain select-none"
            onError={(e) => {
              // Fallback to simulated architectural blueprint
              (e.currentTarget as HTMLImageElement).src = '/images/solution_supermarket.jpg';
            }}
          />

          {/* Simulated Live Hotspot Pulsing Rings */}
          <div className="absolute top-[35%] left-[68%] w-8 h-8 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
          <div className="absolute top-[50%] left-[28%] w-6 h-6 rounded-full bg-amber-500/30 animate-pulse pointer-events-none" />
        </div>

        {/* Vertical Traffic Intensity Legend */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          {/* Vertical gradient bar */}
          <div className="w-1.5 h-32 rounded-full bg-gradient-to-b from-red-500 via-amber-400 to-blue-500 shadow-2xs" />

          {/* Legend labels */}
          <div className="flex flex-col justify-between h-32 text-[9.5px] text-slate-500 font-medium">
            <span className="text-red-600 font-bold">High Traffic</span>
            <span className="text-amber-600 font-medium">Medium Traffic</span>
            <span className="text-blue-600 font-medium">Low Traffic</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default StoreHeatmap;
