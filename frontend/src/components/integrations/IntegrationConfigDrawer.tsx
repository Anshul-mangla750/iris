import React, { useState } from 'react';
import { X, CheckCircle2, RefreshCw, Power } from 'lucide-react';
import type { Integration } from '../../types/integration';

interface IntegrationConfigDrawerProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Integration) => void;
  onTest: (integration: Integration) => void;
  onSync: (integration: Integration) => void;
  onToggleStatus: (integration: Integration) => void;
}

export const IntegrationConfigDrawer: React.FC<IntegrationConfigDrawerProps> = ({
  integration,
  isOpen,
  onClose,
  onSave,
  onTest,
  onSync,
  onToggleStatus,
}) => {
  if (!isOpen || !integration) return null;

  const [provider, setProvider] = useState(integration.provider);
  const [syncFrequency, setSyncFrequency] = useState(integration.syncFrequency);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    onTest(integration);
    setTimeout(() => {
      setTesting(false);
      setTestResult('Connection Successful! Handshake completed in 42ms.');
    }, 800);
  };

  const handleSync = () => {
    setSyncing(true);
    setSyncResult(null);
    onSync(integration);
    setTimeout(() => {
      setSyncing(false);
      setSyncResult('Sync complete. 24 items updated.');
    }, 1000);
  };

  const handleSave = () => {
    onSave({
      ...integration,
      provider,
      syncFrequency,
    });
    onClose();
  };

  const isConnected = integration.status === 'CONNECTED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {integration.icon && (
              <img
                src={integration.icon}
                alt={integration.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900">{integration.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Type: {integration.type} • ID: {integration.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status and Action Buttons */}
          <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Status:</span>
              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968]" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Not Connected
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onToggleStatus(integration)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                isConnected
                  ? 'border-red-200 text-red-600 bg-white hover:bg-red-50'
                  : 'border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50'
              }`}
            >
              <Power className="w-3 h-3" />
              <span>{isConnected ? 'Disable' : 'Enable'}</span>
            </button>
          </div>

          {/* Test & Sync Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {testResult && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px]">
              {testResult}
            </div>
          )}

          {syncResult && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-[11px]">
              {syncResult}
            </div>
          )}

          {/* Configuration Fields */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Provider Name</label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sync Frequency</label>
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

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Last Sync</label>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs">
              {integration.lastSyncAt || 'Never synced'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationConfigDrawer;
