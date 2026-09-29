import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import type { StoreOption } from '../../types/dashboard';

interface DashboardLayoutProps {
  currentStore: StoreOption;
  onSelectStore: (store: StoreOption) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentStore,
  onSelectStore,
  children,
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeItem = location.pathname.startsWith('/settings')
    ? 'Settings'
    : location.pathname.startsWith('/users')
    ? 'Users & Access'
    : location.pathname.startsWith('/integrations')
    ? 'POS/ERP Integration'
    : location.pathname.startsWith('/products-planogram')
    ? 'Products & Planogram'
    : location.pathname.startsWith('/cameras')
    ? 'Camera Management'
    : location.pathname.startsWith('/stores')
    ? 'Store Management'
    : location.pathname.startsWith('/alerts')
    ? 'Alerts & Notifications'
    : location.pathname.startsWith('/planogram')
    ? 'Planogram Compliance'
    : location.pathname.startsWith('/queues')
    ? 'Queue Intelligence'
    : location.pathname.startsWith('/inventory')
    ? 'Inventory Monitoring'
    : location.pathname.startsWith('/shopper')
    ? 'Shopper Analytics'
    : 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Sidebar for Desktop & Mobile Drawer */}
      <DashboardSidebar
        activeItem={activeItem}
        selectedStore={currentStore}
        onSelectStore={onSelectStore}
        unreadAlertCount={12}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-[240px] flex flex-col flex-1 min-w-0 transition-all duration-200">
        {/* Top Header */}
        <DashboardHeader
          selectedStore={currentStore}
          onSelectStore={onSelectStore}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={
            location.pathname.startsWith('/settings')
              ? 'Search settings, configuration, preferences...'
              : location.pathname.startsWith('/users')
              ? 'Search users, roles, permissions...'
              : location.pathname.startsWith('/integrations')
              ? 'Search products, stores, integrations...'
              : location.pathname.startsWith('/products-planogram')
              ? 'Search products, SKUs, categories...'
              : location.pathname.startsWith('/cameras')
              ? 'Search cameras, stores, alerts...'
              : location.pathname.startsWith('/stores')
              ? 'Search stores, products, cameras...'
              : 'Search products, stores, alerts...'
          }
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 p-3.5 sm:p-5 max-w-[1720px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
