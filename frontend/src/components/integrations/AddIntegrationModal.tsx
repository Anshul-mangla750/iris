import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { Integration, IntegrationType, IntegrationConnectionType } from '../../types/integration';

interface AddIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newIntegration: Partial<Integration>) => void;
}

export const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [type, setType] = useState<IntegrationType>('POS');
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [connectionType, setConnectionType] = useState<IntegrationConnectionType>('API');
  const [syncFrequency, setSyncFrequency] = useState('Real-time');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || `${type} - ${provider || 'System'}`;
    onAdd({
      name: finalName,
      type,
      provider: provider || 'Generic Provider',
      connectionType,
      syncFrequency,
      status: 'CONNECTED',
      lastSyncAt: 'Just now',
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Integration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect a POS, ERP, or external retail provider
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Integration Added</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your new system has been connected and scheduled for synchronization.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Integration Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Integration Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    'POS',
                    'ERP',
                    'INVENTORY_API',
                    'HR_STAFF',
                    'SUPPLIER_PORTAL',
                    'CUSTOM_API',
                  ] as IntegrationType[]
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                      if (!provider) {
                        if (t === 'POS') setProvider('Pine Labs POS');
                        if (t === 'ERP') setProvider('Microsoft Dynamics');
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium text-center transition-colors ${
                      type === t
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Provider / System Name
              </label>
              <input
                type="text"
                required
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Pine Labs POS, SAP S/4HANA, Tally Prime"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Custom Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`e.g. ${type} - ${provider || 'System'}`}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Connection Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Connection Type
                </label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value as IntegrationConnectionType)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="API">API</option>
                  <option value="WEBHOOK">Webhook</option>
                  <option value="SCHEDULED">Scheduled Sync</option>
                </select>
              </div>

              {/* Sync Frequency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sync Frequency
                </label>
                <select
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="Real-time">Real-time</option>
                  <option value="Every 15 min">Every 15 min</option>
                  <option value="Every 30 min">Every 30 min</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            {/* Optional Credentials (Masked) */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                API Endpoint Configuration (Mock)
              </span>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.pos-partner.internal/v1"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">API Secret</label>
                  <input
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Add Integration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddIntegrationModal;
