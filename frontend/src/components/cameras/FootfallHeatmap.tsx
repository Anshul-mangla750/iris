import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CameraHeatmap } from '../../types/camera';

interface FootfallHeatmapProps {
  heatmap: CameraHeatmap | null;
}

export const FootfallHeatmap: React.FC<FootfallHeatmapProps> = ({ heatmap }) => {
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

  const periodOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs flex flex-col h-full">
      {/* Card Header: Title & Period Dropdown */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight">
          Footfall Heatmap (Camera Analytics)
        </h2>

        {/* Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {periodDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
              {periodOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(opt);
                    setPeriodDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                    selectedPeriod === opt ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Visual & Gradient Legend Container */}
      <div className="relative w-full flex-1 min-h-[175px] rounded-lg overflow-hidden border border-slate-200/70 bg-slate-50/40 flex items-center justify-between p-2 mt-2 gap-2 select-none">
        {/* Heatmap Floorplan Image */}
        <div className="relative flex-1 h-full min-h-[160px] flex items-center justify-center rounded overflow-hidden">
          <img
            src={heatmap?.floorPlanUrl || '/images/cameras/heatmap.png'}
            alt="Store Footfall Heatmap"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Vertical Color Bar Gradient Legend */}
        <div className="flex flex-col items-center justify-between h-[150px] py-1 text-[9.5px] font-semibold text-slate-600 shrink-0">
          <span className="text-slate-700">High</span>
          <div className="w-2.5 h-[95px] rounded-full bg-linear-to-b from-red-500 via-yellow-400 to-blue-500 border border-slate-200/80 shadow-2xs my-1" />
          <span className="text-slate-500">Medium</span>
          <span className="text-slate-400">Low</span>
        </div>
      </div>
    </div>
  );
};

export default FootfallHeatmap;
