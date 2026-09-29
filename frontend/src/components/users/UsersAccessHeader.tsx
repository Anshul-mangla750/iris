import React, { useState } from 'react';
import { Calendar, ChevronDown, Plus, Check } from 'lucide-react';

interface UsersAccessHeaderProps {
  onAddUser: () => void;
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

export const UsersAccessHeader: React.FC<UsersAccessHeaderProps> = ({
  onAddUser,
  selectedRange,
  onSelectRange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const ranges = [
    'Today, 24 Sep 2024',
    'Yesterday, 23 Sep 2024',
    'Last 7 Days',
    'Last 30 Days',
    'Custom Range',
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Users & Access
        </h1>
        <p className="text-[12.5px] text-slate-500 mt-0.5">
          Manage users, roles, permissions and access across your stores and modules.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
        {/* Date Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:border-slate-300 transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-40 text-xs">
              {ranges.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    onSelectRange(range);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 ${
                    selectedRange === range
                      ? 'text-emerald-600 font-semibold bg-emerald-50/50'
                      : 'text-slate-700'
                  }`}
                >
                  <span>{range}</span>
                  {selectedRange === range && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action: Add User */}
        <button
          type="button"
          onClick={onAddUser}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
};

export default UsersAccessHeader;
