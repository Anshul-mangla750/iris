import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PlanogramHeader from '../../components/planogram/PlanogramHeader';
import PlanogramKpiGrid from '../../components/planogram/PlanogramKpiGrid';
import LiveShelfDetection from '../../components/planogram/LiveShelfDetection';
import PlanogramComparison from '../../components/planogram/PlanogramComparison';
import ComplianceByCategory from '../../components/planogram/ComplianceByCategory';
import ShelfComplianceTrend from '../../components/planogram/ShelfComplianceTrend';
import NonCompliantItemsTable from '../../components/planogram/NonCompliantItemsTable';
import AIInsightsRecommendations from '../../components/planogram/AIInsightsRecommendations';
import PlanogramItemsModal from '../../components/planogram/PlanogramItemsModal';

import usePlanogram from '../../hooks/usePlanogram';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import { useToast } from '../../context/ToastContext';

export const PlanogramCompliancePage: React.FC = () => {
  const { showToast } = useToast();
  const {
    overview,
    liveShelf,
    comparison,
    categories,
    trend,
    nonCompliantItems,
    insights,
    activeStoreId,
    selectStore,
    timeRange,
    selectTimeRange,
    isLoading,
  } = usePlanogram('store-001');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentStore: StoreOption =
    STORE_OPTIONS.find((s) => s.id === activeStoreId) || STORE_OPTIONS[0];

  const handleSelectStore = (store: StoreOption) => {
    selectStore(store.id);
  };

  const handleExport = () => {
    // Generate CSV for non-compliant items
    const headers = ['#', 'Product', 'SKU', 'Issue Type', 'Aisle / Shelf', 'Action'];
    const rows = nonCompliantItems.map((item, idx) => [
      idx + 1,
      `"${item.productName}"`,
      `"${item.sku}"`,
      `"${item.issueType}"`,
      `"${item.aisleShelf}"`,
      `"${item.actionText}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planogram-compliance-${activeStoreId}-${timeRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Planogram compliance report exported to CSV', 'success');
  };

  return (
    <DashboardLayout
      currentStore={currentStore}
      onSelectStore={handleSelectStore}
    >
      {/* 1. Header with Page Title, Subtitle, Date selector, Time Range, and Export CTA */}
      <PlanogramHeader
        dateFormatted="Today, 24 Sep 2024"
        timeRange={timeRange}
        onSelectTimeRange={selectTimeRange}
        onExport={handleExport}
      />

      {/* 2. 5 KPI Cards in 1 Row on Desktop */}
      <PlanogramKpiGrid overview={overview} />

      {/* 3. Main Analytics Row: Live Shelf View (AI Detection) + Planogram vs Actual + Compliance by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr_0.9fr] gap-3 mb-3.5 items-stretch">
        <LiveShelfDetection
          data={liveShelf}
          loading={isLoading}
        />
        <PlanogramComparison
          data={comparison}
          loading={isLoading}
        />
        <ComplianceByCategory
          categories={categories}
          loading={isLoading}
        />
      </div>

      {/* 4. Bottom Analytics Row: Shelf Compliance Trend + Non-Compliant Items + AI Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.25fr_1.15fr] gap-3 items-stretch">
        <ShelfComplianceTrend
          data={trend}
          loading={isLoading}
        />
        <NonCompliantItemsTable
          items={nonCompliantItems}
          loading={isLoading}
          onViewAll={() => setIsModalOpen(true)}
          onActionClick={() => setIsModalOpen(true)}
        />
        <AIInsightsRecommendations
          insights={insights}
          loading={isLoading}
          onViewAll={() => setIsModalOpen(true)}
        />
      </div>

      {/* Modal for full inspection */}
      <PlanogramItemsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={nonCompliantItems}
      />
    </DashboardLayout>
  );
};

export default PlanogramCompliancePage;
