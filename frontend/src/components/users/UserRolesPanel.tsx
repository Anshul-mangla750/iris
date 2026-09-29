import React, { useState } from 'react';
import {
  Crown,
  Users,
  Package,
  Receipt,
  Shield,
  BarChart3,
  Plus,
  Pencil,
  MoreVertical,
  Copy,
  Eye,
  UserPlus,
  Trash2,
} from 'lucide-react';
import type { Role } from '../../types/role';

interface UserRolesPanelProps {
  roles: Role[];
  onAddRole: () => void;
  onEditRole: (role: Role) => void;
  onDuplicateRole: (role: Role) => void;
  onViewPermissions: (role: Role) => void;
}

export const UserRolesPanel: React.FC<UserRolesPanelProps> = ({
  roles,
  onAddRole,
  onEditRole,
  onDuplicateRole,
  onViewPermissions,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getRoleIcon = (name: string) => {
    switch (name) {
      case 'crown':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'users':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'package':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'receipt':
        return <Receipt className="w-4 h-4 text-amber-600" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-rose-600" />;
      case 'chart':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      default:
        return <Users className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            User Roles
          </h2>
          <p className="text-[11.5px] text-slate-500 mt-0.5">
            Manage system roles and their permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRole}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Role</span>
        </button>
      </div>

      {/* Role Items List */}
      <div className="flex-1 divide-y divide-slate-100 flex flex-col justify-around">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center justify-between py-2 sm:py-2.5 hover:bg-slate-50/70 px-2 rounded-lg transition-colors group relative"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${role.iconBg}`}
              >
                {getRoleIcon(role.iconName)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {role.name}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {role.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 ml-2">
              <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                {role.userCount} users
              </span>

              <button
                type="button"
                onClick={() => onEditRole(role)}
                className="p-1 rounded-md border border-slate-200 text-slate-400 hover:text-emerald-700 hover:border-slate-300 transition-colors shadow-2xs"
                title="Edit Role"
              >
                <Pencil className="w-3 h-3" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenuId(activeMenuId === role.id ? null : role.id)
                  }
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {activeMenuId === role.id && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setActiveMenuId(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-40 text-xs text-left">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onEditRole(role);
                        }}
                        className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <Pencil className="w-3 h-3 text-slate-400" />
                        <span>Edit Role</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onDuplicateRole(role);
                        }}
                        className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Duplicate Role</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onViewPermissions(role);
                        }}
                        className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>View Permissions</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          alert(`Assign users to ${role.name}`);
                        }}
                        className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <UserPlus className="w-3 h-3 text-slate-400" />
                        <span>Assign Users</span>
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        disabled={role.isSystemRole}
                        onClick={() => {
                          setActiveMenuId(null);
                          if (!role.isSystemRole) {
                            alert(`Deleted role ${role.name}`);
                          }
                        }}
                        className={`w-full px-3 py-1.5 flex items-center gap-2 ${
                          role.isSystemRole
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-red-600 hover:bg-slate-50'
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Role</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRolesPanel;
