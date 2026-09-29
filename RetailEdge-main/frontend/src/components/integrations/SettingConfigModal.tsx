import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { IntegrationSettingItemData } from '../../types/integration';

interface SettingConfigModalProps {
  setting: IntegrationSettingItemData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SettingConfigModal: React.FC<SettingConfigModalProps> = ({
  setting,
  isOpen,
  onClose,
}) => {
  const [saved, setSaved] = useState(false);

  if (!isOpen || !setting) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{setting.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{setting.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saved ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Settings Saved</h4>
            <p className="text-xs text-slate-500 mt-1">
              Configuration updated successfully in local session.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
            {setting.iconName === 'key' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Authentication Method
                  </label>
                  <select className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
                    <option>Bearer Token (OAuth 2.0)</option>
                    <option>API Key + Secret</option>
                    <option>Basic Auth (mTLS)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Client ID / API Key
                  </label>
                  <input
                    type="password"
                    defaultValue="pos_live_key_9988291039"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    API Secret
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••••••••••••••••••"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gateway URL
                  </label>
                  <input
                    type="text"
                    defaultValue="https://gateway.retailedge.internal/pos/v1"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </>
            )}

            {setting.iconName === 'workflow' && (
              <div className="space-y-3">
                <p className="text-slate-500">
                  Map external POS/ERP schema fields to RetailEdge canonical schemas.
                </p>
                <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Source Field</span>
                    <span>RetailEdge Model</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-800">trx_total</span>
                    <span className="text-emerald-700 font-medium">→ amount</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-800">sku_barcode</span>
                    <span className="text-emerald-700 font-medium">→ barcode</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-800">qty_on_hand</span>
                    <span className="text-emerald-700 font-medium">→ currentStock</span>
                  </div>
                </div>
              </div>
            )}

            {setting.iconName === 'clock' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Default Synchronization Interval
                  </label>
                  <select className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
                    <option>Real-time (Webhooks)</option>
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Every 30 minutes</option>
                    <option>Hourly</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Batch Size per Poll
                  </label>
                  <input
                    type="number"
                    defaultValue={100}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </>
            )}

            {setting.iconName === 'alert' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Maximum Retry Count
                  </label>
                  <input
                    type="number"
                    defaultValue={3}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Retry Backoff Strategy
                  </label>
                  <select className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
                    <option>Exponential Backoff with Jitter</option>
                    <option>Linear (5 min interval)</option>
                    <option>Immediate Retry</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="alertOnFail"
                    defaultChecked
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="alertOnFail" className="text-slate-700 font-medium">
                    Trigger alert in Operations Center on 3 consecutive failures
                  </label>
                </div>
              </>
            )}

            {setting.iconName === 'link' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Webhook Destination URL
                  </label>
                  <input
                    type="text"
                    defaultValue="https://api.retailedge.ai/hooks/pos-ingress"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subscribed Events
                  </label>
                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>transaction.created</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>inventory.stock_updated</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>product.catalog_changed</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white font-semibold transition-colors"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingConfigModal;
