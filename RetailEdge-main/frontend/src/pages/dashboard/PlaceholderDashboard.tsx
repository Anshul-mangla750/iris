import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/auth/BrandLogo';
import { LogOut } from 'lucide-react';

interface PlaceholderDashboardProps {
  portalName: string;
}

export const PlaceholderDashboard: React.FC<PlaceholderDashboardProps> = ({ portalName }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {portalName}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'admin@store.com'} • {user?.role || 'ADMIN'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {portalName}</h2>
          <p className="text-gray-600 mb-6">
            Authentication was successful. You are signed in with the role of <strong className="text-emerald-700">{user?.role || 'ADMIN'}</strong>.
          </p>
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900 text-sm">
            This portal view is ready for upcoming RetailEdge AI dashboard modules (Shopper Analytics, Queue Intelligence, Inventory Monitoring, and Alert Operations).
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceholderDashboard;
