import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  RotateCw,
  Info,
  Edit2,
  Bell,
  Maximize2,
  Camera as CameraIcon,
  BarChart2,
  Video,
} from 'lucide-react';
import type { Camera } from '../../types/camera';
import { getCameraStatusMeta } from '../../utils/cameraMeta';

interface CameraFeedCardProps {
  camera: Camera;
  onFullscreen: (camera: Camera) => void;
  onSnapshot: (camera: Camera) => void;
  onAnalytics: (camera: Camera) => void;
  onViewDetails: (camera: Camera) => void;
  onEditCamera: (camera: Camera) => void;
  onRestartCamera: (camera: Camera) => void;
  onViewAlerts: (camera: Camera) => void;
}

export const CameraFeedCard: React.FC<CameraFeedCardProps> = ({
  camera,
  onFullscreen,
  onSnapshot,
  onAnalytics,
  onViewDetails,
  onEditCamera,
  onRestartCamera,
  onViewAlerts,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(
    camera.code === 'CAM-ENT-01' || camera.id === 'CAM001'
  );
  const [streamError, setStreamError] = useState(false);
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const statusMeta = getCameraStatusMeta(camera.status);
  const isOffline = camera.status === 'OFFLINE';

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const canStream = !isOffline && (camera.code === 'CAM-ENT-01' || camera.id === 'CAM001');

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col">
      {/* Card Header: Camera Name, Status Badge, Kebab Menu */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 bg-white">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="text-xs font-bold text-slate-800 truncate" title={camera.name}>
            {camera.name}
          </h3>
          {canStream && isLiveStreaming && !streamError && (
            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
              LIVE MJPEG
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
            <span>{statusMeta.label}</span>
          </div>

          {/* Kebab Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Camera Options"
              aria-label="Camera options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-xl py-1 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onViewDetails(camera);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onEditCamera(camera);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRestartCamera(camera);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Restart Camera</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={() => {
                    onViewAlerts(camera);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Alerts</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feed Area */}
      <div className="relative w-full aspect-16/9 bg-slate-950 overflow-hidden select-none group">
        {canStream && isLiveStreaming && !streamError ? (
          <img
            src="http://localhost:8100/camera/stream"
            alt={camera.name}
            className="w-full h-full object-cover"
            onError={() => setStreamError(true)}
          />
        ) : (
          <img
            src={camera.image}
            alt={camera.name}
            className={`w-full h-full object-cover transition-all duration-200 ${
              isOffline ? 'brightness-50 grayscale contrast-125' : 'brightness-95 group-hover:scale-[1.01]'
            }`}
          />
        )}

        {/* Top-Left Live HUD */}
        {!isOffline && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[9.5px] font-semibold text-white pointer-events-none">
            <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs flex items-center gap-1 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs border border-white/10 font-mono">
              {camera.fps || 30} FPS
            </span>
          </div>
        )}

        {/* Top-Right Toggle Stream Mode (if stream capable) */}
        {canStream && !isOffline && (
          <div className="absolute top-2 right-2">
            <button
              type="button"
              onClick={() => {
                setStreamError(false);
                setIsLiveStreaming(!isLiveStreaming);
              }}
              className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-black/80 hover:bg-black text-emerald-300 border border-emerald-500/50 backdrop-blur-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Toggle Live Edge AI Inference Stream"
            >
              <Video className="w-3 h-3 text-emerald-400" />
              <span>{isLiveStreaming && !streamError ? 'Live AI Stream' : 'Switch to Live'}</span>
            </button>
          </div>
        )}

        {/* Bottom Overlay: Time, Zone, and Quick Action Controls */}
        <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end justify-between">
          <div className="leading-tight text-white drop-shadow-sm">
            <div className="text-[10px] font-mono text-emerald-300 font-semibold flex items-center gap-1">
              <span>{liveTime}</span>
              <span className="text-slate-400">•</span>
              <span className="text-[9px] text-slate-300 font-sans">{camera.zoneName}</span>
            </div>
          </div>

          {/* Interactive Action Controls */}
          <div className="flex items-center gap-1">
            {isOffline ? (
              <button
                type="button"
                onClick={() => onRestartCamera(camera)}
                className="p-1.5 rounded bg-amber-500/80 hover:bg-amber-500 text-white transition-colors text-[10px] font-bold flex items-center gap-1"
                title="Restart / Reconnect Camera"
              >
                <RotateCw className="w-3 h-3 animate-spin" />
                <span>Reconnect</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onSnapshot(camera)}
                  className="p-1 rounded bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white transition-colors border border-white/20"
                  title="Take Snapshot"
                  aria-label="Take snapshot"
                >
                  <CameraIcon className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onAnalytics(camera)}
                  className="p-1 rounded bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white transition-colors border border-white/20"
                  title="Camera Analytics"
                  aria-label="Camera analytics"
                >
                  <BarChart2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onFullscreen(camera)}
                  className="p-1 rounded bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white transition-colors border border-white/20"
                  title="Fullscreen View"
                  aria-label="Fullscreen view"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFeedCard;
