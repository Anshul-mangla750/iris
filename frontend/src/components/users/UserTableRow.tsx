import React, { useState } from 'react';
import { Pencil, MoreVertical, Eye, KeyRound, Shield, Store, Power } from 'lucide-react';
import type { User } from '../../types/user';

interface UserTableRowProps {
  index: number;
  user: User;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (user: User) => void;
  onViewProfile: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onChangeRole: (user: User) => void;
  onManageStores: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  index,
  user,
  isSelected,
  onToggleSelect,
  onEdit,
  onViewProfile,
  onToggleStatus,
  onChangeRole,
  onManageStores,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Store Manager':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Inventory Staff':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cashier':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Security':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Analyst':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Field Operator':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isOnline = user.presenceStatus === 'ONLINE';

  return (
    <tr
      className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700 ${
        isSelected ? 'bg-emerald-50/30' : ''
      }`}
    >
      {/* Checkbox */}
      <td className="py-2.5 px-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(user.id)}
          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
        />
      </td>

      {/* Row Index */}
      <td className="py-2.5 px-2 text-slate-400 font-medium text-[11px]">
        {index + 1}
      </td>

      {/* Name with Avatar */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-2xs overflow-hidden ${
              user.avatarBg || 'bg-emerald-600'
            }`}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <span>{user.initials}</span>
          </div>
          <span className="font-semibold text-slate-900 text-[11.5px] truncate">
            {user.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="py-2.5 px-3 text-[11px] text-slate-500 truncate">
        {user.email}
      </td>

      {/* Role */}
      <td className="py-2.5 px-3 whitespace-nowrap">
        <span
          className={`inline-block px-2 py-0.5 rounded-md text-[10.5px] font-semibold border ${getRoleBadgeStyle(
            user.roleName
          )}`}
        >
          {user.roleName}
        </span>
      </td>

      {/* Store Access */}
      <td className="py-2.5 px-3 text-[11px] text-slate-600 font-medium whitespace-nowrap">
        {user.storeAccessText}
      </td>

      {/* Status */}
      <td className="py-2.5 px-3 whitespace-nowrap">
        {isOnline ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0fa968]" />
            Online
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-rose-500 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Offline
          </span>
        )}
      </td>

      {/* Last Login */}
      <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
        {user.lastLoginAt || '-'}
      </td>

      {/* Actions */}
      <td className="py-2.5 px-3 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5 relative">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
            title="Edit User"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="More Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-40 text-xs text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onViewProfile(user);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(user);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit User</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onChangeRole(user);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span>Change Role</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onManageStores(user);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Store className="w-3.5 h-3.5 text-purple-500" />
                    <span>Manage Store Access</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      alert(`Password reset link sent to ${user.email}`);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reset Password</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleStatus(user);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium ${
                      user.status === 'ACTIVE' ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
