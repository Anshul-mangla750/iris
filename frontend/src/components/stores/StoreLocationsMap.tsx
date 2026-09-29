import React, { useState } from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';
import type { Store } from '../../types/store';
import { formatCurrencyINR, formatNumberIN } from '../../utils/formatters';

interface StoreLocationsMapProps {
  stores: Store[];
  selectedStore: Store | null;
  onSelectStore: (store: Store) => void;
  onViewStoreDetails?: (store: Store) => void;
}

export const StoreLocationsMap: React.FC<StoreLocationsMapProps> = ({
  stores,
  selectedStore,
  onSelectStore,
  onViewStoreDetails,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    if (stores.length > 0) {
      onSelectStore(stores[0]);
    }
  };

  const activeStore = selectedStore || stores[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Store Locations
        </h3>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[240px] sm:h-[250px] rounded-lg overflow-hidden border border-slate-200/80 bg-slate-50 select-none">
        {/* Scalable Map Layer */}
        <div
          className="w-full h-full relative transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Authentic Map Background */}
          <img
            src="/images/stores/delhi_map_canvas.png"
            alt="Delhi NCR Store Locations Map"
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Interactive Invisible Click Zones Overlaid on Map Pins */}
          {/* Store 001 (City Mall - Center North) */}
          <button
            type="button"
            onClick={() => onSelectStore(stores[0])}
            className="absolute left-[38%] top-[25%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-pointer z-10"
            title="Store 001 - City Mall"
            aria-label="Select Store 001"
          />

          {/* Store 002 (Pacific Mall - West) */}
          <button
            type="button"
            onClick={() => stores[1] && onSelectStore(stores[1])}
            className="absolute left-[20%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-pointer z-10"
            title="Store 002 - Pacific Mall"
            aria-label="Select Store 002"
          />

          {/* Store 003 (Select Citywalk - Alert - South-East) */}
          <button
            type="button"
            onClick={() => stores[2] && onSelectStore(stores[2])}
            className="absolute left-[57%] top-[37%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-pointer z-10"
            title="Store 003 - Select Citywalk (Alert)"
            aria-label="Select Store 003"
          />

          {/* Store 005 (Ambience Mall - Gurgaon) */}
          <button
            type="button"
            onClick={() => stores[4] && onSelectStore(stores[4])}
            className="absolute left-[27%] top-[65%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-pointer z-10"
            title="Store 005 - Ambience Mall"
            aria-label="Select Store 005"
          />

          {/* Selected Store Dynamic Popup matching reference */}
          {activeStore && (
            <div
              onClick={() => onViewStoreDetails?.(activeStore)}
              className="absolute left-[24%] top-[29%] z-20 bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200 shadow-xl p-2 sm:p-2.5 w-[185px] animate-in fade-in zoom-in-95 duration-150 pointer-events-auto cursor-pointer hover:border-emerald-400 transition-colors"
              title="Click to view details"
            >
              <div className="flex items-start gap-2">
                <img
                  src={activeStore.image || '/images/stores/store_001_thumb.png'}
                  alt={activeStore.name}
                  className="w-12 h-11 rounded-md object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11.5px] font-bold text-slate-900 truncate">
                    {activeStore.code}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">
                    {activeStore.name.includes('-')
                      ? activeStore.name.split('-')[1]?.trim()
                      : activeStore.name}
                    , {activeStore.city}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeStore.status === 'ONLINE'
                          ? 'bg-emerald-500'
                          : activeStore.status === 'ALERT'
                          ? 'bg-red-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span
                      className={`text-[9.5px] font-bold ${
                        activeStore.status === 'ONLINE'
                          ? 'text-emerald-600'
                          : activeStore.status === 'ALERT'
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {activeStore.status === 'ONLINE'
                        ? 'Online'
                        : activeStore.status === 'ALERT'
                        ? 'Alert'
                        : 'Offline'}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1 space-y-0.5">
                    <div>
                      <span className="text-slate-400">Footfall: </span>
                      <span className="font-bold text-slate-800">
                        {formatNumberIN(activeStore.footfall)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Sales: </span>
                      <span className="font-bold text-slate-800">
                        {formatCurrencyINR(activeStore.sales)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top-Left Map Controls */}
        <div className="absolute left-2.5 top-2.5 flex flex-col bg-white/95 rounded-lg border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden z-20">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Center Map"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top-Right Legend */}
        <div className="absolute right-2.5 top-2.5 bg-white/95 backdrop-blur-2xs rounded-lg border border-slate-200/90 shadow-2xs px-2.5 py-1.5 space-y-1 text-[10px] text-slate-700 z-20">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Store</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Store with Alerts</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Inactive Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocationsMap;
