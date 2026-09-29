import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import type { Alert } from '../../types/alert';
import { useAlerts } from '../../hooks/useAlerts';
import AlertsHeader from '../../components/alerts/AlertsHeader';
import AlertKpiGrid from '../../components/alerts/AlertKpiGrid';
import AlertTrend from '../../components/alerts/AlertTrend';
import AlertsByCategory from '../../components/alerts/AlertsByCategory';
import AlertStatusChart from '../../components/alerts/AlertStatusChart';
import AlertFilters from '../../components/alerts/AlertFilters';
import RecentAlertsTable from '../../components/alerts/RecentAlertsTable';
import AlertDetails from '../../components/alerts/AlertDetails';
import AssignStaffModal from '../../components/alerts/AssignStaffModal';
import { useToast } from '../../context/ToastContext';

export const AlertsPage: React.FC = () => {
  const { showToast } = useToast();
  const [currentStore, setCurrentStore] = useState<StoreOption>(STORE_OPTIONS[0]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [modalAlert, setModalAlert] = useState<Alert | null>(null);

  const {
    alerts,
    summary,
    trendData,
    categoriesData,
    statusBreakdown,
    selectedAlert,
    pendingFilters,
    dateRange,
    setDateRange,
    unreadCount,
    handleUpdatePendingFilter,
    handleApplyFilters,
    handleResetFilters,
    handleSelectAlert,
    handleMarkAllRead,
    handleAcknowledgeAlert,
    handleResolveAlert,
    handleAssignStaff,
  } = useAlerts();

  const handleOpenAssignModal = (alert: Alert) => {
    setModalAlert(alert);
    setAssignModalOpen(true);
  };

  const onResolveWithToast = async (alertId: string) => {
    await handleResolveAlert(alertId);
    showToast('Alert resolved successfully', 'success');
  };

  const onAcknowledgeWithToast = async (alertId: string) => {
    await handleAcknowledgeAlert(alertId);
    showToast('Alert acknowledged by staff', 'info');
  };

  const onAssignStaffWithToast = async (alertId: string, staffName: string) => {
    await handleAssignStaff(alertId, staffName);
    showToast(`Staff ${staffName} assigned to alert`, 'success');
    setAssignModalOpen(false);
  };

  return (
    <DashboardLayout
      currentStore={currentStore}
      onSelectStore={setCurrentStore}
    >
      <div className="space-y-3.5">
        {/* Page Top Header */}
        <AlertsHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onMarkAllRead={handleMarkAllRead}
          unreadCount={unreadCount}
        />

        {/* 5 KPI Cards Row */}
        <AlertKpiGrid summary={summary} />

        {/* Operations Center Main Layout: Main Left Grid + Right Filters Sidebar */}
        <div className="flex flex-col xl:flex-row gap-3.5 items-stretch min-w-0">
          {/* Left / Center Content: Analytics Row + Operations Row */}
          <div className="flex-1 min-w-0 space-y-3.5">
            {/* Top Analytics Row: Trend (wide) + Categories Donut + Status Progress */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
              <div className="md:col-span-5 h-[236px]">
                <AlertTrend data={trendData} />
              </div>
              <div className="md:col-span-4 h-[236px]">
                <AlertsByCategory
                  categories={categoriesData}
                  totalAlerts={summary.total}
                />
              </div>
              <div className="md:col-span-3 h-[236px]">
                <AlertStatusChart statusData={statusBreakdown} />
              </div>
            </div>

            {/* Bottom Operations Row: Recent Alerts Table + Alert Details Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
              <div className="lg:col-span-7">
                <RecentAlertsTable
                  alerts={alerts}
                  selectedAlertId={selectedAlert?.id}
                  onSelectAlert={handleSelectAlert}
                  onAcknowledge={onAcknowledgeWithToast}
                  onResolve={onResolveWithToast}
                  onOpenAssignModal={handleOpenAssignModal}
                />
              </div>
              <div className="lg:col-span-5">
                <AlertDetails
                  alert={selectedAlert}
                  onAcknowledge={onAcknowledgeWithToast}
                  onResolve={onResolveWithToast}
                  onOpenAssignModal={handleOpenAssignModal}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Filters Panel */}
          <div className="w-full xl:w-[220px] 2xl:w-[230px] shrink-0">
            <AlertFilters
              pendingFilters={pendingFilters}
              onChangePending={handleUpdatePendingFilter}
              onReset={handleResetFilters}
              onApply={handleApplyFilters}
            />
          </div>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      <AssignStaffModal
        isOpen={assignModalOpen}
        alert={modalAlert}
        onClose={() => {
          setAssignModalOpen(false);
          setModalAlert(null);
        }}
        onAssign={onAssignStaffWithToast}
      />
    </DashboardLayout>
  );
};

export default AlertsPage;
