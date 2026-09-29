import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';
import type { IntegrationSetting } from '../../types/settings';

interface IntegrationConfigModalProps {
  integration: IntegrationSetting | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, config: Partial<IntegrationSetting>) => void;
  onTest: (id: string) => Promise<{ success: boolean; message: string }>;
}

export const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  integration,
  isOpen,
  onClose,
  onSave,
  onTest,
}) => {
  if (!isOpen || !integration) return null;

  const [form, setForm] = useState<Partial<IntegrationSetting>>({ ...integration });
  const [showSecret, setShowSecret] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestPing = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await onTest(integration.id);
      setTestResult(res);
    } catch {
      setTestResult({ success: false, message: 'Connection test failed. Host unreachable.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(integration.id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configure {integration.name}</h3>
              <p className="text-[11px] text-slate-500">Provider: {integration.provider}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-xs font-medium text-slate-600">Current Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                integration.status === 'CONNECTED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  integration.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              {integration.status === 'CONNECTED' ? 'Connected & Active' : 'Not Connected'}
            </span>
          </div>

          {/* Conditional Fields based on provider */}
          {integration.category === 'EMAIL' ? (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={form.smtpHost || ''}
                  onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
                  placeholder="smtp.example.com"
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Port</label>
                  <input
                    type="number"
                    value={form.smtpPort || 587}
                    onChange={(e) => setForm({ ...form, smtpPort: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={form.smtpUser || ''}
                    onChange={(e) => setForm({ ...form, smtpUser: e.target.value })}
                    placeholder="SMTP Username"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          ) : integration.category === 'WHATSAPP' ? (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Business Account ID
                </label>
                <input
                  type="text"
                  value={form.whatsappAccountId || ''}
                  onChange={(e) => setForm({ ...form, whatsappAccountId: e.target.value })}
                  placeholder="e.g. 1092839218392"
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={form.whatsappPhoneId || ''}
                  onChange={(e) => setForm({ ...form, whatsappPhoneId: e.target.value })}
                  placeholder="e.g. 1049284729"
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Endpoint URL
                </label>
                <input
                  type="text"
                  value={form.baseUrl || ''}
                  onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                  placeholder="https://api.provider.com/v1"
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  API Key / Secret Token
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={form.apiKeyMasked || '••••••••••••••••••••••••'}
                    onChange={(e) => setForm({ ...form, apiKeyMasked: e.target.value })}
                    className="w-full px-3 py-1.5 pr-8 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Test connection output */}
          {testResult && (
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTestPing}
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0fa968] hover:bg-[#0d8f58] rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationConfigModal;
