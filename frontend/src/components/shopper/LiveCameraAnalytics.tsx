import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import type { CameraAnalyticsData } from '../../types/shopper';

interface LiveCameraAnalyticsProps {
  data: CameraAnalyticsData;
  loading?: boolean;
}

export const LiveCameraAnalytics: React.FC<LiveCameraAnalyticsProps> = ({
  data,
  loading,
}) => {
  const [selectedCamera, setSelectedCamera] = useState('Entrance');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [streamError, setStreamError] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    people: data.peopleInFrame || 4,
    entering: data.entering || 142,
    exiting: data.exiting || 128,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMetrics((prev) => ({
        people: Math.max(1, Math.min(8, prev.people + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        entering: prev.entering + (Math.random() > 0.8 ? 1 : 0),
        exiting: prev.exiting + (Math.random() > 0.85 ? 1 : 0),
      }));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const isLiveStream = selectedCamera === 'Entrance' && !streamError;

  return (
    <DashboardCard
      title="Live Camera Analytics"
      headerAction={
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>{selectedCamera}</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-[11px]">
              {['Entrance', 'Aisle 1', 'Aisle 2', 'Checkout'].map((cam) => (
                <button
                  key={cam}
                  type="button"
                  onClick={() => {
                    setSelectedCamera(cam);
                    setStreamError(false);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 hover:bg-slate-50 font-medium"
                >
                  {cam}
                </button>
              ))}
            </div>
          )}
        </div>
      }
      loading={loading}
    >
      <div className="relative h-44 sm:h-48 pt-1 rounded-lg overflow-hidden flex flex-col justify-end">
        {/* Background Stream or Live MJPEG Image */}
        {isLiveStream ? (
          <img
            src="http://localhost:8100/camera/stream"
            alt="Live Camera Analytics"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            onError={() => setStreamError(true)}
          />
        ) : (
          <img
            src={data.imageUrl}
            alt="Live Camera Analytics"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        )}

        {/* Live Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-bold border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isLiveStream ? 'AI Edge Live' : 'Live'}
          </span>
          {isLiveStream && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[8.5px] font-mono font-bold">
              30 FPS
            </span>
          )}
        </div>

        {/* Bottom AI Analytics Overlay Bar */}
        <div className="relative z-10 bg-black/80 backdrop-blur-xs rounded-b-lg px-3 py-2 flex items-center justify-between text-white text-center border-t border-white/10">
          <div className="flex-1">
            <span className="block text-[9.5px] text-slate-300 font-medium leading-tight">
              People in Frame
            </span>
            <span className="block text-sm font-bold text-white mt-0.5 leading-tight font-mono">
              {liveMetrics.people}
            </span>
          </div>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <div className="flex-1">
            <span className="block text-[9.5px] text-slate-300 font-medium leading-tight">
              Entering
            </span>
            <span className="block text-sm font-bold text-emerald-400 mt-0.5 leading-tight font-mono">
              {liveMetrics.entering}
            </span>
          </div>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <div className="flex-1">
            <span className="block text-[9.5px] text-slate-300 font-medium leading-tight">
              Exiting
            </span>
            <span className="block text-sm font-bold text-amber-400 mt-0.5 leading-tight font-mono">
              {liveMetrics.exiting}
            </span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default LiveCameraAnalytics;
