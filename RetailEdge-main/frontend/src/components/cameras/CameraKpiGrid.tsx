import React from 'react';
import { Video, Wifi, WifiOff, Bell, HardDrive } from 'lucide-react';
import type { CameraSummary } from '../../types/camera';
import CameraKpiCard from './CameraKpiCard';

interface CameraKpiGridProps {
  summary: CameraSummary | null;
  loading?: boolean;
}

export const CameraKpiGrid: React.FC<CameraKpiGridProps> = ({ summary }) => {
  const total = summary?.totalCameras ?? 12;
  const online = summary?.onlineCameras ?? 10;
  const offline = summary?.offlineCameras ?? 2;
  const alerts = summary?.activeAlerts ?? 8;
  const storage = summary?.storageUsage ?? 62;

  const totalTrend = summary?.trends?.totalCameras ?? 20;
  const onlineTrend = summary?.trends?.onlineCameras ?? 11;
  const offlineTrend = summary?.trends?.offlineCameras ?? -33;
  const alertsTrend = summary?.trends?.activeAlerts ?? -27;
  const storageTrend = summary?.trends?.storageUsage ?? 5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {/* 1. Total Cameras */}
      <CameraKpiCard
        title="Total Cameras"
        value={total}
        trend={`↑ ${totalTrend}%`}
        trendColor="text-emerald-500"
        icon={Video}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10b981"
        sparklinePoints={[8, 9, 10, 10, 11, 12, 12]}
      />

      {/* 2. Online Cameras */}
      <CameraKpiCard
        title="Online Cameras"
        value={online}
        trend={`↑ ${onlineTrend}%`}
        trendColor="text-emerald-500"
        icon={Wifi}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10b981"
        sparklinePoints={[7, 8, 8, 9, 9, 10, 10]}
      />

      {/* 3. Offline Cameras */}
      <CameraKpiCard
        title="Offline Cameras"
        value={offline}
        trend={`↓ ${Math.abs(offlineTrend)}%`}
        trendColor="text-red-500"
        icon={WifiOff}
        iconBg="bg-red-50"
        iconColor="text-red-500"
        sparklineColor="#ef4444"
        sparklinePoints={[4, 3, 3, 2, 3, 2, 2]}
      />

      {/* 4. Active Alerts */}
      <CameraKpiCard
        title="Active Alerts"
        value={alerts}
        trend={`↓ ${Math.abs(alertsTrend)}%`}
        trendColor="text-red-500"
        icon={Bell}
        iconBg="bg-red-50"
        iconColor="text-red-500"
        sparklineColor="#ef4444"
        sparklinePoints={[14, 12, 11, 10, 9, 8, 8]}
      />

      {/* 5. Storage Usage */}
      <CameraKpiCard
        title="Storage Usage"
        value={`${storage}%`}
        trend={`↑ ${storageTrend}%`}
        trendColor="text-emerald-500"
        icon={HardDrive}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10b981"
        sparklinePoints={[55, 57, 58, 60, 60, 61, 62]}
      />
    </div>
  );
};

export default CameraKpiGrid;
