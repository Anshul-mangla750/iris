import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ShelfViewData } from '../../types/inventory';

interface LiveShelfViewProps {
  data: ShelfViewData;
}

export const LiveShelfView: React.FC<LiveShelfViewProps> = ({ data }) => {
  const [selectedAisle, setSelectedAisle] = useState(data.aisle || 'Aisle 2 - Snacks');
  const [selectedCamera, setSelectedCamera] = useState(data.camera || 'Camera 1');

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-3.5 flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[13.5px] font-bold text-slate-800 tracking-tight">
            Live Shelf View
          </h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2">
          {/* Aisle Selector */}
          <div className="relative">
            <select
              value={selectedAisle}
              onChange={(e) => setSelectedAisle(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
            >
              <option value="Aisle 2 - Snacks">Aisle 2 - Snacks</option>
              <option value="Aisle 1 - Staples">Aisle 1 - Staples</option>
              <option value="Aisle 3 - Beverages">Aisle 3 - Beverages</option>
              <option value="Aisle 4 - Dairy">Aisle 4 - Dairy</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Camera Selector */}
          <div className="relative">
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md py-1 pl-2.5 pr-6 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
            >
              <option value="Camera 1">Camera 1</option>
              <option value="Camera 2">Camera 2</option>
              <option value="Camera 3">Camera 3</option>
              <option value="Laptop Webcam (Live AI)">Laptop Webcam (Live AI)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Live Shelf Camera View */}
      <div className="relative w-full rounded-lg overflow-hidden border border-slate-200/80 bg-slate-900 group">
        <img
          src={
            selectedCamera === 'Laptop Webcam (Live AI)'
              ? 'http://localhost:8100/camera/stream'
              : data.imageUrl || '/images/inventory/shelf_live.png'
          }
          alt="Live Shelf Monitoring"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = data.imageUrl || '/images/inventory/shelf_live.png';
          }}
          className="w-full h-auto object-cover block aspect-16/10"
        />

        {/* Ambient bottom status bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90 bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
          <span>{selectedAisle} • {selectedCamera}</span>
          <span className="text-emerald-400 font-bold">AI Detection Active</span>
        </div>
      </div>
    </div>
  );
};

export default LiveShelfView;
