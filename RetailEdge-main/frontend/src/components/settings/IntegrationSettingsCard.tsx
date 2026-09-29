import React, { useState } from 'react';
import {
  Link as LinkIcon,
  MoreVertical,
  Layers,
  CloudSun,
  MapPin,
  Mail,
  MessageSquare,
  PhoneCall,
  Laptop,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import type { IntegrationSetting } from '../../types/settings';

interface IntegrationSettingsCardProps {
  integrations: IntegrationSetting[];
  onConfigure: (integration: IntegrationSetting) => void;
  onTestConnection: (id: string) => void;
}

export const IntegrationSettingsCard: React.FC<IntegrationSettingsCardProps> = ({
  integrations,
  onConfigure,
  onTestConnection,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getProviderIcon = (item: IntegrationSetting) => {
    switch (item.category) {
      case 'POS':
        return (
          <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shadow-2xs">
            <Laptop className="w-3.5 h-3.5" />
          </div>
        );
      case 'ERP':
        if (item.name.includes('SAP')) {
          return (
            <div className="w-6 h-6 rounded bg-[#0070F2] text-white flex items-center justify-center font-black text-[8px] tracking-tighter">
              SAP
            </div>
          );
        }
        return (
          <div className="w-6 h-6 rounded bg-[#E31B23] text-white flex items-center justify-center font-black text-[7.5px] tracking-tight">
            Tally
          </div>
        );
      case 'INVENTORY':
        return (
          <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
        );
      case 'WEATHER':
        return (
          <div className="w-6 h-6 rounded bg-sky-500 text-white flex items-center justify-center">
            <CloudSun className="w-3.5 h-3.5" />
          </div>
        );
      case 'MAP':
        return (
          <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
        );
      case 'EMAIL':
        return (
          <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center">
            <Mail className="w-3.5 h-3.5" />
          </div>
        );
      case 'SMS':
        return (
          <div className="w-6 h-6 rounded bg-teal-600 text-white flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
        );
      case 'WHATSAPP':
        return (
          <div className="w-6 h-6 rounded bg-[#25D366] text-white flex items-center justify-center">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded bg-slate-600 text-white flex items-center justify-center">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
          <LinkIcon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">Integration Settings</h2>
          <p className="text-[11px] text-slate-500">Manage third-party integrations.</p>
        </div>
      </div>

      {/* Integration List (9 rows) */}
      <div className="divide-y divide-slate-100">
        {integrations.map((item) => {
          const isConnected = item.status === 'CONNECTED';
          const isMenuOpen = activeMenuId === item.id;

          return (
            <div
              key={item.id}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2"
            >
              {/* Left: Icon & Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                {getProviderIcon(item)}
                <span className="text-xs font-semibold text-slate-800 truncate">{item.name}</span>
              </div>

              {/* Right: Status, Configure Button, 3-dot Menu */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Status indicator */}
                <div className="flex items-center gap-1.5 w-24">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      isConnected ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                {/* Configure Button */}
                <button
                  type="button"
                  onClick={() => onConfigure(item)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
                >
                  Configure
                </button>

                {/* 3-dot Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs text-slate-700">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onConfigure(item);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                        <span>Settings</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onTestConnection(item.id);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-400" />
                        <span>Test Ping</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationSettingsCard;
