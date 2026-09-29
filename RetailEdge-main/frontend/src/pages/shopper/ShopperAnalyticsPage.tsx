import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ShopperHeader from '../../components/shopper/ShopperHeader';
import ShopperKpiGrid from '../../components/shopper/ShopperKpiGrid';
import ShopperFootfallTrend from '../../components/shopper/ShopperFootfallTrend';
import ShopperStoreHeatmap from '../../components/shopper/ShopperStoreHeatmap';
import LiveCameraAnalytics from '../../components/shopper/LiveCameraAnalytics';
import CustomerDemographics from '../../components/shopper/CustomerDemographics';
import DwellTimeDistribution from '../../components/shopper/DwellTimeDistribution';
import TrafficByZone from '../../components/shopper/TrafficByZone';
import PathAnalysis from '../../components/shopper/PathAnalysis';
import TopVisitedAreas from '../../components/shopper/TopVisitedAreas';
import RepeatVsNewCustomers from '../../components/shopper/RepeatVsNewCustomers';
import PeakHoursInsights from '../../components/shopper/PeakHoursInsights';
import LiveViewModal from '../../components/shopper/LiveViewModal';

import useShopperAnalytics from '../../hooks/useShopperAnalytics';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import { DEFAULT_SHOPPER_OVERVIEW } from '../../data/shopperMockData';
import type { StoreOption } from '../../types/dashboard';

import { useToast } from '../../context/ToastContext';

export const ShopperAnalyticsPage: React.FC = () => {
  const { showToast } = useToast();
  const {
    data: rawData,
    activeStoreId,
    selectStore,
    timeRange,
    selectTimeRange,
    isLoading,
  } = useShopperAnalytics('store-001');

  const [isLiveViewOpen, setIsLiveViewOpen] = useState(false);

  // Defensive fallback merge
  const data = {
    ...DEFAULT_SHOPPER_OVERVIEW,
    ...(rawData && typeof rawData === 'object' && Array.isArray(rawData.kpis) ? rawData : {}),
  };

  const currentStore: StoreOption =
    STORE_OPTIONS.find((s) => s.id === activeStoreId) || STORE_OPTIONS[0];

  const handleSelectStore = (store: StoreOption) => {
    selectStore(store.id);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Time,Visitors,Zone,AvgDwellMinutes\n' +
      '6AM,85,Entrance,6.2\n' +
      '9AM,185,Aisles,12.4\n' +
      '12PM,285,Beverages,9.6\n' +
      '3PM,220,Snacks,8.1\n' +
      '6PM,245,Personal Care,7.8\n' +
      '9PM,320,Checkout,4.3\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopper_analytics_${activeStoreId}_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Shopper footfall analytics exported to CSV', 'success');
  };

  return (
    <DashboardLayout
      currentStore={currentStore}
      onSelectStore={handleSelectStore}
    >
      {/* 1. Page Header with Title, Date Dropdown, Time Range Pills, Export and Live View CTA */}
      <ShopperHeader
        dateFormatted={data.dateFormatted}
        timeRange={timeRange}
        onSelectTimeRange={selectTimeRange}
        onOpenLiveView={() => setIsLiveViewOpen(true)}
        onExport={handleExport}
      />

      {/* 2. 5 KPI Cards in 1 row on Desktop */}
      <ShopperKpiGrid kpis={data.kpis} />

      {/* 3. Row 1: Footfall Trend + Store Heatmap + Live Camera Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr_1fr] gap-3 mb-3.5">
        <ShopperFootfallTrend data={data.footfallTrend} loading={isLoading} />
        <ShopperStoreHeatmap
          floorPlanUrl={data.heatmapFloorPlanUrl}
          zones={data.heatmapZones}
          loading={isLoading}
        />
        <LiveCameraAnalytics data={data.cameraAnalytics} loading={isLoading} />
      </div>

      {/* 4. Row 2: Customer Demographics + Dwell Time Distribution + Traffic by Zone + Path Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
        <CustomerDemographics
          totalShoppers={data.demographics.totalShoppers}
          segments={data.demographics.segments}
          loading={isLoading}
        />
        <DwellTimeDistribution data={data.dwellTimeDistribution} loading={isLoading} />
        <TrafficByZone zones={data.trafficByZone} loading={isLoading} />
        <PathAnalysis mapUrl={data.pathMapUrl} loading={isLoading} />
      </div>

      {/* 5. Row 3: Top Visited Areas + Repeat vs New Customers + Peak Hours & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr_1.4fr] gap-3 items-stretch">
        <div className="flex flex-col h-full">
          <TopVisitedAreas areas={data.topVisitedAreas} loading={isLoading} />
        </div>
        <div className="flex flex-col h-full">
          <RepeatVsNewCustomers
            totalUnique={data.customerTypes.totalUnique}
            segments={data.customerTypes.segments}
            loading={isLoading}
          />
        </div>
        <div className="flex flex-col h-full">
          <PeakHoursInsights insights={data.peakHours} loading={isLoading} />
        </div>
      </div>

      {/* Interactive Live View Stream Modal */}
      <LiveViewModal
        isOpen={isLiveViewOpen}
        onClose={() => setIsLiveViewOpen(false)}
        storeName={`${currentStore.code} — ${currentStore.name}`}
      />
    </DashboardLayout>
  );
};

export default ShopperAnalyticsPage;
