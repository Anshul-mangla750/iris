import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import type { StoreOption } from '../../types/dashboard';
import type { Store } from '../../types/store';
import { useStores } from '../../hooks/useStores';
import StoreManagementHeader from '../../components/stores/StoreManagementHeader';
import StoreKpiGrid from '../../components/stores/StoreKpiGrid';
import StoreLocationsMap from '../../components/stores/StoreLocationsMap';
import StorePerformance from '../../components/stores/StorePerformance';
import StoreStatusChart from '../../components/stores/StoreStatusChart';
import DeviceHealth from '../../components/stores/DeviceHealth';
import StoreTable from '../../components/stores/StoreTable';
import AddStoreModal from '../../components/stores/AddStoreModal';
import StoreDetailsDrawer from '../../components/stores/StoreDetailsDrawer';
import DeviceHealthModal from '../../components/stores/DeviceHealthModal';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import { useToast } from '../../context/ToastContext';

const ALL_STORES_OPTION: StoreOption = {
  id: 'all',
  name: 'All Organization Locations',
  code: 'All Stores',
  city: 'Delhi-NCR',
};

export const StoreManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [currentStore, setCurrentStore] = useState<StoreOption>(STORE_OPTIONS[0] || ALL_STORES_OPTION);
  const [addStoreModalOpen, setAddStoreModalOpen] = useState(false);
  const [deviceHealthModalOpen, setDeviceHealthModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [drawerStore, setDrawerStore] = useState<Store | null>(null);

  const {
    stores,
    allStores,
    total,
    totalPages,
    page,
    limit,
    summary,
    performanceData,
    performanceMetric,
    deviceHealth,
    statusDistribution,
    selectedStore,
    filters,
    dateRange,
    setDateRange,
    setPage,
    setSearch,
    setRegion,
    setStatus,
    setPerformanceMetric,
    setSelectedStore,
    handleCreateStore,
    handleExport,
  } = useStores();

  const handleOpenStoreDetails = (store: Store) => {
    setDrawerStore(store);
    setDetailsDrawerOpen(true);
  };

  return (
    <DashboardLayout
      currentStore={currentStore}
      onSelectStore={setCurrentStore}
    >
      <div className="space-y-3.5">
        {/* Page Header */}
        <StoreManagementHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onAddStoreClick={() => setAddStoreModalOpen(true)}
        />

        {/* 5 KPI Cards Row */}
        <StoreKpiGrid summary={summary} />

        {/* Middle Section: Store Locations Map + Store Performance + Store Status & Device Health */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch min-w-0">
          {/* Left Column: Store Locations Map (5 cols) */}
          <div className="md:col-span-5 h-[285px] sm:h-[305px]">
            <StoreLocationsMap
              stores={allStores}
              selectedStore={selectedStore}
              onSelectStore={setSelectedStore}
              onViewStoreDetails={handleOpenStoreDetails}
            />
          </div>

          {/* Middle Column: Store Performance Bar Chart (4 cols) */}
          <div className="md:col-span-4 h-[285px] sm:h-[305px]">
            <StorePerformance
              data={performanceData}
              metric={performanceMetric}
              onMetricChange={setPerformanceMetric}
            />
          </div>

          {/* Right Column: Stacked Store Status Donut & Device Health (3 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between gap-3 h-[285px] sm:h-[305px]">
            <div className="flex-1">
              <StoreStatusChart
                data={statusDistribution}
                totalStores={summary.totalStores}
              />
            </div>
            <div className="flex-1">
              <DeviceHealth
                data={deviceHealth}
                onViewDetailsClick={() => setDeviceHealthModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: All Stores Table */}
        <StoreTable
          stores={stores}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          search={filters.search}
          region={filters.region}
          status={filters.status}
          onSearchChange={setSearch}
          onRegionChange={setRegion}
          onStatusChange={setStatus}
          onPageChange={setPage}
          onExport={() => {
            handleExport();
            showToast('Store network list exported to CSV', 'success');
          }}
          onViewStore={handleOpenStoreDetails}
          onSelectStore={setSelectedStore}
        />
      </div>

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={addStoreModalOpen}
        onClose={() => setAddStoreModalOpen(false)}
        onSubmit={async (input) => {
          const res = await handleCreateStore(input);
          if (res) {
            showToast(`Store "${input.name}" created successfully!`, 'success');
          }
          return res;
        }}
      />

      {/* Device Health Details Modal */}
      <DeviceHealthModal
        isOpen={deviceHealthModalOpen}
        onClose={() => setDeviceHealthModalOpen(false)}
        devices={deviceHealth}
      />

      {/* Store Details Drawer */}
      <StoreDetailsDrawer
        isOpen={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        store={drawerStore || selectedStore}
      />
    </DashboardLayout>
  );
};

export default StoreManagementPage;
