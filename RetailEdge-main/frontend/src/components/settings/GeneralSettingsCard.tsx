import React, { useState } from 'react';
import { Settings, ChevronDown, Check } from 'lucide-react';
import type { GeneralSettings } from '../../types/settings';

interface GeneralSettingsCardProps {
  initialSettings: GeneralSettings;
  onSave: (settings: GeneralSettings) => void;
}

export const GeneralSettingsCard: React.FC<GeneralSettingsCardProps> = ({
  initialSettings,
  onSave,
}) => {
  const [form, setForm] = useState<GeneralSettings>(initialSettings);
  const [isSaved, setIsSaved] = useState(false);

  const timezoneOptions = [
    'Asia/Kolkata (GMT+5:30)',
    'UTC',
    'Asia/Dubai',
    'Asia/Singapore',
    'Europe/London',
    'America/New_York',
  ];

  const dateFormatOptions = [
    'DD MMM YYYY (24 Sep 2024)',
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
  ];

  const currencyOptions = [
    'INR (₹) - Indian Rupee',
    'USD ($) - US Dollar',
    'EUR (€) - Euro',
    'GBP (£) - Pound Sterling',
  ];

  const languageOptions = ['English', 'Hindi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
      {/* Card Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <Settings className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">General Settings</h2>
          <p className="text-[11px] text-slate-500">Basic system configuration and preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Organization Name */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            value={form.organizationName}
            onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            placeholder="Organization Name"
          />
        </div>

        {/* Timezone & Date Format Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Timezone</label>
            <div className="relative">
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full appearance-none px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                {timezoneOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Date Format</label>
            <div className="relative">
              <select
                value={form.dateFormat}
                onChange={(e) => setForm({ ...form, dateFormat: e.target.value })}
                className="w-full appearance-none px-2.5 py-1.5 pr-6 text-[11px] text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                {dateFormatOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Currency & Language Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Currency</label>
            <div className="relative">
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full appearance-none px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                {currencyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Language</label>
            <div className="relative">
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full appearance-none px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                {languageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            {isSaved && <Check className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettingsCard;
