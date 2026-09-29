import React, { useState } from 'react';
import { Store, Clock, Check, Layers } from 'lucide-react';
import type { StoreSettings } from '../../types/settings';

interface StoreConfigurationPanelProps {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => void;
}

export const StoreConfigurationPanel: React.FC<StoreConfigurationPanelProps> = ({
  settings,
  onSave,
}) => {
  const [form, setForm] = useState({
    storeName: 'City Mall - Flagship',
    storeCode: 'DEL-001',
    address: 'Ground Floor, City Mall, Sector 18',
    city: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    postalCode: '110001',
    phone: '+91 11 4982 7200',
    email: 'delhi001@retailedge.ai',
    timezone: 'Asia/Kolkata (GMT+5:30)',
    openTime: settings.operatingHours.open,
    closeTime: settings.operatingHours.close,
    status: 'ACTIVE',
  });
  const [isSaved, setIsSaved] = useState(false);

  const zones = [
    { name: 'Entrance & Welcome Foyer', cameras: 2, counterCount: 0 },
    { name: 'Aisle 1 - Beverages & Snacks', cameras: 3, counterCount: 0 },
    { name: 'Aisle 2 - Personal Care', cameras: 2, counterCount: 0 },
    { name: 'Aisle 3 - Packaged Staples', cameras: 3, counterCount: 0 },
    { name: 'Checkout & Billing Counters', cameras: 4, counterCount: 4 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      operatingHours: {
        open: form.openTime,
        close: form.closeTime,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Store Profile & Operating Rules</h2>
              <p className="text-xs text-slate-500">Configure parameters for Store 001 - City Mall, Delhi</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Store
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Store Name</label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Store Code</label>
              <input
                type="text"
                value={form.storeCode}
                onChange={(e) => setForm({ ...form, storeCode: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Timezone</label>
              <input
                type="text"
                disabled
                value={form.timezone}
                className="w-full px-3 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Postal Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Store Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Store Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Operating Opening Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.openTime}
                  onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                  className="w-full px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Operating Closing Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.closeTime}
                  onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                  className="w-full px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {isSaved && <Check className="w-3.5 h-3.5" />}
              <span>Save Store Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Store Zones & Counters Reference */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900">Configured Store Zones ({zones.length})</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {zones.map((zone) => (
            <div key={zone.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <p className="text-xs font-semibold text-slate-800">{zone.name}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>{zone.cameras} AI Cameras</span>
                {zone.counterCount > 0 && <span>{zone.counterCount} Billing Terminals</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreConfigurationPanel;
