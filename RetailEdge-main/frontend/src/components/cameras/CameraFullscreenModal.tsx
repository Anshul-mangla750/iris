import React from 'react';
import { X, Camera as CameraIcon, Activity, VideoOff } from 'lucide-react';
import type { Camera } from '../../types/camera';
import { getCameraStatusMeta } from '../../utils/cameraMeta';

interface CameraFullscreenModalProps {
  camera: Camera | null;
  isOpen: boolean;
  onClose: () => void;
  onSnapshot: (camera: Camera) => void;
  onAnalytics: (camera: Camera) => void;
}

export const CameraFullscreenModal: React.FC<CameraFullscreenModalProps> = ({
  camera,
  isOpen,
  onClose,
  onSnapshot,
  onAnalytics,
}) => {
  if (!isOpen || !camera) return null;

  const statusMeta = getCameraStatusMeta(camera.status);
  const isOffline = camera.status === 'OFFLINE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Top Header */}
        <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm sm:text-base font-bold text-white">
              {camera.name}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
              <span>{statusMeta.label}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors"
            aria-label="Close fullscreen modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Feed Area */}
        <div className="relative aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
          {isOffline ? (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-white mb-3 shadow-lg">
                <VideoOff className="w-7 h-7" />
              </div>
              <div className="text-lg font-bold text-white">Camera Offline</div>
              <div className="text-xs text-slate-400 mt-1">
                Last seen: {camera.lastSeenAt}
              </div>
              <div className="text-xs text-slate-500 mt-2 max-w-xs">
                No active stream available. Connection timed out with Edge PoE switch.
              </div>
            </div>
          ) : (
            <img
              src={camera.image}
              alt={camera.name}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay Metadata Pills */}
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[10.5px] font-semibold text-white">
            <span className="px-2 py-1 rounded bg-black/75 backdrop-blur-xs">
              {camera.resolution}
            </span>
            <span className="px-2 py-1 rounded bg-black/75 backdrop-blur-xs">
              {camera.fps} fps
            </span>
            <span className="px-2 py-1 rounded bg-black/75 backdrop-blur-xs">
              Zone: {camera.zoneName}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-slate-800/90 border-t border-slate-700/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Stream: <code className="text-slate-300 font-mono">{camera.streamIdentifier}</code>
          </div>

          <div className="flex items-center gap-2">
            {!isOffline && (
              <>
                <button
                  type="button"
                  onClick={() => onSnapshot(camera)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
                >
                  <CameraIcon className="w-3.5 h-3.5" />
                  <span>Snapshot</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAnalytics(camera)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0c8f58] text-white text-xs font-semibold transition-colors"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFullscreenModal;
