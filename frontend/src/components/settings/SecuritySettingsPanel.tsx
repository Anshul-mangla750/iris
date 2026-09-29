import React from 'react';
import { Shield, Lock, Globe, FileText, CheckCircle2 } from 'lucide-react';
import type { SecuritySettings } from '../../types/settings';

interface SecuritySettingsPanelProps {
  settings: SecuritySettings;
  onChange: (updated: Partial<SecuritySettings>) => void;
  onOpenPasswordPolicy: () => void;
  onOpenIpAccess: () => void;
}

export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = ({
  settings,
  onChange,
  onOpenPasswordPolicy,
  onOpenIpAccess,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Security & Access Policies</h2>
            <p className="text-xs text-slate-500">
              Multi-factor authentication, session management, and network controls
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Security Grade A+
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 2FA Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Require time-based OTP (Google Authenticator/Duo) for all managerial and admin logins.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ twoFactorEnabled: !settings.twoFactorEnabled })}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              settings.twoFactorEnabled ? 'bg-[#0fa968]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Audit Logging Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Immutable Audit Logging</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Capture every configuration change, role modification, and login event with timestamp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ auditLoggingEnabled: !settings.auditLoggingEnabled })}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              settings.auditLoggingEnabled ? 'bg-[#0fa968]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.auditLoggingEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Password Policy Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Password Complexity Policy</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Minimum {settings.passwordPolicy.minLength} characters, uppercase, numbers, and symbols
              required. Expires every {settings.passwordPolicy.expirationDays} days.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onOpenPasswordPolicy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              Configure Policy
            </button>
          </div>
        </div>

        {/* IP Access Control Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">IP Access Control Allowlist</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {settings.allowedIps.length} IP address(es) and CIDR subnets allowed for administrative
              console access.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onOpenIpAccess}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              Manage IP Addresses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPanel;
