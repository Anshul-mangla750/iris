import React from 'react';
import { VideoOff, RotateCw } from 'lucide-react';
import type { Camera } from '../../types/camera';

interface CameraFeedViewerProps {
  camera: Camera;
  mode?: 'MOCK' | 'LIVE' | 'OFFLINE';
  onRestart?: () => void;
  className?: string;
}

export const CameraFeedViewer: React.FC<CameraFeedViewerProps> = ({
  camera,
  mode = camera.status === 'OFFLINE' ? 'OFFLINE' : 'MOCK',
  onRestart,
  className = '',
}) => {
  const isOffline = mode === 'OFFLINE' || camera.status === 'OFFLINE';

  return (
    <div className={`relative w-full aspect-16/9 bg-slate-950 overflow-hidden rounded-b-xl select-none group ${className}`}>
      {/* Background Image / Stream Placeholder */}
      <img
        src={camera.image}
        alt={camera.name}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isOffline ? 'brightness-40 grayscale contrast-125' : 'brightness-95 group-hover:scale-[1.01]'
        }`}
      />

      {/* Offline Overlay State */}
      {isOffline && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40 backdrop-blur-2xs p-3 text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-white mb-2 shadow-lg">
            <VideoOff className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="text-sm font-bold text-white tracking-wide">
            Camera Offline
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">
            Last seen: {camera.lastSeenAt}
          </div>
          {onRestart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRestart();
              }}
              className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-[10.5px] font-semibold backdrop-blur-xs transition-all border border-white/30 active:scale-95"
            >
              <RotateCw className="w-3 h-3" />
              <span>Reconnect</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraFeedViewer;
