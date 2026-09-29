import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import type { CounterStatusItem } from '../../types/queue';

interface LiveQueueCameraFeedProps {
  imageUrl?: string;
  loading?: boolean;
  counters?: CounterStatusItem[];
}

export const LiveQueueCameraFeed: React.FC<LiveQueueCameraFeedProps> = ({
  imageUrl = '/images/queues/camera_feed.png',
  loading,
  counters = [],
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sourceMode, setSourceMode] = useState<'laptop' | 'concourse'>('laptop');
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeSrc =
    sourceMode === 'laptop'
      ? 'http://localhost:8100/camera/stream'
      : imageUrl;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-3.5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[13.5px] font-bold text-slate-800 tracking-tight">
            Live Queue Camera Feed
          </h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {sourceMode === 'laptop' ? 'AI Stream Active' : 'Live'}
          </span>
        </div>

        {/* Source Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-[10px] font-semibold border border-slate-200">
          <button
            type="button"
            onClick={() => setSourceMode('laptop')}
            className={`px-2 py-0.5 rounded transition-all ${
              sourceMode === 'laptop'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laptop Cam (AI)
          </button>
          <button
            type="button"
            onClick={() => setSourceMode('concourse')}
            className={`px-2 py-0.5 rounded transition-all ${
              sourceMode === 'concourse'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Concourse
          </button>
        </div>
      </div>

      {/* Main Camera View */}
      <div className="relative w-full rounded-lg overflow-hidden border border-slate-200/80 bg-slate-900 group">
        {loading ? (
          <div className="w-full aspect-16/10 flex items-center justify-center bg-slate-900">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <img
            src={activeSrc}
            alt="Live Queue Camera Feed"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = imageUrl;
            }}
            className="w-full h-auto object-cover block aspect-16/10"
          />
        )}

        {/* Floating Counter Status Cards across Top */}
        <div className="absolute top-2 left-2 right-2 flex items-center gap-1.5 z-10 pointer-events-none">
          {/* Live indicator badge */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold border border-white/10 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live HUD
          </div>

          {/* Dynamic Counter cards */}
          <div className="grid grid-cols-5 gap-1 flex-1">
            {(counters.length > 0
              ? counters.slice(0, 5)
              : [
                  { id: '1', name: 'Counter 1', currentQueue: 4, status: 'Normal' },
                  { id: '2', name: 'Counter 2', currentQueue: 2, status: 'Normal' },
                  { id: '3', name: 'Counter 3', currentQueue: 6, status: 'Congested' },
                  { id: '4', name: 'Counter 4', currentQueue: 1, status: 'Normal' },
                  { id: '5', name: 'Counter 5', currentQueue: 3, status: 'Normal' },
                ]
            ).map((c) => {
              const isHigh = c.status === 'Congested' || c.currentQueue > 5;
              const isClosed = c.status === 'Closed';
              return (
                <div
                  key={c.id}
                  className="bg-white/95 backdrop-blur-xs rounded p-1 text-center border border-white/40 shadow-xs leading-none"
                >
                  <p className="text-[9.5px] font-bold text-slate-800 truncate">{c.name}</p>
                  <p className="text-[8px] text-slate-500 my-0.5">{c.currentQueue} queue</p>
                  <span
                    className={`text-[8.5px] font-black ${
                      isClosed
                        ? 'text-slate-400'
                        : isHigh
                        ? 'text-red-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Left Live Timestamp */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-emerald-300 font-mono text-[9px] font-bold flex items-center gap-1 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{liveTime}</span>
        </div>

        {/* Bottom Expand Button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute bottom-2 right-2 p-1.5 rounded-md bg-slate-900/70 hover:bg-slate-900/90 text-white/90 transition-colors shadow-xs z-10"
          title="Fullscreen Camera Feed"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Fullscreen Overlay Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-white text-xs">
              <span className="font-bold">Live Queue Camera Feed - Checkout Concourse</span>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <img src={imageUrl} alt="Expanded Camera Feed" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveQueueCameraFeed;
