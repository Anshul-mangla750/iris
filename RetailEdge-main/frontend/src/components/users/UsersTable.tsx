import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';
import UserTableRow from './UserTableRow';
import type { User } from '../../types/user';

interface UsersTableProps {
  users: User[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRole: string;
  onRoleChange: (r: string) => void;
  selectedStoreFilter: string;
  onStoreChange: (s: string) => void;
  selectedStatus: string;
  onStatusChange: (st: string) => void;
  onEditUser: (user: User) => void;
  onViewProfile: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onChangeRole: (user: User) => void;
  onManageStores: (user: User) => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  totalUsersCount?: number;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStoreFilter,
  onStoreChange,
  selectedStatus,
  onStatusChange,
  onEditUser,
  onViewProfile,
  onToggleStatus,
  onChangeRole,
  onManageStores,
  currentPage,
  onPageChange,
  totalUsersCount = 28,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const roles = [
    'All Roles',
    'Super Admin',
    'Store Manager',
    'Inventory Staff',
    'Cashier',
    'Security',
    'Analyst',
    'Field Operator',
    'Viewer',
  ];

  const stores = ['All Stores', 'Store 001', 'Store 002', 'Store 003'];
  const statuses = ['All Status', 'Online', 'Offline'];

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight shrink-0">
          All Users
        </h2>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
          {/* Search Input */}
          <div className="relative w-full sm:w-44 lg:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
            />
          </div>

          {/* Role Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <span>{selectedRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 ${
                      selectedRole === r ? 'text-emerald-600 font-semibold bg-emerald-50/40' : 'text-slate-700'
                    }`}
                  >
                    <span>{r}</span>
                    {selectedRole === r && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Store Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setStoreMenuOpen(!storeMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <span>{selectedStoreFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {storeMenuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {stores.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onStoreChange(s);
                      setStoreMenuOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 ${
                      selectedStoreFilter === s ? 'text-emerald-600 font-semibold bg-emerald-50/40' : 'text-slate-700'
                    }`}
                  >
                    <span>{s}</span>
                    {selectedStoreFilter === s && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <span>{selectedStatus}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {statusMenuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-30 text-xs">
                {statuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      onStatusChange(st);
                      setStatusMenuOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 ${
                      selectedStatus === st ? 'text-emerald-600 font-semibold bg-emerald-50/40' : 'text-slate-700'
                    }`}
                  >
                    <span>{st}</span>
                    {selectedStatus === st && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Button */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (when rows selected) */}
      {selectedIds.length > 0 && (
        <div className="mb-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900 animate-fade-in">
          <span className="font-semibold">
            {selectedIds.length} user{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`Activated ${selectedIds.length} users`)}
              className="px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-700 font-medium hover:bg-emerald-100"
            >
              Activate
            </button>
            <button
              type="button"
              onClick={() => alert(`Deactivated ${selectedIds.length} users`)}
              className="px-2 py-0.5 rounded bg-white border border-red-300 text-red-700 font-medium hover:bg-red-50"
            >
              Deactivate
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-700 font-medium ml-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-600 tracking-wider">
              <th className="py-2 px-3 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="py-2 px-2 w-6">#</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Store Access</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Last Login</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <UserTableRow
                key={u.id}
                index={idx}
                user={u}
                isSelected={selectedIds.includes(u.id)}
                onToggleSelect={handleToggleSelect}
                onEdit={onEditUser}
                onViewProfile={onViewProfile}
                onToggleStatus={onToggleStatus}
                onChangeRole={onChangeRole}
                onManageStores={onManageStores}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100 text-xs text-slate-500">
        <div>
          Showing 1 to {users.length} of {totalUsersCount} users
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="w-6 h-6 rounded flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600"
          >
            ‹
          </button>
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold ${
                currentPage === page
                  ? 'bg-[#0fa968] text-white shadow-2xs'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage === 4}
            onClick={() => onPageChange(Math.min(4, currentPage + 1))}
            className="w-6 h-6 rounded flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
