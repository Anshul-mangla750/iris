import React, { useState } from 'react';
import { X, Shield, Check } from 'lucide-react';
import type { PasswordPolicy } from '../../types/settings';

interface PasswordPolicyModalProps {
  policy: PasswordPolicy;
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: PasswordPolicy) => void;
}

export const PasswordPolicyModal: React.FC<PasswordPolicyModalProps> = ({
  policy,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<PasswordPolicy>({ ...policy });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Password Policy</h3>
              <p className="text-[11px] text-slate-500">Define credential complexity rules</p>
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
        <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Minimum Password Length
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={6}
                max={32}
                value={form.minLength}
                onChange={(e) => setForm({ ...form, minLength: Number(e.target.value) })}
                className="w-24 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-slate-500">characters</span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-800">Character Requirements</p>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.requireUppercase}
                onChange={(e) => setForm({ ...form, requireUppercase: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Require at least one uppercase letter (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.requireLowercase}
                onChange={(e) => setForm({ ...form, requireLowercase: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Require at least one lowercase letter (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.requireNumbers}
                onChange={(e) => setForm({ ...form, requireNumbers: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Require at least one numeric digit (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.requireSpecialChars}
                onChange={(e) => setForm({ ...form, requireSpecialChars: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Require at least one special character (!@#$%^&*)</span>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Password Expiration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={365}
                value={form.expirationDays}
                onChange={(e) => setForm({ ...form, expirationDays: Number(e.target.value) })}
                className="w-24 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-slate-500">days (0 for never)</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0fa968] hover:bg-[#0d8f58] rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Policy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordPolicyModal;
