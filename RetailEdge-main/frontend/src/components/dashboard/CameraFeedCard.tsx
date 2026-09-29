import React, { useState, useEffect } from 'react';
import { Maximize2, Video } from 'lucide-react';
import type { CameraFeedItem } from '../../types/dashboard';

export interface CameraFeedCardProps {
  camera: CameraFeedItem;
  onExpand?: (camera: CameraFeedItem) => void;
}

export const CameraFeedCard: React.FC<CameraFeedCardProps> = ({ camera, onExpand }) => {
  const isPrimaryLiveCam = camera.id === 'cam-1' || camera.category === 'entrance';
  const [streamError, setStreamError] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTimestamp(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="group relative rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900 shadow-sm flex flex-col aspect-[16/10] select-none">
      {/* Live Stream for Entrance Camera or High-Def Snapshot */}
      {isPrimaryLiveCam && !streamError ? (
        <img
          src="http://localhost:8100/camera/stream"
          alt={camera.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setStreamError(true)}
        />
      ) : (
        <img
          src={camera.imageUrl}
          alt={camera.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/hero_store_pos.jpg';
          }}
        />
      )}

      {/* Top Overlay: Live Indicator & Edge Badge */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
        {isPrimaryLiveCam && !streamError && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-emerald-400 text-[8px] font-bold border border-emerald-500/40">
            <Video className="w-2.5 h-2.5 text-emerald-400" />
            <span>AI YOLO</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[#10B981] text-[8.5px] font-bold border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          Live
        </span>
      </div>

      {/* Bottom Overlay Info Banner */}
      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end justify-between">
        <div className="leading-tight min-w-0 pr-1">
          <div className="text-[10px] font-bold text-white truncate drop-shadow-xs">
            {camera.name}
          </div>
          <div className="text-[8.5px] text-emerald-300 font-mono font-medium">
            {liveTimestamp}
          </div>
        </div>

        {/* Expand Icon */}
        <button
          type="button"
          onClick={() => onExpand?.(camera)}
          className="text-slate-300 hover:text-white p-0.5 transition-colors focus:outline-none"
          aria-label={`Expand ${camera.name} feed`}
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default CameraFeedCard;
