import React, { useState } from 'react';
import { X, CheckCircle2, Shield } from 'lucide-react';

interface PermissionDetailsModalProps {
  moduleName: string | null;
  roleName: string | null;
  allowed: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: string, role: string, isAllowed: boolean) => void;
}

export const PermissionDetailsModal: React.FC<PermissionDetailsModalProps> = ({
  moduleName,
  roleName,
  allowed,
  isOpen,
  onClose,
  onSave,
}) => {
  const [canView, setCanView] = useState(allowed);
  const [canCreate, setCanCreate] = useState(allowed && roleName !== 'Viewer');
  const [canEdit, setCanEdit] = useState(allowed && roleName !== 'Viewer');
  const [canDelete, setCanDelete] = useState(roleName === 'Super Admin');
  const [canExport, setCanExport] = useState(allowed);
  const [saved, setSaved] = useState(false);

  if (!isOpen || !moduleName || !roleName) return null;

  const handleSave = () => {
    onSave(moduleName, roleName, canView);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Module Permissions</h3>
              <p className="text-[11px] text-slate-500">
                {roleName} • {moduleName}
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

        {saved ? (
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Permissions Saved</h4>
          </div>
        ) : (
          <div className="p-5 space-y-3 text-xs">
            <p className="text-slate-500 text-[11px]">
              Configure specific access privileges for <strong className="text-slate-800">{roleName}</strong> in{' '}
              <strong className="text-slate-800">{moduleName}</strong>.
            </p>

            <div className="space-y-2 border border-slate-100 rounded-lg p-3 bg-slate-50/70">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-slate-700">View Data</span>
                <input
                  type="checkbox"
                  checked={canView}
                  onChange={(e) => setCanView(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-slate-700">Create Records</span>
                <input
                  type="checkbox"
                  checked={canCreate}
                  onChange={(e) => setCanCreate(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-slate-700">Edit Records</span>
                <input
                  type="checkbox"
                  checked={canEdit}
                  onChange={(e) => setCanEdit(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-slate-700">Delete Records</span>
                <input
                  type="checkbox"
                  checked={canDelete}
                  onChange={(e) => setCanDelete(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-slate-700">Export Reports</span>
                <input
                  type="checkbox"
                  checked={canExport}
                  onChange={(e) => setCanExport(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-3.5 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionDetailsModal;
