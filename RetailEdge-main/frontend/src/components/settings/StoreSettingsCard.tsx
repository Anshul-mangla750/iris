import React, { useState } from 'react';
import { Store, ChevronDown, Clock, Check } from 'lucide-react';
import type { StoreSettings } from '../../types/settings';

interface StoreSettingsCardProps {
  initialSettings: StoreSettings;
  onSave: (settings: StoreSettings) => void;
}

export const StoreSettingsCard: React.FC<StoreSettingsCardProps> = ({
  initialSettings,
  onSave,
}) => {
  const [form, setForm] = useState<StoreSettings>(initialSettings);
  const [isSaved, setIsSaved] = useState(false);

  const storeOptions = [
    'Store 001 - City Mall, Delhi',
    'Store 002 - Pacific Mall',
    'Store 003 - Select Citywalk',
    'Store 004 - DLF Avenue',
  ];

  const planogramOptions = [
    'Snacks - Standard',
    'Beverages - Premium',
    'Dairy - Chilled',
    'Personal Care',
    'Home Care',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs mt-4">
      {/* Card Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <Store className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">Store Settings</h2>
          <p className="text-[11px] text-slate-500">Configure store-specific settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Default Store & Operating Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Default Store
            </label>
            <div className="relative">
              <select
                value={form.defaultStoreId}
                onChange={(e) => setForm({ ...form, defaultStoreId: e.target.value })}
                className="w-full appearance-none px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                {storeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Store Operating Hours
            </label>
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={form.operatingHours.open}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      operatingHours: { ...form.operatingHours, open: e.target.value },
                    })
                  }
                  className="w-full pl-2.5 pr-6 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-center"
                />
                <Clock className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-xs text-slate-400 font-medium">to</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={form.operatingHours.close}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      operatingHours: { ...form.operatingHours, close: e.target.value },
                    })
                  }
                  className="w-full pl-2.5 pr-6 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-center"
                />
                <Clock className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Default Planogram */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Default Planogram
          </label>
          <div className="relative">
            <select
              value={form.defaultPlanogramId}
              onChange={(e) => setForm({ ...form, defaultPlanogramId: e.target.value })}
              className="w-full appearance-none px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer"
            >
              {planogramOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Thresholds & Save Changes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Auto Stock Alert Threshold
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={form.autoStockAlertThreshold}
                onChange={(e) =>
                  setForm({ ...form, autoStockAlertThreshold: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 pr-12 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-2 text-[11px] text-slate-400 font-medium pointer-events-none">
                units
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Queue Alert Threshold
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={form.queueAlertThreshold}
                onChange={(e) =>
                  setForm({ ...form, queueAlertThreshold: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 pr-14 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-2 text-[11px] text-slate-400 font-medium pointer-events-none">
                people
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {isSaved && <Check className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoreSettingsCard;
