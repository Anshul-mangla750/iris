import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { PlanogramItem, PlanogramStatus } from '../../types/planogram';

interface CreatePlanogramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PlanogramItem>) => void;
}

export const CreatePlanogramModal: React.FC<CreatePlanogramModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [store, setStore] = useState('Store 001 - City Mall, Delhi');
  const [aisle, setAisle] = useState('Aisle 2 - Snacks');
  const [shelfCount, setShelfCount] = useState<number>(4);
  const [status, setStatus] = useState<PlanogramStatus>('Active');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Planogram name is required');
      return;
    }
    onSubmit({
      name,
      assignedTo: store,
      location: aisle.split(' - ')[0],
      shelfCount: Number(shelfCount),
      status,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Create New Planogram</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Planogram Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Snacks - High Traffic"
              className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Store
              </label>
              <input
                type="text"
                disabled
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Zone / Aisle
              </label>
              <input
                type="text"
                value={aisle}
                onChange={(e) => setAisle(e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Shelf Count
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={shelfCount}
                onChange={(e) => setShelfCount(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlanogramStatus)}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Shelf layout objectives, category guidelines..."
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0FA968] hover:bg-[#0d925a] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              Create Planogram
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanogramModal;
