import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  GitBranch,
  ClipboardCheck,
  Bell,
  BarChart3,
  Store,
  Camera,
  Boxes,
  Workflow,
  UserCheck,
  Settings,
  ChevronDown,
  LogOut,
  Check,
} from 'lucide-react';
import RetailEdgeLogo from '../common/RetailEdgeLogo';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import { useAuth } from '../../context/AuthContext';
import type { StoreOption } from '../../types/dashboard';

export interface DashboardSidebarProps {
  activeItem?: string;
  onSelectItem?: (item: string) => void;
  selectedStore: StoreOption;
  onSelectStore: (store: StoreOption) => void;
  unreadAlertCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeItem = 'Dashboard',
  onSelectItem,
  selectedStore,
  onSelectStore,
  unreadAlertCount = 12,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Shopper Analytics', icon: Users },
    { label: 'Inventory Monitoring', icon: Package },
    { label: 'Queue Intelligence', icon: GitBranch },
    { label: 'Planogram Compliance', icon: ClipboardCheck },
    { label: 'Alerts & Notifications', icon: Bell, badge: unreadAlertCount },
    { label: 'Reports & Analytics', icon: BarChart3 },
    { label: 'Store Management', icon: Store },
    { label: 'Camera Management', icon: Camera },
    { label: 'Products & Planogram', icon: Boxes },
    { label: 'POS/ERP Integration', icon: Workflow },
    { label: 'Users & Access', icon: UserCheck },
    { label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (label: string) => {
    if (onSelectItem) {
      onSelectItem(label);
    }
    if (label === 'Dashboard') {
      navigate('/dashboard');
    } else if (label === 'Shopper Analytics' || label === 'Reports & Analytics') {
      navigate('/shopper');
    } else if (label === 'Inventory Monitoring') {
      navigate('/inventory');
    } else if (label === 'Queue Intelligence') {
      navigate('/queues');
    } else if (label === 'Planogram Compliance') {
      navigate('/planogram');
    } else if (label === 'Alerts & Notifications') {
      navigate('/alerts');
    } else if (label === 'Store Management') {
      navigate('/stores');
    } else if (label === 'Camera Management') {
      navigate('/cameras');
    } else if (label === 'Products & Planogram') {
      navigate('/products-planogram');
    } else if (label === 'POS/ERP Integration') {
      navigate('/integrations');
    } else if (label === 'Users & Access') {
      navigate('/users');
    } else if (label === 'Settings') {
      navigate('/settings');
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop with Blur */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200/90 flex flex-col justify-between select-none transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Logo Section */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <RetailEdgeLogo size="sm" showTagline={true} />
          </div>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-emerald-50/90 text-emerald-800 font-semibold border-l-2 border-emerald-600 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900 hover:translate-x-0.5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate flex-1 tracking-tight">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shrink-0 leading-tight shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Store Selector & User Profile Section */}
        <div className="p-3 border-t border-slate-100 space-y-2 shrink-0 bg-slate-50/70">
          {/* Store Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setStoreMenuOpen(!storeMenuOpen)}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/90 text-left hover:border-emerald-300 hover:shadow-xs transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-xs font-bold text-slate-800 truncate tracking-tight">
                  {selectedStore.code}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {selectedStore.name}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${storeMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {storeMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Location
                </div>
                {STORE_OPTIONS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      onSelectStore(st);
                      setStoreMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                      selectedStore.id === st.id
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">
                      {st.code} — {st.name}
                    </span>
                    {selectedStore.id === st.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/90 text-left hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 border border-emerald-200 text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-xs font-bold text-slate-800 truncate tracking-tight">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.role?.toUpperCase().includes('ADMIN') ? 'Super Admin' : user?.role || 'Staff'}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{user?.name || 'Admin'}</p>
                  <p className="text-[10.5px] text-slate-400 truncate">{user?.email || 'admin@retailedge.ai'}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
