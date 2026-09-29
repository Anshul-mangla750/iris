import React, { useState } from 'react';
import { X, Video, ShieldCheck, Activity, Laptop } from 'lucide-react';
import { cameraService } from '../../services/cameraService';

interface LiveViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
}

export const LiveViewModal: React.FC<LiveViewModalProps> = ({
  isOpen,
  onClose,
  storeName = 'Store 001 - City Mall, Delhi',
}) => {
  const [streamMode, setStreamMode] = useState<'reference' | 'live'>('live');
  const [isStartingCam, setIsStartingCam] = useState(false);

  if (!isOpen) return null;

  const handleStartLaptopCamera = async () => {
    setIsStartingCam(true);
    try {
      await cameraService.startLiveCamera('0', 'cam_0');
      setStreamMode('live');
    } catch {
      // fallback
    } finally {
      setIsStartingCam(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0fa968] flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  Live Edge Camera Feed — Entrance Stream
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#0fa968] border border-emerald-200/80 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968] animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-400">{storeName} • 30 FPS • Edge YOLOv8 Processing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stream source selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setStreamMode('live')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  streamMode === 'live'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Edge Stream
              </button>
              <button
                type="button"
                onClick={() => setStreamMode('reference')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  streamMode === 'reference'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reference Footage
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Preview with AI Overlays */}
        <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
          <img
            src={
              streamMode === 'live'
                ? 'http://localhost:8100/camera/stream'
                : '/images/shopper/cam_analytics.jpg'
            }
            alt="Live Camera Feed"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/shopper/cam_analytics.jpg';
            }}
          />
          {/* Top Live Timestamp */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs text-white text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {streamMode === 'live'
                ? 'FASTAPI :8100 • YOLOv8 + BYTETRACK • ANONYMOUS'
                : 'LATENCY: 42ms • DETECTIONS: 12'}
            </span>
          </div>

          {streamMode === 'live' && (
            <button
              type="button"
              onClick={handleStartLaptopCamera}
              disabled={isStartingCam}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors shadow-md"
            >
              <Laptop className="w-3 h-3" />
              <span>{isStartingCam ? 'Starting...' : 'Activate Laptop Cam'}</span>
            </button>
          )}

          {/* Bottom Stream Telemetry Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-slate-900/85 backdrop-blur-xs px-5 py-3 flex items-center justify-between text-white text-xs border-t border-white/10">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">In Frame</span>
                <span className="text-base font-bold text-emerald-400">12</span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-[10px] text-slate-400 block uppercase">Entering</span>
                <span className="text-base font-bold text-white">7</span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-[10px] text-slate-400 block uppercase">Exiting</span>
                <span className="text-base font-bold text-white">5</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Edge AI Model Active</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Real-time inference running on local store Edge Device
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveViewModal;
