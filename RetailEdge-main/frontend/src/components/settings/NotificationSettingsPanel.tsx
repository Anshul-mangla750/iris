import React, { useState } from 'react';
import { Bell, Check, Mail, MessageSquare, Monitor } from 'lucide-react';
import type { NotificationPreference } from '../../types/settings';

interface NotificationSettingsPanelProps {
  preferences: Record<'inventory' | 'queue' | 'planogram' | 'system' | 'dailyReports', NotificationPreference>;
  onSave: (prefs: Record<'inventory' | 'queue' | 'planogram' | 'system' | 'dailyReports', NotificationPreference>) => void;
}

export const NotificationSettingsPanel: React.FC<NotificationSettingsPanelProps> = ({
  preferences: initialPreferences,
  onSave,
}) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [digestFrequency, setDigestFrequency] = useState('Instant');
  const [isSaved, setIsSaved] = useState(false);

  const categories: Array<{
    key: 'inventory' | 'queue' | 'planogram' | 'system' | 'dailyReports';
    title: string;
    description: string;
  }> = [
    { key: 'inventory', title: 'Inventory Stock Alerts', description: 'Low shelf stock, out-of-stock, anomaly triggers' },
    { key: 'queue', title: 'Queue & Checkout Alerts', description: 'High wait times, queue overflow thresholds' },
    { key: 'planogram', title: 'Planogram Compliance Alerts', description: 'Misplaced SKUs, facing discrepancies' },
    { key: 'system', title: 'System & Edge Hardware Alerts', description: 'Camera disconnections, inference latency spikes' },
    { key: 'dailyReports', title: 'Daily Analytics Digest', description: 'Consolidated footfall, sales conversion summaries' },
  ];

  const handleToggle = (key: keyof typeof preferences) => {
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
    channel: 'email' | 'sms' | 'inApp' | 'push'
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
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Notification Routing & Channels</h2>
            <p className="text-xs text-slate-500">
              Customize delivery channels and notification escalation rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Dispatch Frequency:</span>
          <select
            value={digestFrequency}
            onChange={(e) => setDigestFrequency(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white"
          >
            <option value="Instant">Instant (Realtime)</option>
            <option value="Hourly">Hourly Digest</option>
            <option value="Daily">Daily Summary</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(({ key, title, description }) => {
          const pref = preferences[key];
          return (
            <div
              key={key}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{title}</p>
                <p className="text-[11px] text-slate-500">{description}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggle(key)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    pref.enabled ? 'bg-[#0fa968]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      pref.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleChannel(key, 'email')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                      pref.channels.email && pref.enabled
                        ? 'bg-[#e8f8f0] text-[#0fa968] border border-[#0fa968]/30 font-semibold'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleChannel(key, 'sms')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                      pref.channels.sms && pref.enabled
                        ? 'bg-[#e8f8f0] text-[#0fa968] border border-[#0fa968]/30 font-semibold'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleChannel(key, 'inApp')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                      pref.channels.inApp && pref.enabled
                        ? 'bg-[#e8f8f0] text-[#0fa968] border border-[#0fa968]/30 font-semibold'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>In-App</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
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

export default NotificationSettingsPanel;
