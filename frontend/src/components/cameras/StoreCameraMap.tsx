import React, { useState } from 'react';
import { ChevronDown, Video } from 'lucide-react';
import type { Camera, CameraLocationMarker } from '../../types/camera';

interface StoreCameraMapProps {
  locations: CameraLocationMarker[];
  selectedCamera: Camera | null;
  onSelectCamera: (cameraId: string) => void;
  onViewCamera: (camera: Camera) => void;
  cameras: Camera[];
}

export const StoreCameraMap: React.FC<StoreCameraMapProps> = ({
  locations,
  selectedCamera: _selectedCamera,
  onSelectCamera,
  onViewCamera,
  cameras,
}) => {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Store 001 - City Mall');
  const [activePopupCamId, setActivePopupCamId] = useState<string | null>(null);

  const storeOptions = [
    'Store 001 - City Mall',
    'Store 002 - Pacific Mall',
    'Store 003 - Select Citywalk',
    'Store 004 - DLF Avenue',
  ];

  const activeCam = cameras.find((c) => c.id === activePopupCamId) || cameras[0];
  const activeLoc = locations.find((l) => l.cameraId === activePopupCamId) || locations[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs flex flex-col h-full">
      {/* Card Header: Title & Store Selector Dropdown */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight">
          Store Layout - Camera Locations
        </h2>

        {/* Store Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
            className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span className="truncate max-w-[130px]">{selectedStore}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {storeDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
              {storeOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setSelectedStore(st);
                    setStoreDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                    selectedStore === st ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Floor Plan Canvas */}
      <div className="relative w-full flex-1 min-h-[220px] rounded-lg overflow-hidden border border-slate-200/70 bg-slate-50/30 flex items-center justify-center mt-2 select-none group">
        <img
          src="/images/cameras/store_layout.png"
          alt="Store Floor Plan - Camera Locations"
          className="w-full h-full object-contain"
        />

        {/* Interactive Clickable Hotspots for Camera Markers */}
        {locations.map((loc, idx) => {
          const camId = loc.cameraId || (loc as any).id || `cam-marker-${idx}`;
          const isSelected = activePopupCamId === camId;
          const x = loc.xPct ?? (loc as any).x ?? (20 + idx * 15);
          const y = loc.yPct ?? (loc as any).y ?? (30 + (idx % 2) * 20);
          const isOnline = loc.status === 'ONLINE';

          return (
            <button
              key={camId}
              type="button"
              onClick={() => {
                setActivePopupCamId(activePopupCamId === camId ? null : camId);
                onSelectCamera(camId);
              }}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-md ${
                isOnline
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                  : 'bg-red-500 text-white ring-2 ring-red-300'
              } ${
                isSelected
                  ? 'scale-125 ring-4 ring-emerald-400'
                  : 'hover:scale-110'
              }`}
              title={`${loc.cameraName || 'Camera'} (${loc.status})`}
              aria-label={`Select ${loc.cameraName || 'Camera'}`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
            </button>
          );
        })}

        {/* Camera Details Dynamic Popup */}
        {activePopupCamId && activeCam && activeLoc && (
          <div
            style={{
              left: `${Math.min(Math.max(activeLoc.xPct + 4, 10), 65)}%`,
              top: `${Math.min(Math.max(activeLoc.yPct - 6, 12), 60)}%`,
            }}
            className="absolute z-20 bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200 shadow-xl p-2 sm:p-2.5 w-[155px] animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-800 truncate" title={activeCam.name}>
                {activeCam.name}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[8.5px] font-bold ${
                  activeCam.status === 'ONLINE' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${
                    activeCam.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                <span>{activeCam.status === 'ONLINE' ? 'Online' : 'Offline'}</span>
              </span>
            </div>

            <div className="text-[9px] text-slate-600 py-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">People:</span>
                <span className="font-bold text-slate-800">{activeLoc.peopleInFrame}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Traffic:</span>
                <span
                  className={`font-bold ${
                    activeLoc.trafficLevel === 'High'
                      ? 'text-red-500'
                      : activeLoc.trafficLevel === 'Medium'
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}
                >
                  {activeLoc.trafficLevel}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewCamera(activeCam)}
              className="w-full mt-1 py-1 px-1.5 bg-[#0fa968] hover:bg-[#0c8f58] text-white rounded text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            >
              <Video className="w-2.5 h-2.5" />
              <span>View Camera</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCameraMap;
