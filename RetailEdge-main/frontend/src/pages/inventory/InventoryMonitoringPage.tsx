import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import InventoryHeader from '../../components/inventory/InventoryHeader';
import InventoryKpiGrid from '../../components/inventory/InventoryKpiGrid';
import LiveShelfView from '../../components/inventory/LiveShelfView';
import InventoryStatusDistribution from '../../components/inventory/InventoryStatusDistribution';
import StockTrend from '../../components/inventory/StockTrend';
import CategoryStockStatus from '../../components/inventory/CategoryStockStatus';
import ShelfHealthAnalysis from '../../components/inventory/ShelfHealthAnalysis';
import LowStockItemsTable from '../../components/inventory/LowStockItemsTable';
import InventoryEventsTable from '../../components/inventory/InventoryEventsTable';
import RestockListModal from '../../components/inventory/RestockListModal';

import useInventory from '../../hooks/useInventory';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import { exportInventoryToCsv } from '../../utils/csvExport';
import type { StoreOption } from '../../types/dashboard';
import { useToast } from '../../context/ToastContext';
import type { LowStockProductItem } from '../../types/inventory';

export const InventoryMonitoringPage: React.FC = () => {
  const {
    overview,
    distribution,
    trend,
    categories,
    shelfView,
    shelfHealth,
    lowStockItems,
    events,
    activeStoreId,
    selectStore,
    timeRange,
    selectTimeRange,
    isLoading,
  } = useInventory('store-001');

  const { showToast } = useToast();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const currentStore: StoreOption =
    STORE_OPTIONS.find((s) => s.id === activeStoreId) || STORE_OPTIONS[0];

  const handleSelectStore = (store: StoreOption) => {
    selectStore(store.id);
  };

  const handleExport = () => {
    exportInventoryToCsv(lowStockItems, `retailedge-inventory-${activeStoreId}-${timeRange}.csv`);
    showToast('Inventory report exported to CSV', 'success');
  };

  const handleRestockItem = (item: LowStockProductItem) => {
    showToast(`Restock triggered: 10 units requested for ${item.productName} (${item.aisleShelf})`, 'success');
  };

  return (
    <DashboardLayout
      currentStore={currentStore}
      onSelectStore={handleSelectStore}
    >
      {/* 1. Header with Page Title, Subtitle, Date selector, Time Range, and Export CTA */}
      <InventoryHeader
        dateFormatted="Today, 24 Sep 2024"
        timeRange={timeRange}
        onSelectTimeRange={selectTimeRange}
        onExport={handleExport}
      />

      {/* 2. 6 KPI Cards in 1 Row on Desktop */}
      <InventoryKpiGrid
        overview={overview}
        onViewRestockList={() => setIsRestockModalOpen(true)}
      />

      {/* 3. Main Analytics Grid (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1.1fr] gap-3 mb-3.5 items-stretch">
        {/* Column 1: Live Shelf View */}
        <div className="h-full">
          <LiveShelfView data={shelfView} />
        </div>

        {/* Column 2: Inventory Status Distribution + Category-wise Stock Status */}
        <div className="flex flex-col gap-3 h-full">
          <InventoryStatusDistribution
            totalProducts={overview.totalProducts}
            segments={distribution}
            loading={isLoading}
          />
          <CategoryStockStatus
            categories={categories}
            loading={isLoading}
          />
        </div>

        {/* Column 3: Stock Trend + Shelf Health AI Analysis */}
        <div className="flex flex-col gap-3 h-full">
          <StockTrend
            data={trend}
            loading={isLoading}
          />
          <ShelfHealthAnalysis
            data={shelfHealth}
            loading={isLoading}
          />
        </div>
      </div>

      {/* 4. Bottom Row: Low Stock & Out of Stock Items (Left) + Recent Inventory Events (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-3">
        <LowStockItemsTable
          items={lowStockItems}
          loading={isLoading}
          onViewAll={() => setIsRestockModalOpen(true)}
          onRestockItem={handleRestockItem}
        />
        <InventoryEventsTable
          events={events}
          loading={isLoading}
          onViewAll={() => setIsRestockModalOpen(true)}
        />
      </div>

      {/* Restock Priority List Modal */}
      <RestockListModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        items={lowStockItems}
      />
    </DashboardLayout>
  );
};

export default InventoryMonitoringPage;
