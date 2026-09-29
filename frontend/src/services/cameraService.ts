import apiClient from './apiClient';
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
import {
  INITIAL_CAMERAS,
  INITIAL_CAMERA_SUMMARY,
  INITIAL_CAMERA_HEALTH,
  INITIAL_CAMERA_INSIGHTS,
  INITIAL_HEATMAP_DATA,
  INITIAL_CAMERA_ANALYTICS,
  INITIAL_CAMERA_LOCATIONS,
} from '../data/cameraMockData';

// Local in-memory state for fallback & prototype persistence
let mockCameras: Camera[] = [...INITIAL_CAMERAS];
let mockSummary: CameraSummary = { ...INITIAL_CAMERA_SUMMARY };
let mockHealth: CameraHealthItem[] = [...INITIAL_CAMERA_HEALTH];
let mockInsights: CameraInsight[] = [...INITIAL_CAMERA_INSIGHTS];

export const cameraService = {
  /**
   * Fetch all cameras with optional filtering
   */
  async getCameras(filters?: CameraFilters): Promise<Camera[]> {
    try {
      const res = await apiClient.get<Camera[]>('/cameras', {
        params: filters,
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback to local mock data
    }

    let result = [...mockCameras];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.zoneName.toLowerCase().includes(q)
      );
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters?.type && filters.type !== 'ALL') {
      result = result.filter((c) => c.type === filters.type);
    }

    return result;
  },

  /**
   * Get single camera by ID
   */
  async getCamera(id: string): Promise<Camera | null> {
    try {
      const res = await apiClient.get<Camera>(`/cameras/${id}`);
      if (res.data) return res.data;
    } catch {
      // fallback
    }
    const cam = mockCameras.find((c) => c.id === id);
    return cam || null;
  },

  /**
   * Get executive camera summary (KPIs)
   */
  async getCameraSummary(): Promise<CameraSummary> {
    try {
      const res = await apiClient.get<CameraSummary>('/cameras/summary');
      if (res.data) return res.data;
    } catch {
      // fallback
    }
    return { ...mockSummary };
  },

  /**
   * Get camera health status items
   */
  async getCameraHealth(statusFilter: string = 'All Cameras'): Promise<CameraHealthItem[]> {
    try {
      const res = await apiClient.get<CameraHealthItem[]>('/cameras/health');
      if (Array.isArray(res.data) && res.data.length > 0) {
        if (statusFilter === 'Online') return res.data.filter((h) => h.status === 'ONLINE');
        if (statusFilter === 'Offline') return res.data.filter((h) => h.status === 'OFFLINE');
        if (statusFilter === 'Maintenance') return res.data.filter((h) => h.status === 'MAINTENANCE');
        if (statusFilter === 'Error') return res.data.filter((h) => h.status === 'ERROR');
        return res.data;
      }
    } catch {
      // fallback
    }

    if (statusFilter === 'Online') {
      return mockHealth.filter((h) => h.status === 'ONLINE');
    }
    if (statusFilter === 'Offline') {
      return mockHealth.filter((h) => h.status === 'OFFLINE');
    }
    if (statusFilter === 'Maintenance') {
      return mockHealth.filter((h) => h.status === 'MAINTENANCE');
    }
    if (statusFilter === 'Error') {
      return mockHealth.filter((h) => h.status === 'ERROR');
    }
    return [...mockHealth];
  },

  /**
   * Get AI insights derived from cameras
   */
  async getCameraInsights(): Promise<CameraInsight[]> {
    try {
      const res = await apiClient.get<CameraInsight[]>('/cameras/insights');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
    } catch {
      // fallback
    }
    return [...mockInsights];
  },

  /**
   * Get footfall heatmap data
   */
  async getCameraHeatmap(_period: string = 'Today'): Promise<CameraHeatmap> {
    try {
      const res = await apiClient.get<CameraHeatmap>('/cameras/heatmap');
      if (res.data) return res.data;
    } catch {
      // fallback
    }
    return { ...INITIAL_HEATMAP_DATA };
  },

  /**
   * Get analytics for a specific camera
   */
  async getCameraAnalytics(cameraId: string): Promise<CameraAnalytics> {
    try {
      const res = await apiClient.get<CameraAnalytics>(`/cameras/analytics/${cameraId}`);
      if (res.data) return res.data;
    } catch {
      // fallback
    }
    return (
      INITIAL_CAMERA_ANALYTICS[cameraId] || {
        cameraId,
        peopleInFrame: 0,
        entering: 0,
        exiting: 0,
        trafficLevel: 'Low',
        avgDwellMinutes: 0,
        queueCount: 0,
        uptimePct: 99.5,
      }
    );
  },

  /**
   * Get floor plan camera marker locations
   */
  async getCameraLocations(): Promise<CameraLocationMarker[]> {
    try {
      const res = await apiClient.get<CameraLocationMarker[]>('/cameras/locations');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
    } catch {
      // fallback
    }
    return [...INITIAL_CAMERA_LOCATIONS];
  },

  /**
   * Create a new camera
   */
  async createCamera(input: CreateCameraInput): Promise<Camera> {
    try {
      const res = await apiClient.post<Camera>('/cameras', input);
      if (res.data) {
        mockCameras = [res.data, ...mockCameras];
        return res.data;
      }
    } catch {
      // fallback
    }

    const newCamera: Camera = {
      id: `CAM00${mockCameras.length + 1}`,
      organizationId: 'org-default',
      storeId: input.storeId,
      zoneId: input.zoneId,
      zoneName: input.zoneName,
      name: input.name,
      code: input.code,
      type: input.type,
      status: input.status,
      resolution: input.resolution || 'HD 1080p',
      fps: input.fps || 30,
      streamIdentifier: input.streamIdentifier || `rtsp://edge-01.local/live/${input.code.toLowerCase()}`,
      uptime: 100,
      storageUsage: 45,
      lastSeenAt: 'Just now',
      aiProcessingStatus: 'ACTIVE',
      image: '/images/cameras/cam_entrance.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCameras = [newCamera, ...mockCameras];
    mockSummary = {
      ...mockSummary,
      totalCameras: mockSummary.totalCameras + 1,
      onlineCameras:
        newCamera.status === 'ONLINE' ? mockSummary.onlineCameras + 1 : mockSummary.onlineCameras,
      offlineCameras:
        newCamera.status === 'OFFLINE' ? mockSummary.offlineCameras + 1 : mockSummary.offlineCameras,
    };

    mockHealth = [
      {
        cameraId: newCamera.id,
        cameraName: newCamera.name,
        status: newCamera.status,
        uptime: '100%',
        storageUsage: '45%',
        fps: newCamera.fps,
        resolution: newCamera.resolution,
        lastCheckedAt: 'Just now',
      },
      ...mockHealth,
    ];

    return newCamera;
  },

  /**
   * Update existing camera
   */
  async updateCamera(id: string, updates: Partial<Camera>): Promise<Camera | null> {
    try {
      const res = await apiClient.patch<Camera>(`/cameras/${id}`, updates);
      if (res.data) {
        const index = mockCameras.findIndex((c) => c.id === id);
        if (index !== -1) mockCameras[index] = res.data;
        return res.data;
      }
    } catch {
      // fallback
    }

    const index = mockCameras.findIndex((c) => c.id === id);
    if (index === -1) return null;

    mockCameras[index] = {
      ...mockCameras[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return mockCameras[index];
  },

  /**
   * Delete camera
   */
  async deleteCamera(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/cameras/${id}`);
    } catch {
      // fallback
    }
    const prevLen = mockCameras.length;
    mockCameras = mockCameras.filter((c) => c.id !== id);
    mockHealth = mockHealth.filter((h) => h.cameraId !== id);
    return mockCameras.length < prevLen;
  },

  /**
   * Simulated camera restart
   */
  async restartCamera(id: string): Promise<Camera | null> {
    try {
      const res = await apiClient.post<Camera>(`/cameras/${id}/restart`);
      if (res.data) {
        const index = mockCameras.findIndex((c) => c.id === id);
        if (index !== -1) mockCameras[index] = res.data;
        return res.data;
      }
    } catch {
      // fallback
    }

    const index = mockCameras.findIndex((c) => c.id === id);
    if (index === -1) return null;

    mockCameras[index] = {
      ...mockCameras[index],
      status: 'ONLINE',
      uptime: 99.8,
      storageUsage: 54,
      lastSeenAt: 'Just now',
      aiProcessingStatus: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    };

    const healthIndex = mockHealth.findIndex((h) => h.cameraId === id);
    if (healthIndex !== -1) {
      mockHealth[healthIndex] = {
        ...mockHealth[healthIndex],
        status: 'ONLINE',
        uptime: '99.8%',
        storageUsage: '54%',
        lastCheckedAt: 'Just now',
      };
    }

    mockSummary = {
      ...mockSummary,
      onlineCameras: Math.min(mockSummary.onlineCameras + 1, mockSummary.totalCameras),
      offlineCameras: Math.max(mockSummary.offlineCameras - 1, 0),
    };

    return mockCameras[index];
  },

  /**
   * Start live camera (laptop webcam source='0' or Android phone URL)
   */
  async startLiveCamera(source: string = '0', cameraId: string = 'cam_0'): Promise<{ ok: boolean; status: string; detail?: string }> {
    try {
      const res = await apiClient.post<{ ok: boolean; status: string; detail?: string }>('/cameras/start', { source, cameraId });
      return res.data;
    } catch (err: any) {
      return { ok: false, status: 'ERROR', detail: err?.response?.data?.detail || err.message };
    }
  },

  /**
   * Stop live camera
   */
  async stopLiveCamera(cameraId?: string): Promise<{ ok: boolean; status: string }> {
    try {
      const res = await apiClient.post<{ ok: boolean; status: string }>('/cameras/stop', { cameraId });
      return res.data;
    } catch {
      return { ok: true, status: 'STOPPED' };
    }
  },

  /**
   * Get live AI pipeline camera status
   */
  async getLiveCameraStatus(): Promise<{ status: string; fps: number; frame_count: number; source?: string; error?: string }> {
    try {
      const res = await apiClient.get<{ status: string; fps: number; frame_count: number; source?: string; error?: string }>('/cameras/status/live');
      return res.data;
    } catch {
      return { status: 'OFFLINE', fps: 0, frame_count: 0 };
    }
  },
};

export default cameraService;
