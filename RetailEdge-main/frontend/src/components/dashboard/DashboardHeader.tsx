import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Menu,
  Check,
  Settings,
  LogOut,
  Shield,
  Activity,
  AlertTriangle,
  Camera,
  Package,
  Store,
  X,
  ExternalLink,
  Sparkles,
  Send,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storeService } from '../../services/storeService';
import { alertService } from '../../services/alertService';
import type { Alert } from '../../types/alert';

export interface DashboardHeaderProps {
  selectedStore: StoreOption;
  onSelectStore: (store: StoreOption) => void;
  onOpenMobileMenu?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedStore,
  onSelectStore,
  onOpenMobileMenu,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search products, cameras, stores, alerts...',
}) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Dropdown states
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [storesList, setStoresList] = useState<StoreOption[]>(STORE_OPTIONS);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [unreadAlertCount, setUnreadAlertCount] = useState(3);

  // Chat message state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    { sender: 'ai', text: 'Hello! I am IRIS AI Assistant. How can I help you today?', time: 'Just now' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const isStoresRoute = location.pathname.startsWith('/stores');

  // Load stores list
  useEffect(() => {
    let isMounted = true;
    async function loadStores() {
      try {
        const res = await storeService.getStores();
        if (isMounted && res && res.stores && res.stores.length > 0) {
          const opts: StoreOption[] = res.stores.map((s) => ({
            id: s.id,
            code: s.code,
            name: s.name,
            city: s.city,
          }));
          setStoresList(opts);
        }
      } catch {
        // Fallback to initial STORE_OPTIONS
      }
    }
    loadStores();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load notifications
  useEffect(() => {
    let isMounted = true;
    async function loadAlerts() {
      try {
        const res = await alertService.getAlerts({ status: ['OPEN', 'ACKNOWLEDGED'] });
        if (isMounted && res && res.alerts) {
          setRecentAlerts(res.alerts.slice(0, 5));
          setUnreadAlertCount(res.alerts.filter((a) => a.status === 'OPEN').length || 3);
        }
      } catch {
        // Fallback
      }
    }
    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdowns on outside click
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setStoreDropdownOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "I've checked the live camera feeds. All checkout queues and shelves are currently operating within optimal parameters.";
      const lower = userText.toLowerCase();
      if (lower.includes('footfall') || lower.includes('visitor')) {
        reply = "Today's footfall is currently 1,482 visitors (+12% vs yesterday). Peak arrival was observed between 12 PM and 2 PM.";
      } else if (lower.includes('queue') || lower.includes('wait')) {
        reply = "Active queues: 2 of 5 open counters. Average waiting time is 1.8 minutes. AI predicts normal traffic through 5 PM.";
      } else if (lower.includes('stock') || lower.includes('inventory')) {
        reply = "There are 4 items flagged as Low Stock or Out of Stock (Pepsi 500ml, Maggi 70g, Dove Soap). You can audit them on the Inventory tab.";
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply, time: 'Just now' }]);
    }, 600);
  };

  const handleMarkAllRead = () => {
    setUnreadAlertCount(0);
    showToast('All notifications marked as read', 'info');
    setNotificationsOpen(false);
  };

  const handleSignOut = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  // Search quick suggestions
  const searchSuggestions = [
    { title: 'Aisle 1 Camera', type: 'camera', path: '/cameras' },
    { title: 'Checkout Queues', type: 'queue', path: '/queues' },
    { title: 'Pepsi 500ml (Low Stock)', type: 'inventory', path: '/inventory' },
    { title: 'Store 001 - City Mall', type: 'store', path: '/stores' },
  ].filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header ref={containerRef} className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 select-none">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-2.5 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-3.5 py-1.5 bg-slate-100/80 border border-slate-200/60 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans"
          />

          {/* Quick Search Dropdown */}
          {searchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-dropdown p-2 z-50 animate-fadeIn">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                Quick Results
              </div>
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setSearchFocused(false);
                      onSearchChange?.('');
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    {item.type === 'camera' && <Camera className="w-3.5 h-3.5 text-blue-500" />}
                    {item.type === 'queue' && <Activity className="w-3.5 h-3.5 text-indigo-500" />}
                    {item.type === 'inventory' && <Package className="w-3.5 h-3.5 text-amber-500" />}
                    {item.type === 'store' && <Store className="w-3.5 h-3.5 text-emerald-500" />}
                    <span className="font-medium text-slate-800">{item.title}</span>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 px-2 py-2">
                  No matching results for "{searchQuery}". Press Enter to search operations.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Store Dropdown, Live Status, Alerts, Messages, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Store Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              setStoreDropdownOpen(!storeDropdownOpen);
              setNotificationsOpen(false);
              setUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Store className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {isStoresRoute || selectedStore.code === 'All Stores'
                ? 'All Stores'
                : `${selectedStore.code} - ${selectedStore.name}`}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {storeDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl border border-slate-200 shadow-dropdown py-1.5 z-50 animate-fadeIn">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Active Location
              </div>
              {storesList.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    onSelectStore(st);
                    setStoreDropdownOpen(false);
                    showToast(`Switched active store to ${st.name}`, 'info');
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    selectedStore.id === st.id
                      ? 'bg-emerald-50 text-[#0fa968] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold truncate">{st.name}</div>
                    <div className="text-[10px] text-slate-400">{st.code} · {st.city}</div>
                  </div>
                  {selectedStore.id === st.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Status Badge with Active Edge stream status */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90 text-[11px] font-bold select-none shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live AI • 30 FPS • Synced</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setStoreDropdownOpen(false);
              setUserMenuOpen(false);
            }}
            className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute top-full right-0 mt-1 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-dropdown py-2 z-50 animate-fadeIn">
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Notifications & Alerts</h4>
                  <p className="text-[10px] text-slate-400">Live operational events</p>
                </div>
                {unreadAlertCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        navigate('/alerts');
                        setNotificationsOpen(false);
                      }}
                      className="px-3.5 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                    >
                      <div className="pt-0.5">
                        <AlertTriangle
                          className={`w-3.5 h-3.5 ${
                            a.severity === 'CRITICAL'
                              ? 'text-red-500'
                              : a.severity === 'WARNING'
                              ? 'text-amber-500'
                              : 'text-blue-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 leading-snug truncate">
                          {a.type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                          {a.message}
                        </div>
                        <div className="text-[9.5px] text-slate-400 mt-1">
                          {a.location || 'Store Floor'} · {a.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/alerts');
                    setNotificationsOpen(false);
                  }}
                  className="w-full py-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span>Open Operations Center</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages / AI Assistant Drawer Toggle */}
        <button
          type="button"
          onClick={() => setMessagesOpen(true)}
          className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            AI
          </span>
        </button>

        {/* User Avatar Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setStoreDropdownOpen(false);
              setNotificationsOpen(false);
            }}
            className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 bg-slate-200 shrink-0 cursor-pointer hover:ring-2 hover:ring-emerald-500/20 transition-all flex items-center justify-center"
            aria-label="User profile menu"
          >
            <img
              src="/images/dashboard/admin_avatar.jpg"
              alt={user?.name || 'Admin'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/customer_rahul.jpg';
              }}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-dropdown py-2 z-50 animate-fadeIn">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {user?.email || 'admin@retailedge.ai'}
                </div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-50 text-[#0fa968] font-bold text-[9px]">
                  {user?.role || 'ADMIN'}
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Store Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/users');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Access & Team</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full px-3.5 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Sliding Drawer */}
      {messagesOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">RetailEdge AI Assistant</h3>
                  <p className="text-[11px] text-emerald-600 font-medium">Online · Connected to Store CV Models</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMessagesOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-slate-100 flex flex-wrap gap-1.5 bg-white">
              {['Footfall report', 'Queue status', 'Restock list'].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setChatInput(prompt);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-[11px] font-semibold text-slate-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-sans shadow-2xs ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask RetailEdge AI anything..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
