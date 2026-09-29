import React from 'react';
import { X, Video, Activity, RotateCw, Bell, Edit2, Maximize2 } from 'lucide-react';
import type { Camera } from '../../types/camera';
import { getCameraStatusMeta } from '../../utils/cameraMeta';

interface CameraDetailsDrawerProps {
  camera: Camera | null;
  isOpen: boolean;
  onClose: () => void;
  onFullscreen: (camera: Camera) => void;
  onEditCamera: (camera: Camera) => void;
  onRestartCamera: (camera: Camera) => void;
  onViewAlerts: (camera: Camera) => void;
}

export const CameraDetailsDrawer: React.FC<CameraDetailsDrawerProps> = ({
  camera,
  isOpen,
  onClose,
  onFullscreen,
  onEditCamera,
  onRestartCamera,
  onViewAlerts,
}) => {
  if (!isOpen || !camera) return null;

  const statusMeta = getCameraStatusMeta(camera.status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {camera.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {camera.code}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Feed Snapshot Thumbnail */}
            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
              <img
                src={camera.image}
                alt={camera.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onFullscreen(camera)}
                className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 hover:bg-black/90 text-white rounded text-[10.5px] font-semibold flex items-center gap-1 backdrop-blur-xs transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fullscreen</span>
              </button>
            </div>

            {/* Status & Zone Summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">
                  Status
                </span>
                <span
                  className={`inline-flex items-center gap-1 mt-0.5 text-xs font-bold ${
                    camera.status === 'ONLINE' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`}
                  />
                  <span>{statusMeta.label}</span>
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">
                  Store / Zone
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                  {camera.zoneName}
                </span>
              </div>
            </div>

            {/* Hardware & Stream Telemetry */}
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                Technical Specifications
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Camera Type</span>
                <span className="font-semibold text-slate-800">{camera.type}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Resolution</span>
                <span className="font-semibold text-slate-800">{camera.resolution}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Frame Rate</span>
                <span className="font-semibold text-slate-800">{camera.fps} FPS</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Uptime</span>
                <span className="font-semibold text-slate-800">
                  {camera.uptime ? `${camera.uptime}%` : '--'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Storage Usage</span>
                <span className="font-semibold text-slate-800">
                  {camera.storageUsage ? `${camera.storageUsage}%` : '--'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">AI Processing</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <Activity className="w-3 h-3" />
                  <span>{camera.aiProcessingStatus}</span>
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Stream RTSP</span>
                <span className="font-mono text-[10px] text-slate-600 truncate max-w-[190px]">
                  {camera.streamIdentifier}
                </span>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => onEditCamera(camera)}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Camera Configuration</span>
              </button>

              <button
                type="button"
                onClick={() => onRestartCamera(camera)}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restart Device</span>
              </button>

              <button
                type="button"
                onClick={() => onViewAlerts(camera)}
                className="w-full py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100/80 text-red-700 border border-red-200/80 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>View Camera Alerts</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CameraDetailsDrawer;
