import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import type { Camera } from '../../types/camera';
import { useCameras } from '../../hooks/useCameras';
import CameraPageHeader from '../../components/cameras/CameraPageHeader';
import CameraKpiGrid from '../../components/cameras/CameraKpiGrid';
import CameraFeedGrid from '../../components/cameras/CameraFeedGrid';
import StoreCameraMap from '../../components/cameras/StoreCameraMap';
import FootfallHeatmap from '../../components/cameras/FootfallHeatmap';
import CameraInsights from '../../components/cameras/CameraInsights';
import CameraHealthTable from '../../components/cameras/CameraHealthTable';
import CameraFullscreenModal from '../../components/cameras/CameraFullscreenModal';
import CameraAnalyticsModal from '../../components/cameras/CameraAnalyticsModal';
import CameraDetailsDrawer from '../../components/cameras/CameraDetailsDrawer';
import CameraHealthDrawer from '../../components/cameras/CameraHealthDrawer';
import AddCameraModal from '../../components/cameras/AddCameraModal';
import RestartCameraModal from '../../components/cameras/RestartCameraModal';
import SnapshotToast from '../../components/cameras/SnapshotToast';
import LiveEdgeStreamPanel from '../../components/cameras/LiveEdgeStreamPanel';

export const CameraManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStore, setCurrentStore] = useState<StoreOption>(STORE_OPTIONS[0]);

  // Modal / Drawer state
  const [fullscreenCam, setFullscreenCam] = useState<Camera | null>(null);
  const [analyticsCam, setAnalyticsCam] = useState<Camera | null>(null);
  const [detailsCam, setDetailsCam] = useState<Camera | null>(null);
  const [restartCam, setRestartCam] = useState<Camera | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [healthDrawerOpen, setHealthDrawerOpen] = useState(false);
  const [snapshotMessage, setSnapshotMessage] = useState<string | null>(null);

  const {
    cameras,
    summary,
    health,
    insights,
    heatmap,
    cameraLocations,
    selectedCamera,
    activeCameraAnalytics,
    loading,
    filters,
    setSearch,
    setStatus,
    healthFilter,
    dateRange,
    setDateRange,
    setHealthFilter,
    handleSelectCamera,
    handleSelectCameraById,
    handleCreateCamera,
    handleRestartCamera,
  } = useCameras();

  const handleSnapshot = (cam: Camera) => {
    setSnapshotMessage(`Snapshot captured for ${cam.name}`);
    setTimeout(() => {
      setSnapshotMessage(null);
    }, 2800);
  };

  const handleViewAlerts = (cam: Camera) => {
    navigate(`/alerts?cameraId=${cam.code}`);
  };

  return (
    <DashboardLayout currentStore={currentStore} onSelectStore={setCurrentStore}>
      <div className="space-y-3.5 sm:space-y-4">
        {/* 1. Page Header */}
        <CameraPageHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onAddCamera={() => setAddModalOpen(true)}
          search={filters.search}
          onSearchChange={setSearch}
          statusFilter={filters.status}
          onStatusFilterChange={setStatus}
        />

        {/* Live Edge AI Video Pipeline (Laptop Camera / Android Phone input) */}
        <LiveEdgeStreamPanel />

        {/* 2. 5 KPI Cards Row */}
        <CameraKpiGrid summary={summary} loading={loading} />

        {/* 3. Main Content Row: 6 Camera Feeds (Left/Center) + Store Layout (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-stretch">
          {/* Left / Center: 6 Camera Feed Cards (3 cols x 2 rows) */}
          <div className="xl:col-span-8">
            <CameraFeedGrid
              cameras={cameras}
              onFullscreen={(cam) => setFullscreenCam(cam)}
              onSnapshot={handleSnapshot}
              onAnalytics={(cam) => {
                setAnalyticsCam(cam);
                handleSelectCamera(cam);
              }}
              onViewDetails={(cam) => setDetailsCam(cam)}
              onEditCamera={(cam) => setDetailsCam(cam)}
              onRestartCamera={(cam) => setRestartCam(cam)}
              onViewAlerts={handleViewAlerts}
            />
          </div>

          {/* Right: Store Layout Floor Plan & Camera Locations */}
          <div className="xl:col-span-4 flex flex-col">
            <StoreCameraMap
              locations={cameraLocations}
              selectedCamera={selectedCamera}
              onSelectCamera={handleSelectCameraById}
              onViewCamera={(cam) => setFullscreenCam(cam)}
              cameras={cameras}
            />
          </div>
        </div>

        {/* 4. Bottom 3 Analytics Cards Row: Heatmap | AI Insights | Health Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-stretch">
          {/* Card 1: Footfall Heatmap */}
          <div className="h-full">
            <FootfallHeatmap heatmap={heatmap} />
          </div>

          {/* Card 2: AI Insights from Cameras */}
          <div className="h-full">
            <CameraInsights
              insights={insights}
              onViewAll={() => navigate('/alerts')}
            />
          </div>

          {/* Card 3: Camera Health Status Table */}
          <div className="h-full">
            <CameraHealthTable
              healthItems={health}
              selectedFilter={healthFilter}
              onFilterChange={setHealthFilter}
              onViewAll={() => setHealthDrawerOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Video Feed Modal */}
      <CameraFullscreenModal
        camera={fullscreenCam}
        isOpen={!!fullscreenCam}
        onClose={() => setFullscreenCam(null)}
        onSnapshot={handleSnapshot}
        onAnalytics={(cam) => {
          setFullscreenCam(null);
          setAnalyticsCam(cam);
          handleSelectCamera(cam);
        }}
      />

      {/* Camera Analytics Modal */}
      <CameraAnalyticsModal
        camera={analyticsCam}
        analytics={activeCameraAnalytics}
        isOpen={!!analyticsCam}
        onClose={() => setAnalyticsCam(null)}
      />

      {/* Camera Details Drawer */}
      <CameraDetailsDrawer
        camera={detailsCam}
        isOpen={!!detailsCam}
        onClose={() => setDetailsCam(null)}
        onFullscreen={(cam) => {
          setDetailsCam(null);
          setFullscreenCam(cam);
        }}
        onEditCamera={() => {}}
        onRestartCamera={(cam) => {
          setDetailsCam(null);
          setRestartCam(cam);
        }}
        onViewAlerts={handleViewAlerts}
      />

      {/* All Cameras Health Drawer */}
      <CameraHealthDrawer
        healthItems={health}
        isOpen={healthDrawerOpen}
        onClose={() => setHealthDrawerOpen(false)}
      />

      {/* Add Camera Modal */}
      <AddCameraModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateCamera}
      />

      {/* Restart Camera Simulation Modal */}
      <RestartCameraModal
        camera={restartCam}
        isOpen={!!restartCam}
        onClose={() => setRestartCam(null)}
        onConfirmRestart={handleRestartCamera}
      />

      {/* Toast Notification */}
      <SnapshotToast message={snapshotMessage} />
    </DashboardLayout>
  );
};

export default CameraManagementPage;
