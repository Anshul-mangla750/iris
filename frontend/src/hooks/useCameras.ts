import { useState, useEffect, useCallback } from 'react';
import type {
  Camera,
  CameraSummary,
  CameraHealthItem,
  CameraInsight,
  CameraHeatmap,
  CameraAnalytics,
  CameraLocationMarker,
  CameraFilters,
  CreateCameraInput,
} from '../types/camera';
import { cameraService } from '../services/cameraService';

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [summary, setSummary] = useState<CameraSummary | null>(null);
  const [health, setHealth] = useState<CameraHealthItem[]>([]);
  const [insights, setInsights] = useState<CameraInsight[]>([]);
  const [heatmap, setHeatmap] = useState<CameraHeatmap | null>(null);
  const [cameraLocations, setCameraLocations] = useState<CameraLocationMarker[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [activeCameraAnalytics, setActiveCameraAnalytics] = useState<CameraAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CameraFilters>({
    storeId: 'store-001',
    status: 'ALL',
    type: 'ALL',
    search: '',
    dateRange: 'live',
  });

  const [healthFilter, setHealthFilter] = useState<string>('All Cameras');
  const [dateRange, setDateRange] = useState<'live' | 'today' | '7days' | '30days'>('live');

  // Load all camera data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [cams, sum, hlth, ins, hmap, locs] = await Promise.all([
        cameraService.getCameras({ ...filters, dateRange }),
        cameraService.getCameraSummary(),
        cameraService.getCameraHealth(healthFilter),
        cameraService.getCameraInsights(),
        cameraService.getCameraHeatmap(dateRange),
        cameraService.getCameraLocations(),
      ]);

      setCameras(cams);
      setSummary(sum);
      setHealth(hlth);
      setInsights(ins);
      setHeatmap(hmap);
      setCameraLocations(locs);

      // Default selected camera to first camera
      if (!selectedCamera && cams.length > 0) {
        setSelectedCamera(cams[0]);
        const analytics = await cameraService.getCameraAnalytics(cams[0].id);
        setActiveCameraAnalytics(analytics);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load camera data');
    } finally {
      setLoading(false);
    }
  }, [filters, healthFilter, dateRange]);

  useEffect(() => {
    loadData();
    const interval = setInterval(async () => {
      try {
        const [cams, sum] = await Promise.all([
          cameraService.getCameras({ ...filters, dateRange }),
          cameraService.getCameraSummary(),
        ]);
        if (cams && cams.length > 0) setCameras(cams);
        if (sum) setSummary(sum);
      } catch {
        // quiet background refresh
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [loadData, filters, dateRange]);

  // Select camera and fetch its analytics
  const handleSelectCamera = useCallback(async (cam: Camera) => {
    setSelectedCamera(cam);
    const analytics = await cameraService.getCameraAnalytics(cam.id);
    setActiveCameraAnalytics(analytics);
  }, []);

  const handleSelectCameraById = useCallback(async (cameraId: string) => {
    const cam = cameras.find((c) => c.id === cameraId) || null;
    if (cam) {
      setSelectedCamera(cam);
      const analytics = await cameraService.getCameraAnalytics(cam.id);
      setActiveCameraAnalytics(analytics);
    }
  }, [cameras]);

  // Filter setters
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setStatus = useCallback((status: CameraFilters['status']) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setType = useCallback((type: CameraFilters['type']) => {
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  // Creation
  const handleCreateCamera = useCallback(async (input: CreateCameraInput) => {
    const created = await cameraService.createCamera(input);
    await loadData();
    return created;
  }, [loadData]);

  // Restart camera (mock simulation)
  const handleRestartCamera = useCallback(async (cameraId: string) => {
    const updated = await cameraService.restartCamera(cameraId);
    await loadData();
    return updated;
  }, [loadData]);

  return {
    cameras,
    summary,
    health,
    insights,
    heatmap,
    cameraLocations,
    selectedCamera,
    activeCameraAnalytics,
    loading,
    error,
    filters,
    healthFilter,
    dateRange,
    setDateRange,
    setSearch,
    setStatus,
    setType,
    setHealthFilter,
    handleSelectCamera,
    handleSelectCameraById,
    handleCreateCamera,
    handleRestartCamera,
    refetch: loadData,
  };
}
