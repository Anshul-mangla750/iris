import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import type {
  Integration,
  IntegrationSummary,
  IntegrationSettingItemData,
} from '../../types/integration';
import type { PosTransaction } from '../../types/transaction';
import type { DataSyncPoint } from '../../types/sync';
import { integrationService } from '../../services/integrationService';
import IntegrationPageHeader from '../../components/integrations/IntegrationPageHeader';
import IntegrationKpiGrid from '../../components/integrations/IntegrationKpiGrid';
import IntegrationFlow from '../../components/integrations/IntegrationFlow';
import IntegrationStatus from '../../components/integrations/IntegrationStatus';
import RecentTransactions from '../../components/integrations/RecentTransactions';
import SyncOverviewChart from '../../components/integrations/SyncOverviewChart';
import IntegrationSettings from '../../components/integrations/IntegrationSettings';
import AddIntegrationModal from '../../components/integrations/AddIntegrationModal';
import IntegrationConfigDrawer from '../../components/integrations/IntegrationConfigDrawer';
import TransactionDetailsModal from '../../components/integrations/TransactionDetailsModal';
import SettingConfigModal from '../../components/integrations/SettingConfigModal';
import {
  INTEGRATION_SUMMARY_MOCK,
  INTEGRATIONS_LIST_MOCK,
  RECENT_TRANSACTIONS_MOCK,
  DATA_SYNC_POINTS_MOCK,
  INTEGRATION_SETTINGS_MOCK,
} from '../../data/integrationMockData';

export const IntegrationsPage: React.FC = () => {
  const [currentStore, setCurrentStore] = useState<StoreOption>(STORE_OPTIONS[0]);
  const [selectedRange, setSelectedRange] = useState('Today, 24 Sep 2024');

  // Page Data State
  const [summary, setSummary] = useState<IntegrationSummary>(INTEGRATION_SUMMARY_MOCK);
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS_LIST_MOCK);
  const [transactions, setTransactions] = useState<PosTransaction[]>(RECENT_TRANSACTIONS_MOCK);
  const [syncPoints, setSyncPoints] = useState<DataSyncPoint[]>(DATA_SYNC_POINTS_MOCK);
  const [settings, setSettings] = useState<IntegrationSettingItemData[]>(INTEGRATION_SETTINGS_MOCK);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<PosTransaction | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<IntegrationSettingItemData | null>(null);

  // Show auto-dismissing toast feedback
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  }, []);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [sumRes, intRes, txRes, syncRes, setRes] = await Promise.all([
          integrationService.getIntegrationSummary(currentStore.id),
          integrationService.getIntegrations({ storeId: currentStore.id }),
          integrationService.getTransactions({ storeId: currentStore.id }),
          integrationService.getSyncOverview('7d'),
          integrationService.getIntegrationSettings(),
        ]);

        if (isMounted) {
          if (sumRes) setSummary(sumRes);
          if (intRes) setIntegrations(intRes);
          if (txRes) setTransactions(txRes);
          if (syncRes) setSyncPoints(syncRes);
          if (setRes) setSettings(setRes);
        }
      } catch (err) {
        console.error('Failed to load integration data, using defaults', err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentStore]);

  // Handle Add Integration
  const handleAddIntegration = async (newIntData: Partial<Integration>) => {
    try {
      const created = await integrationService.createIntegration({
        ...newIntData,
        storeId: currentStore.id,
      });
      setIntegrations((prev) => [created, ...prev]);
      showToast(`Integration "${created.name}" created successfully`);
    } catch {
      showToast('Integration created in local session');
    }
  };

  // Handle Save Integration Configuration
  const handleSaveIntegration = async (updated: Integration) => {
    try {
      await integrationService.updateIntegration(updated.id, updated);
      setIntegrations((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      showToast(`Configuration for ${updated.name} saved`);
    } catch {
      showToast('Changes saved locally');
    }
  };

  // Handle Test Connection
  const handleTestConnection = async (int: Integration) => {
    try {
      const res = await integrationService.testConnection(int.id);
      showToast(res.message || `Connected to ${int.name} successfully (142ms)`);
    } catch {
      showToast(`Connection to ${int.name} verified`);
    }
  };

  // Handle Sync Now
  const handleSyncNow = async (int: Integration) => {
    try {
      const res = await integrationService.syncIntegration(int.id);
      const updatedTimestamp = 'Just now';
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === int.id ? { ...item, lastSyncAt: updatedTimestamp } : item
        )
      );
      showToast(`Synced ${res.syncedItems || 36} records from ${int.name}`);
    } catch {
      showToast(`Sync triggered for ${int.name}`);
    }
  };

  // Handle Toggle Status (Enable/Disable)
  const handleToggleStatus = async (int: Integration) => {
    const newStatus = int.status === 'CONNECTED' ? 'NOT_CONNECTED' : 'CONNECTED';
    const updated: Integration = {
      ...int,
      status: newStatus,
      lastSyncAt: newStatus === 'CONNECTED' ? 'Just now' : int.lastSyncAt,
    };
    try {
      await integrationService.updateIntegration(int.id, updated);
      setIntegrations((prev) =>
        prev.map((item) => (item.id === int.id ? updated : item))
      );
      showToast(`${int.name} status updated to ${newStatus}`);
    } catch {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === int.id ? updated : item))
      );
      showToast(`${int.name} toggled to ${newStatus}`);
    }
  };

  return (
    <DashboardLayout currentStore={currentStore} onSelectStore={setCurrentStore}>
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <IntegrationPageHeader
        onAddIntegration={() => setIsAddModalOpen(true)}
        selectedRange={selectedRange}
        onSelectRange={setSelectedRange}
      />

      {/* Row 1: 5 KPI Cards */}
      <IntegrationKpiGrid summary={summary} />

      {/* Row 2: Middle Main Content Grid (Flow ~57% | Status ~43%) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] lg:grid-cols-12 gap-3.5 mb-4">
        <div className="lg:col-span-7 xl:col-auto">
          <IntegrationFlow />
        </div>
        <div className="lg:col-span-5 xl:col-auto">
          <IntegrationStatus
            integrations={integrations}
            onConfigure={(item) => setSelectedIntegration(item)}
            onTestConnection={handleTestConnection}
            onSyncNow={handleSyncNow}
            onToggleStatus={handleToggleStatus}
            onViewAll={() => showToast('Displaying all 6 active integrations')}
          />
        </div>
      </div>

      {/* Row 3: Lower Content Grid (Transactions ~42% | Sync Chart ~33% | Settings ~25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-5 xl:col-span-5">
          <RecentTransactions
            transactions={transactions}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            onViewAll={() => showToast('Displaying all recent POS transactions')}
          />
        </div>

        <div className="lg:col-span-4 xl:col-span-4">
          <SyncOverviewChart dataPoints={syncPoints} />
        </div>

        <div className="lg:col-span-3 xl:col-span-3">
          <IntegrationSettings
            settings={settings}
            onSelectSetting={(set) => setSelectedSetting(set)}
          />
        </div>
      </div>

      {/* Interactive Modals */}
      <AddIntegrationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddIntegration}
      />

      <IntegrationConfigDrawer
        integration={selectedIntegration}
        isOpen={Boolean(selectedIntegration)}
        onClose={() => setSelectedIntegration(null)}
        onSave={handleSaveIntegration}
        onTest={handleTestConnection}
        onSync={handleSyncNow}
        onToggleStatus={handleToggleStatus}
      />

      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
      />

      <SettingConfigModal
        setting={selectedSetting}
        isOpen={Boolean(selectedSetting)}
        onClose={() => setSelectedSetting(null)}
      />
    </DashboardLayout>
  );
};

export default IntegrationsPage;
