import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import type { SecuritySettings } from '../../types/settings';

interface SecuritySettingsCardProps {
  settings: SecuritySettings;
  onChange: (updated: Partial<SecuritySettings>) => void;
  onOpenPasswordPolicy: () => void;
  onOpenIpAccess: () => void;
}

export const SecuritySettingsCard: React.FC<SecuritySettingsCardProps> = ({
  settings,
  onChange,
  onOpenPasswordPolicy,
  onOpenIpAccess,
}) => {
  const sessionTimeoutOptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '60 minutes', value: 60 },
    { label: '120 minutes', value: 120 },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs mt-4">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">Security Settings</h2>
          <p className="text-[11px] text-slate-500">Manage access and security configurations.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* 1. Two-Factor Authentication (2FA) */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              Two-Factor Authentication (2FA)
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Require 2FA for all admin users</p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ twoFactorEnabled: !settings.twoFactorEnabled })}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              settings.twoFactorEnabled ? 'bg-[#0fa968]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 2. Session Timeout */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Session Timeout</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Automatic logout after inactivity</p>
          </div>
          <div className="relative shrink-0">
            <select
              value={settings.sessionTimeoutMinutes}
              onChange={(e) => onChange({ sessionTimeoutMinutes: Number(e.target.value) })}
              className="appearance-none px-2.5 py-1 pr-7 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {sessionTimeoutOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. Password Policy */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Password Policy</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Set minimum password requirements</p>
          </div>
          <button
            type="button"
            onClick={onOpenPasswordPolicy}
            className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            Configure
          </button>
        </div>

        {/* 4. IP Access Control */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 leading-tight">IP Access Control</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Restrict access to specific IP addresses
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenIpAccess}
            className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            Manage IPs
          </button>
        </div>

        {/* 5. Audit Logging */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Audit Logging</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Track user activities and system changes
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ auditLoggingEnabled: !settings.auditLoggingEnabled })}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              settings.auditLoggingEnabled ? 'bg-[#0fa968]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.auditLoggingEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsCard;
