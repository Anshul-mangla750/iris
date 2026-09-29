import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import GreetingHeader from '../../components/dashboard/GreetingHeader';
import KpiGrid from '../../components/dashboard/KpiGrid';
import FootfallTrend from '../../components/dashboard/FootfallTrend';
import CustomerDistribution from '../../components/dashboard/CustomerDistribution';
import StoreHeatmap from '../../components/dashboard/StoreHeatmap';
import LiveCameraFeed from '../../components/dashboard/LiveCameraFeed';
import QueueStatus from '../../components/dashboard/QueueStatus';
import InventoryStatus from '../../components/dashboard/InventoryStatus';
import PlanogramCompliance from '../../components/dashboard/PlanogramCompliance';
import RecentAlerts from '../../components/dashboard/RecentAlerts';
import AIInsights from '../../components/dashboard/AIInsights';
import TopCategories from '../../components/dashboard/TopCategories';
import DwellTimeByZone from '../../components/dashboard/DwellTimeByZone';
import FootfallByHour from '../../components/dashboard/FootfallByHour';
import LowStockProducts from '../../components/dashboard/LowStockProducts';
import SalesFootfallCorrelation from '../../components/dashboard/SalesFootfallCorrelation';
import DeviceStatus from '../../components/dashboard/DeviceStatus';

import useDashboardData from '../../hooks/useDashboardData';
import useRealtimeDashboard from '../../hooks/useRealtimeDashboard';
import { STORE_OPTIONS, DEFAULT_DASHBOARD_OVERVIEW } from '../../data/dashboardMockData';
import type { StoreOption, CameraFeedItem } from '../../types/dashboard';
import { useToast } from '../../context/ToastContext';
import { X, Camera, ExternalLink } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: rawData, setData, activeStoreId, selectStore, isLoading, refreshData } = useDashboardData('store-001');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFeedCam, setSelectedFeedCam] = useState<CameraFeedItem | null>(null);

  // Merge with default overview to guarantee every section has valid structured data
  const data = {
    ...DEFAULT_DASHBOARD_OVERVIEW,
    ...(rawData && typeof rawData === 'object' && rawData.greeting ? rawData : {}),
  };

  // Realtime hook to receive edge socket events (if Socket.IO backend connected)
  useRealtimeDashboard({
    storeId: activeStoreId,
    onUpdate: (partial: any) => {
      setData((prev) => {
        const nextKpis = prev.kpis.map((kpi) => {
          if (kpi.id === 'footfall' && partial.totalFootfall) {
            return { ...kpi, value: Number(partial.totalFootfall).toLocaleString() };
          }
          if (kpi.id === 'dwell-time' && partial.avgDwellMinutes) {
            return { ...kpi, value: `${partial.avgDwellMinutes} min` };
          }
          return kpi;
        });
        return {
          ...prev,
          ...partial,
          kpis: nextKpis,
          queueCounters: partial.queueCounters || prev.queueCounters,
          dwellTimeByZone: partial.liveDwellZones || prev.dwellTimeByZone,
        };
      });
    },
  });

  const currentStore: StoreOption =
    STORE_OPTIONS.find((s) => s.id === activeStoreId) || STORE_OPTIONS[0];

  const handleSelectStore = (store: StoreOption) => {
    selectStore(store.id);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refreshData) await refreshData();
      showToast('Live store analytics updated', 'success');
    } catch {
      showToast('Analytics refreshed', 'info');
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  return (
    <DashboardLayout
      currentStore={currentStore}
      onSelectStore={handleSelectStore}
    >
      {/* 1. Greeting Section with Dynamic Quick Actions */}
      <GreetingHeader
        userName={data.greeting?.userName || 'Admin'}
        message={data.greeting?.message || "Here's what's happening in your store today."}
        dateFormatted={data.greeting?.dateFormatted || 'Tue, 29 Sep 2026'}
        timeFormatted={data.greeting?.timeFormatted || '03:24 PM'}
        temperature={data.greeting?.temperature || '28°C'}
        location={data.greeting?.location || 'Delhi, India'}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing || isLoading}
      />

      {/* 2. Top KPI Cards Row */}
      <KpiGrid kpis={data.kpis || DEFAULT_DASHBOARD_OVERVIEW.kpis} />

      {/* 3. Row 2: Footfall Trend + Customer Distribution + Store Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3.5">
        <div className="lg:col-span-5">
          <FootfallTrend data={data.footfallTrend || DEFAULT_DASHBOARD_OVERVIEW.footfallTrend} />
        </div>
        <div className="lg:col-span-3">
          <CustomerDistribution
            items={data.customerDistribution?.items || DEFAULT_DASHBOARD_OVERVIEW.customerDistribution.items}
            totalVisitors={data.customerDistribution?.totalVisitors || 1482}
          />
        </div>
        <div className="lg:col-span-4">
          <StoreHeatmap
            zones={data.storeHeatmap?.zones || DEFAULT_DASHBOARD_OVERVIEW.storeHeatmap.zones}
            isLive={data.storeHeatmap?.isLive ?? true}
            floorPlanUrl={data.storeHeatmap?.floorPlanUrl || '/images/dashboard/heatmap_floorplan.jpg'}
          />
        </div>
      </div>

      {/* 4. Row 3: Live Camera Feed + Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3.5">
        <div className="lg:col-span-7">
          <LiveCameraFeed
            cameras={data.cameras || DEFAULT_DASHBOARD_OVERVIEW.cameras}
            onViewAll={() => navigate('/cameras')}
            onExpandCamera={(camera) => setSelectedFeedCam(camera)}
          />
        </div>
        <div className="lg:col-span-5">
          <QueueStatus counters={data.queueCounters || DEFAULT_DASHBOARD_OVERVIEW.queueCounters} />
        </div>
      </div>

      {/* 5. Row 4: Inventory Status + Planogram Compliance + Recent Alerts + AI Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
        <InventoryStatus data={data.inventoryStatus || DEFAULT_DASHBOARD_OVERVIEW.inventoryStatus} />
        <PlanogramCompliance data={data.planogramCompliance || DEFAULT_DASHBOARD_OVERVIEW.planogramCompliance} />
        <RecentAlerts
          alerts={data.recentAlerts || DEFAULT_DASHBOARD_OVERVIEW.recentAlerts}
          onViewAll={() => navigate('/alerts')}
        />
        <AIInsights insights={data.aiInsights || DEFAULT_DASHBOARD_OVERVIEW.aiInsights} />
      </div>

      {/* 6. Row 5: Top Categories + Dwell Time by Zone + Footfall by Hour */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3.5">
        <div className="md:col-span-4">
          <TopCategories categories={data.topCategories || DEFAULT_DASHBOARD_OVERVIEW.topCategories} />
        </div>
        <div className="md:col-span-4">
          <DwellTimeByZone data={data.dwellTimeByZone || DEFAULT_DASHBOARD_OVERVIEW.dwellTimeByZone} />
        </div>
        <div className="md:col-span-4">
          <FootfallByHour data={data.footfallByHour || DEFAULT_DASHBOARD_OVERVIEW.footfallByHour} />
        </div>
      </div>

      {/* 7. Row 6: Low Stock Products Table + Sales vs Footfall Correlation + Device Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5">
          <LowStockProducts products={data.lowStockProducts || DEFAULT_DASHBOARD_OVERVIEW.lowStockProducts} />
        </div>
        <div className="lg:col-span-4">
          <SalesFootfallCorrelation data={data.salesVsFootfall || DEFAULT_DASHBOARD_OVERVIEW.salesVsFootfall} />
        </div>
        <div className="lg:col-span-3">
          <DeviceStatus devices={data.deviceStatuses || DEFAULT_DASHBOARD_OVERVIEW.deviceStatuses} />
        </div>
      </div>

      {/* Live Camera Preview Modal */}
      {selectedFeedCam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">{selectedFeedCam.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE 1080p
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedCam(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative bg-black aspect-video flex items-center justify-center">
              <img
                src={selectedFeedCam.imageUrl || '/images/dashboard/cam_entrance.jpg'}
                alt={selectedFeedCam.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/dashboard/cam_aisle1.jpg';
                }}
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>REC {selectedFeedCam.timestamp || 'LIVE'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Category: <span className="font-semibold text-slate-800 uppercase">{selectedFeedCam.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Snapshot saved for ${selectedFeedCam.name}`, 'success');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Capture Snapshot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFeedCam(null);
                    navigate('/cameras');
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Open in Cameras Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
