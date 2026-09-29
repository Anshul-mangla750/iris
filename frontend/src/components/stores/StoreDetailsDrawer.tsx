import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Store,
  MapPin,
  Users,
  IndianRupee,
  Cpu,
  User,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import type { Store as StoreType } from '../../types/store';
import { getStoreStatusMeta } from '../../utils/storeMeta';
import { formatCurrencyINR, formatNumberIN } from '../../utils/formatters';

interface StoreDetailsDrawerProps {
  store: StoreType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StoreDetailsDrawer: React.FC<StoreDetailsDrawerProps> = ({
  store,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !store) return null;

  const statusMeta = getStoreStatusMeta(store.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {store.name}
              </h3>
              <p className="text-[11px] text-slate-500">{store.code} • {store.region} Region</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Status & Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10.5px] font-medium text-slate-400 block mb-0.5">
                Current Operational State
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusMeta.pillClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                <span>{statusMeta.label}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10.5px] font-medium text-slate-400 block mb-0.5">
                Last Telemetry Sync
              </span>
              <span className="text-[11px] font-semibold text-slate-700">
                {store.lastUpdatedAt}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg border border-slate-200/80 bg-white">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Today Footfall</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {formatNumberIN(store.footfall)}
              </div>
              <div className="text-[10.5px] text-emerald-600 font-semibold mt-0.5">
                ↑ {store.footfallTrend}% vs yesterday
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200/80 bg-white">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                <span>Today Sales</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {formatCurrencyINR(store.sales)}
              </div>
              <div className="text-[10.5px] text-emerald-600 font-semibold mt-0.5">
                ↑ {store.salesTrend}% vs target
              </div>
            </div>
          </div>

          {/* Location & Facility Information */}
          <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/40">
            <h4 className="text-[11.5px] font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Facility Location</span>
            </h4>
            <div className="space-y-1 text-slate-600 text-[11.5px]">
              <div><span className="font-semibold text-slate-700">Address:</span> {store.address}</div>
              <div><span className="font-semibold text-slate-700">City / State:</span> {store.city}, {store.state} ({store.postalCode})</div>
              <div><span className="font-semibold text-slate-700">Country:</span> {store.country}</div>
              <div><span className="font-semibold text-slate-700">Coordinates:</span> {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}</div>
            </div>
          </div>

          {/* On-Site Contacts & Staffing */}
          <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/40">
            <h4 className="text-[11.5px] font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Management & Operations</span>
            </h4>
            <div className="space-y-1 text-slate-600 text-[11.5px]">
              <div><span className="font-semibold text-slate-700">Store Manager:</span> {store.manager || 'Unassigned'}</div>
              {store.phone && <div><span className="font-semibold text-slate-700">Phone:</span> {store.phone}</div>}
              {store.email && <div><span className="font-semibold text-slate-700">Email:</span> {store.email}</div>}
              <div><span className="font-semibold text-slate-700">Timezone:</span> {store.timezone}</div>
            </div>
          </div>

          {/* Connected Device Infrastructure */}
          <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/40">
            <h4 className="text-[11.5px] font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Edge Devices ({store.devicesOnline} / {store.devicesTotal} Online)</span>
            </h4>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${(store.devicesOnline / store.devicesTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Drawer Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>View Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/alerts')}
            className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <span>Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsDrawer;
