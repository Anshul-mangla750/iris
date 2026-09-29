import React, { useState } from 'react';
import { X, Store } from 'lucide-react';
import type { CreateStoreInput, StoreRegion, StoreStatus } from '../../types/store';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateStoreInput) => Promise<boolean>;
}

export const AddStoreModal: React.FC<AddStoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateStoreInput>({
    name: '',
    code: '',
    address: '',
    city: '',
    state: 'Delhi',
    country: 'India',
    postalCode: '',
    phone: '',
    email: '',
    region: 'North',
    timezone: 'Asia/Kolkata',
    status: 'ONLINE',
    manager: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Store Name is required';
    if (!formData.code.trim()) newErrors.code = 'Store Code is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.timezone.trim()) newErrors.timezone = 'Timezone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add New Store</h3>
              <p className="text-[11px] text-slate-500">
                Register a new retail facility in the RetailEdge network
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            {/* Store Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Store Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Store 013 - Crown Mall"
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${
                  errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                } focus:outline-none focus:border-emerald-500`}
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
            </div>

            {/* Store Code */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Store Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. Store 013"
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${
                  errors.code ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                } focus:outline-none focus:border-emerald-500`}
              />
              {errors.code && <p className="text-[10px] text-red-500 mt-0.5">{errors.code}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Plot 14, Main Mall Road"
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${
                errors.address ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
              } focus:outline-none focus:border-emerald-500`}
            />
            {errors.address && <p className="text-[10px] text-red-500 mt-0.5">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* City */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Delhi"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Delhi"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="110001"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Region */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Region *</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value as StoreRegion })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Central">Central</option>
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StoreStatus })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="ONLINE">Online</option>
                <option value="ALERT">Alert</option>
                <option value="OFFLINE">Offline</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Store Manager */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Manager Name</label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="e.g. Ramesh Verma"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98110 ..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-bold shadow-2xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
