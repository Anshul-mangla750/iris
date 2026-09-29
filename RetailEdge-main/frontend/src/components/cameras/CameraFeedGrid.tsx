import React from 'react';
import type { Camera } from '../../types/camera';
import CameraFeedCard from './CameraFeedCard';

interface CameraFeedGridProps {
  cameras: Camera[];
  onFullscreen: (camera: Camera) => void;
  onSnapshot: (camera: Camera) => void;
  onAnalytics: (camera: Camera) => void;
  onViewDetails: (camera: Camera) => void;
  onEditCamera: (camera: Camera) => void;
  onRestartCamera: (camera: Camera) => void;
  onViewAlerts: (camera: Camera) => void;
}

export const CameraFeedGrid: React.FC<CameraFeedGridProps> = ({
  cameras,
  onFullscreen,
  onSnapshot,
  onAnalytics,
  onViewDetails,
  onEditCamera,
  onRestartCamera,
  onViewAlerts,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {cameras.map((camera) => (
        <CameraFeedCard
          key={camera.id}
          camera={camera}
          onFullscreen={onFullscreen}
          onSnapshot={onSnapshot}
          onAnalytics={onAnalytics}
          onViewDetails={onViewDetails}
          onEditCamera={onEditCamera}
          onRestartCamera={onRestartCamera}
          onViewAlerts={onViewAlerts}
        />
      ))}
    </div>
  );
};

export default CameraFeedGrid;
