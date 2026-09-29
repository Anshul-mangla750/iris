import React, { useState } from 'react';
import { MoreVertical, CheckCircle2, XCircle, RefreshCw, Sliders, ExternalLink } from 'lucide-react';
import type { Integration } from '../../types/integration';

interface IntegrationStatusRowProps {
  integration: Integration;
  onConfigure: (integration: Integration) => void;
  onTestConnection: (integration: Integration) => void;
  onSyncNow: (integration: Integration) => void;
  onToggleStatus: (integration: Integration) => void;
}

export const IntegrationStatusRow: React.FC<IntegrationStatusRowProps> = ({
  integration,
  onConfigure,
  onTestConnection,
  onSyncNow,
  onToggleStatus,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isConnected = integration.status === 'CONNECTED';

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700 relative">
      {/* System Icon & Name */}
      <td className="py-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {integration.icon ? (
              <img
                src={integration.icon}
                alt={integration.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
          <span className="font-semibold text-slate-800 text-[11.5px] truncate">
            {integration.name}
          </span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="py-2 px-2 whitespace-nowrap">
        {isConnected ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#e8f8f0] text-[#0fa968] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968]" />
            Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#ef4444] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            Not Connected
          </span>
        )}
      </td>

      {/* Last Sync (2 lines like reference) */}
      <td className="py-2 px-2 text-[10.5px] text-slate-600 whitespace-nowrap">
        {integration.lastSyncAt && integration.lastSyncAt !== '-' ? (
          <div className="leading-tight">
            <div>{integration.lastSyncAt.split(',')[0]},</div>
            <div className="text-slate-400 text-[10px]">{integration.lastSyncAt.split(',')[1]?.trim()}</div>
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>

      {/* Sync Frequency */}
      <td className="py-2 px-2 text-[11px] text-slate-600 font-medium whitespace-nowrap">
        {integration.syncFrequency}
      </td>

      {/* Actions */}
      <td className="py-2 px-2 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5 relative">
          {isConnected ? (
            <button
              type="button"
              onClick={() => onConfigure(integration)}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 text-[11px] font-medium transition-colors shadow-2xs"
            >
              Configure
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onConfigure(integration)}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 text-[11px] font-medium transition-colors shadow-2xs"
            >
              Setup
            </button>
          )}

          {/* Three-dots menu trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-40 text-xs text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onConfigure(integration);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onConfigure(integration);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Sliders className="w-3 h-3 text-slate-400" />
                    <span>Edit Configuration</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onTestConnection(integration);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Test Connection</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onSyncNow(integration);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <RefreshCw className="w-3 h-3 text-blue-500" />
                    <span>Sync Now</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleStatus(integration);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium ${
                      isConnected ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span>Disable Integration</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Enable Integration</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default IntegrationStatusRow;
