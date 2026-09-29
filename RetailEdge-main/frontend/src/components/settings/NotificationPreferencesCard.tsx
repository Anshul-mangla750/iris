import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import type { NotificationPreference } from '../../types/settings';

interface NotificationPreferencesCardProps {
  initialPreferences: Record<
    'inventory' | 'queue' | 'planogram' | 'system' | 'dailyReports',
    NotificationPreference
  >;
  onSave: (
    prefs: Record<'inventory' | 'queue' | 'planogram' | 'system' | 'dailyReports', NotificationPreference>
  ) => void;
}

export const NotificationPreferencesCard: React.FC<NotificationPreferencesCardProps> = ({
  initialPreferences,
  onSave,
}) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isSaved, setIsSaved] = useState(false);

  const rows: Array<{
    key: 'inventory' | 'queue' | 'planogram' | 'system' | 'dailyReports';
    title: string;
    description: string;
  }> = [
    {
      key: 'inventory',
      title: 'Inventory Alerts',
      description: 'Low stock, out of stock alerts',
    },
    {
      key: 'queue',
      title: 'Queue Alerts',
      description: 'High queue length, wait time',
    },
    {
      key: 'planogram',
      title: 'Planogram Alerts',
      description: 'Non-compliance detection',
    },
    {
      key: 'system',
      title: 'System Alerts',
      description: 'Downtime, errors, maintenance',
    },
    {
      key: 'dailyReports',
      title: 'Daily Reports',
      description: 'Sales, footfall, inventory summary',
    },
  ];

  const handleToggleRow = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
  };

  const handleToggleChannel = (
    key: keyof typeof preferences,
    channel: 'email' | 'sms' | 'inApp'
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        channels: {
          ...prev[key].channels,
          [channel]: !prev[key].channels[channel],
        },
      },
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">Notification Preferences</h2>
          <p className="text-[11px] text-slate-500">Manage alerts and notification channels.</p>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3.5">
        {rows.map(({ key, title, description }) => {
          const pref = preferences[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {/* Modern Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleRow(key)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    pref.enabled ? 'bg-[#0fa968]' : 'bg-slate-300'
                  }`}
                  aria-label={`Toggle ${title}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      pref.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>

                {/* Channel Pills: Email, SMS, In-App */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleChannel(key, 'email')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition-colors cursor-pointer ${
                      pref.channels.email && pref.enabled
                        ? 'bg-[#e8f8f0] text-[#0fa968] border border-[#0fa968]/30'
                        : 'bg-slate-50 text-slate-400 border border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    Email
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleChannel(key, 'sms')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition-colors cursor-pointer ${
                      pref.channels.sms && pref.enabled
                        ? 'bg-[#e8f8f0] text-[#0fa968] border border-[#0fa968]/30'
                        : 'bg-slate-50 text-slate-400 border border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    SMS
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleChannel(key, 'inApp')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition-colors cursor-pointer ${
                      pref.channels.inApp && pref.enabled
                        ? 'bg-[#e8f8f0] text-[#0fa968] border border-[#0fa968]/30'
                        : 'bg-slate-50 text-slate-400 border border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    In-App
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-3 mt-1">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          {isSaved && <Check className="w-3.5 h-3.5" />}
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferencesCard;
