import React from 'react';
import { Link as LinkIcon, RefreshCw, Sliders } from 'lucide-react';
import type { IntegrationSetting } from '../../types/settings';

interface IntegrationConfigurationPanelProps {
  integrations: IntegrationSetting[];
  onConfigure: (integration: IntegrationSetting) => void;
  onTest: (id: string) => void;
}

export const IntegrationConfigurationPanel: React.FC<IntegrationConfigurationPanelProps> = ({
  integrations,
  onConfigure,
  onTest,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Platform Integrations & Connectors</h2>
            <p className="text-xs text-slate-500">
              Manage POS, ERP, Notification gateways and external cloud APIs
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          7 of 9 Connected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {integrations.map((item) => {
          const isConnected = item.status === 'CONNECTED';

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mb-1">
                  Provider: <span className="font-medium text-slate-700">{item.provider}</span>
                </p>

                {item.lastSyncAt ? (
                  <p className="text-[10px] text-slate-400">Synced: {item.lastSyncAt}</p>
                ) : (
                  <p className="text-[10px] text-slate-400">Not configured yet</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onConfigure(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Configure</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTest(item.id)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                  title="Test Ping"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationConfigurationPanel;
