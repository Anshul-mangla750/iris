import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { Role } from '../../types/role';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (role: Partial<Role>) => void;
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  onAddRole,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [storeScope, setStoreScope] = useState<'ALL' | 'ASSIGNED'>('ASSIGNED');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddRole({
      name,
      description: description || 'Custom assigned permissions',
      storeScope,
      userCount: 0,
      iconName: 'users',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      status: 'ACTIVE',
      isSystemRole: false,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setDescription('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Role</h3>
            <p className="text-xs text-slate-500 mt-0.5">Define a new system or store-level role.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Role Created</h4>
            <p className="text-xs text-slate-500 mt-1">Role has been added to the system.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Audit Inspector"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Store audit and compliance verification"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Store Scope</label>
              <select
                value={storeScope}
                onChange={(e) => setStoreScope(e.target.value as 'ALL' | 'ASSIGNED')}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="ASSIGNED">Assigned Stores Only</option>
                <option value="ALL">All Organization Stores</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white font-semibold transition-colors"
              >
                Create Role
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddRoleModal;
