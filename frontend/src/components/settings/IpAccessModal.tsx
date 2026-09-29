import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Globe } from 'lucide-react';

interface IpAccessModalProps {
  allowedIps: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (ips: string[]) => void;
}

export const IpAccessModal: React.FC<IpAccessModalProps> = ({
  allowedIps,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [ips, setIps] = useState<string[]>([...allowedIps]);
  const [newIp, setNewIp] = useState('');
  const [error, setError] = useState('');

  const handleAddIp = () => {
    const trimmed = newIp.trim();
    if (!trimmed) return;
    if (ips.includes(trimmed)) {
      setError('IP address is already in the allowlist.');
      return;
    }
    setIps([...ips, trimmed]);
    setNewIp('');
    setError('');
  };

  const handleRemoveIp = (ipToRemove: string) => {
    setIps(ips.filter((ip) => ip !== ipToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(ips);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">IP Access Control</h3>
              <p className="text-[11px] text-slate-500">
                Restrict administrative login to allowed IPs
              </p>
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
              Add New IP or CIDR Block
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newIp}
                onChange={(e) => {
                  setNewIp(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 192.168.1.1 or 10.0.0.0/24"
                className="flex-1 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddIp}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Allowed IP Addresses ({ips.length})
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {ips.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  No IP restrictions active. All IP addresses allowed.
                </p>
              ) : (
                ips.map((ip) => (
                  <div
                    key={ip}
                    className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg"
                  >
                    <span className="text-xs font-mono text-slate-700">{ip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIp(ip)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Remove IP"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
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
              <span>Save Allowlist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IpAccessModal;
