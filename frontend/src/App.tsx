import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import ShopperAnalyticsPage from './pages/shopper/ShopperAnalyticsPage';
import InventoryMonitoringPage from './pages/inventory/InventoryMonitoringPage';
import QueueIntelligencePage from './pages/queues/QueueIntelligencePage';
import PlanogramCompliancePage from './pages/planogram/PlanogramCompliancePage';
import AlertsPage from './pages/alerts/AlertsPage';
import StoreManagementPage from './pages/stores/StoreManagementPage';
import CameraManagementPage from './pages/cameras/CameraManagementPage';
import ProductsPlanogramPage from './pages/products-planogram/ProductsPlanogramPage';
import IntegrationsPage from './pages/integrations/IntegrationsPage';
import UsersAccessPage from './pages/users/UsersAccessPage';
import SettingsPage from './pages/settings/SettingsPage';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
          {/* Public Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Main Authenticated Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Shopper Analytics Route */}
          <Route
            path="/shopper"
            element={
              <ProtectedRoute>
                <ShopperAnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Inventory Monitoring Route */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryMonitoringPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Queue Intelligence Route */}
          <Route
            path="/queues"
            element={
              <ProtectedRoute>
                <QueueIntelligencePage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Planogram Compliance Route */}
          <Route
            path="/planogram"
            element={
              <ProtectedRoute>
                <PlanogramCompliancePage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Alerts & Notifications Operations Center Route */}
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Store Management Route */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <StoreManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Camera Management Route */}
          <Route
            path="/cameras"
            element={
              <ProtectedRoute>
                <CameraManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Products & Planogram Route */}
          <Route
            path="/products-planogram"
            element={
              <ProtectedRoute>
                <ProductsPlanogramPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated POS/ERP Integration Route */}
          <Route
            path="/integrations"
            element={
              <ProtectedRoute>
                <IntegrationsPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Users & Access Route */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersAccessPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Settings Route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Role-Specific Portal Aliases Route to Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STORE_MANAGER', 'REGIONAL_MANAGER']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STORE_MANAGER', 'STAFF']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
