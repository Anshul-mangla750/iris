import React, { useState } from 'react';
import { X, UserCheck, Shield } from 'lucide-react';
import { MOCK_STAFF_MEMBERS } from '../../data/alertMockData';
import type { Alert } from '../../types/alert';

interface AssignStaffModalProps {
  isOpen: boolean;
  alert: Alert | null;
  onClose: () => void;
  onAssign: (alertId: string, staffName: string) => void;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  isOpen,
  alert,
  onClose,
  onAssign,
}) => {
  const [selectedStaff, setSelectedStaff] = useState<string>(
    alert?.assignedTo || MOCK_STAFF_MEMBERS[0].name
  );

  if (!isOpen || !alert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaff) {
      onAssign(alert.id, selectedStaff);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Assign to Staff</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[260px]">
                {alert.message}
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <p className="text-xs text-slate-600">
            Select an authorized team member to dispatch for this operational alert:
          </p>

          <div className="space-y-2">
            {MOCK_STAFF_MEMBERS.map((staff) => {
              const isSelected = selectedStaff === staff.name;

              return (
                <label
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff.name)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {staff.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {staff.name}
                      </div>
                      <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-slate-400" />
                        <span>{staff.role}</span>
                      </div>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="assignedStaff"
                    value={staff.name}
                    checked={isSelected}
                    onChange={() => setSelectedStaff(staff.name)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                </label>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-bold shadow-2xs transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignStaffModal;
