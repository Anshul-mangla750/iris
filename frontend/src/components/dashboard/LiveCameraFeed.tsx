import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import CameraFeedCard from './CameraFeedCard';
import type { CameraFeedItem } from '../../types/dashboard';

export interface LiveCameraFeedProps {
  cameras: CameraFeedItem[];
  onViewAll?: () => void;
  onExpandCamera?: (camera: CameraFeedItem) => void;
}

export const LiveCameraFeed: React.FC<LiveCameraFeedProps> = ({
  cameras,
  onViewAll,
  onExpandCamera,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'entrance' | 'aisles' | 'checkout'>('all');

  const filteredCameras = cameras.filter((cam) => {
    if (activeTab === 'all') return true;
    return cam.category === activeTab;
  });

  const headerTitle = (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800">Live Camera Feed</h3>

      {/* Camera Group Filter Tabs */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-[#e8f8f0] text-[#0fa968] border border-emerald-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          All Cameras (6)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('entrance')}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
            activeTab === 'entrance'
              ? 'bg-[#e8f8f0] text-[#0fa968] border border-emerald-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          Entrance (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('aisles')}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
            activeTab === 'aisles'
              ? 'bg-[#e8f8f0] text-[#0fa968] border border-emerald-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          Aisles (3)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('checkout')}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
            activeTab === 'checkout'
              ? 'bg-[#e8f8f0] text-[#0fa968] border border-emerald-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          Checkout (2)
        </button>
      </div>
    </div>
  );

  const headerAction = (
    <button
      type="button"
      onClick={onViewAll}
      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
    >
      View All
    </button>
  );

  return (
    <DashboardCard title={headerTitle} headerAction={headerAction} className="h-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
        {filteredCameras.map((camera) => (
          <CameraFeedCard
            key={camera.id}
            camera={camera}
            onExpand={onExpandCamera}
          />
        ))}
      </div>
    </DashboardCard>
  );
};

export default LiveCameraFeed;
