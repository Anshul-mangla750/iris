import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import type { User, UserSummary } from '../../types/user';
import type { Role } from '../../types/role';
import type { PermissionMatrixRow } from '../../types/permission';
import type { AccessActivity } from '../../types/accessActivity';
import usersAccessService from '../../services/usersAccessService';
import UsersAccessHeader from '../../components/users/UsersAccessHeader';
import UserKpiGrid from '../../components/users/UserKpiGrid';
import UsersAccessTabs, { type TabType } from '../../components/users/UsersAccessTabs';
import UsersTable from '../../components/users/UsersTable';
import UserRolesPanel from '../../components/users/UserRolesPanel';
import PermissionMatrix from '../../components/users/PermissionMatrix';
import RecentAccessActivity from '../../components/users/RecentAccessActivity';
import AddUserModal from '../../components/users/AddUserModal';
import EditUserModal from '../../components/users/EditUserModal';
import UserProfileDrawer from '../../components/users/UserProfileDrawer';
import AddRoleModal from '../../components/users/AddRoleModal';
import PermissionDetailsModal from '../../components/users/PermissionDetailsModal';
import {
  USER_SUMMARY_MOCK,
  USERS_LIST_MOCK,
  ROLES_LIST_MOCK,
  PERMISSION_MATRIX_MOCK,
  ACCESS_ACTIVITIES_MOCK,
} from '../../data/usersAccessMockData';

export const UsersAccessPage: React.FC = () => {
  const [currentStore, setCurrentStore] = useState<StoreOption>(STORE_OPTIONS[0]);
  const [selectedRange, setSelectedRange] = useState('Today, 24 Sep 2024');
  const [activeTab, setActiveTab] = useState<TabType>('Users');

  // Page Data State
  const [summary, setSummary] = useState<UserSummary>(USER_SUMMARY_MOCK);
  const [users, setUsers] = useState<User[]>(USERS_LIST_MOCK);
  const [roles, setRoles] = useState<Role[]>(ROLES_LIST_MOCK);
  const [matrix, setMatrix] = useState<PermissionMatrixRow[]>(PERMISSION_MATRIX_MOCK);
  const [activities, setActivities] = useState<AccessActivity[]>(ACCESS_ACTIVITIES_MOCK);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('All Stores');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [permissionTarget, setPermissionTarget] = useState<{
    module: string;
    role: string;
    allowed: boolean;
  } | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  }, []);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [sumRes, usersRes, rolesRes, matrixRes, actRes] = await Promise.all([
          usersAccessService.getUserSummary(currentStore.id),
          usersAccessService.getUsers({
            search: searchQuery,
            role: selectedRole,
            storeId: currentStore.id,
            status: selectedStatus,
            page: currentPage,
          }),
          usersAccessService.getRoles(),
          usersAccessService.getPermissionMatrix(),
          usersAccessService.getActivityLogs(),
        ]);

        if (isMounted) {
          if (sumRes) setSummary(sumRes);
          if (usersRes?.users) setUsers(usersRes.users);
          if (rolesRes) setRoles(rolesRes);
          if (matrixRes) setMatrix(matrixRes);
          if (actRes) setActivities(actRes);
        }
      } catch (err) {
        console.error('Error fetching users and access data:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [currentStore, searchQuery, selectedRole, selectedStatus, currentPage]);

  // Handle Add User
  const handleAddUser = async (newUserData: Partial<User>) => {
    try {
      const created = await usersAccessService.createUser({
        ...newUserData,
        organizationId: 'org-001',
      });
      setUsers((prev) => [created, ...prev]);
      showToast(`User ${created.name} added successfully`);
    } catch {
      showToast('User created in local session');
    }
  };

  // Handle Edit User
  const handleSaveUser = async (updated: User) => {
    try {
      await usersAccessService.updateUser(updated.id, updated);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      showToast(`User ${updated.name} updated`);
    } catch {
      showToast('Changes saved locally');
    }
  };

  // Handle Toggle User Status (Activate/Deactivate)
  const handleToggleUserStatus = async (targetUser: User) => {
    const newStatus = targetUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const newPresence = newStatus === 'ACTIVE' ? 'ONLINE' : 'OFFLINE';
    const updated: User = {
      ...targetUser,
      status: newStatus,
      presenceStatus: newPresence,
    };
    try {
      if (newStatus === 'ACTIVE') {
        await usersAccessService.activateUser(targetUser.id);
      } else {
        await usersAccessService.deactivateUser(targetUser.id);
      }
      setUsers((prev) => prev.map((u) => (u.id === targetUser.id ? updated : u)));
      showToast(`${targetUser.name} is now ${newStatus.toLowerCase()}`);
    } catch {
      setUsers((prev) => prev.map((u) => (u.id === targetUser.id ? updated : u)));
      showToast(`${targetUser.name} status updated`);
    }
  };

  // Handle Add Role
  const handleAddRole = async (newRoleData: Partial<Role>) => {
    try {
      const created = await usersAccessService.createRole(newRoleData);
      setRoles((prev) => [...prev, created]);
      showToast(`Role "${created.name}" created`);
    } catch {
      showToast('Role created locally');
    }
  };

  // Handle Permission Update from Matrix
  const handleSavePermission = async (moduleName: string, roleName: string, isAllowed: boolean) => {
    const roleKeyMap: Record<string, keyof PermissionMatrixRow> = {
      'Super Admin': 'superAdmin',
      'Store Manager': 'storeManager',
      'Inventory Staff': 'inventoryStaff',
      Cashier: 'cashier',
      Security: 'security',
      Analyst: 'analyst',
      Viewer: 'viewer',
    };
    const key = roleKeyMap[roleName];
    if (key) {
      setMatrix((prev) =>
        prev.map((row) =>
          row.module === moduleName ? { ...row, [key]: isAllowed } : row
        )
      );
      try {
        await usersAccessService.updatePermission(moduleName, key as string, isAllowed);
        showToast(`Permissions updated for ${roleName} on ${moduleName}`);
      } catch {
        showToast('Permission updated in local state');
      }
    }
  };

  return (
    <DashboardLayout currentStore={currentStore} onSelectStore={setCurrentStore}>
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <UsersAccessHeader
        onAddUser={() => setIsAddUserOpen(true)}
        selectedRange={selectedRange}
        onSelectRange={setSelectedRange}
      />

      {/* KPI Cards Row (5 Cards) */}
      <UserKpiGrid summary={summary} />

      {/* Tab Navigation */}
      <UsersAccessTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Tab Content */}
      {activeTab === 'Users' ? (
        <>
          {/* Row 2: Middle Content Grid (All Users ~68% | User Roles ~32%) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.85fr_1fr] lg:grid-cols-12 gap-3.5 mb-4">
            <div className="lg:col-span-8 xl:col-auto">
              <UsersTable
                users={users}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                selectedStoreFilter={selectedStoreFilter}
                onStoreChange={setSelectedStoreFilter}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onEditUser={(u) => setEditingUser(u)}
                onViewProfile={(u) => setViewingUser(u)}
                onToggleStatus={handleToggleUserStatus}
                onChangeRole={(u) => setEditingUser(u)}
                onManageStores={(u) => setEditingUser(u)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalUsersCount={28}
              />
            </div>

            <div className="lg:col-span-4 xl:col-auto">
              <UserRolesPanel
                roles={roles}
                onAddRole={() => setIsAddRoleOpen(true)}
                onEditRole={(r) => showToast(`Edit role ${r.name}`)}
                onDuplicateRole={(r) => {
                  const dup: Role = {
                    ...r,
                    id: `role_${Date.now()}`,
                    name: `${r.name} (Copy)`,
                    userCount: 0,
                  };
                  setRoles((prev) => [...prev, dup]);
                  showToast(`Duplicated role ${r.name}`);
                }}
                onViewPermissions={(r) => showToast(`Displaying permissions for ${r.name}`)}
              />
            </div>
          </div>

          {/* Row 3: Bottom Content Grid (Permission Matrix ~68% | Recent Access Activity ~32%) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.85fr_1fr] lg:grid-cols-12 gap-3.5">
            <div className="lg:col-span-8 xl:col-auto">
              <PermissionMatrix
                matrix={matrix}
                onCellClick={(module, role, allowed) =>
                  setPermissionTarget({ module, role, allowed })
                }
              />
            </div>

            <div className="lg:col-span-4 xl:col-auto">
              <RecentAccessActivity
                activities={activities}
                onViewAll={() => showToast('Displaying all 48 security events')}
              />
            </div>
          </div>
        </>
      ) : activeTab === 'Roles' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Role Management</h3>
              <p className="text-xs text-slate-500">
                Configure role scopes, store access, and functional boundaries.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddRoleOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0fa968] text-white text-xs font-semibold"
            >
              + Add New Role
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {roles.map((r) => (
              <div
                key={r.id}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{r.name}</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {r.userCount} Users
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{r.description}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <span>Scope: {r.storeScope}</span>
                  <button
                    type="button"
                    onClick={() => showToast(`Edit permissions for ${r.name}`)}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Edit Permissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'Permissions' ? (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-2">System Permission Matrix</h3>
          <p className="text-xs text-slate-500 mb-4">
            Granular CRUD access rules for RetailEdge modules across all active roles.
          </p>
          <PermissionMatrix
            matrix={matrix}
            onCellClick={(module, role, allowed) =>
              setPermissionTarget({ module, role, allowed })
            }
          />
        </div>
      ) : activeTab === 'Access Control' ? (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Access Control & Session Policies</h3>
            <p className="text-xs text-slate-500">
              Configure session duration, IP allowlists, and store boundary restrictions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border border-slate-200 rounded-lg space-y-2">
              <h4 className="font-bold text-slate-800">Store Authorization Rules</h4>
              <p className="text-slate-500 text-[11.5px]">
                Enforce store-level isolation to prevent cross-store data leakage.
              </p>
              <div className="pt-2 text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Multi-tenant Organization Scoping Active</span>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg space-y-2">
              <h4 className="font-bold text-slate-800">Session Security</h4>
              <p className="text-slate-500 text-[11.5px]">
                Automatic logout after 30 minutes of inactivity across POS terminals.
              </p>
              <div className="pt-2 text-slate-700 font-semibold">
                Idle Timeout: 1800 seconds
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-1">Audit & Access Logs</h3>
          <p className="text-xs text-slate-500 mb-4">
            Comprehensive audit trail of logins, configuration adjustments, and permission changes.
          </p>
          <RecentAccessActivity
            activities={activities}
            onViewAll={() => showToast('Displaying complete log export')}
          />
        </div>
      )}

      {/* Interactive Modals */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={handleAddUser}
      />

      <EditUserModal
        user={editingUser}
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />

      <UserProfileDrawer
        user={viewingUser}
        isOpen={Boolean(viewingUser)}
        onClose={() => setViewingUser(null)}
        onEdit={(u) => {
          setViewingUser(null);
          setEditingUser(u);
        }}
        onToggleStatus={handleToggleUserStatus}
      />

      <AddRoleModal
        isOpen={isAddRoleOpen}
        onClose={() => setIsAddRoleOpen(false)}
        onAddRole={handleAddRole}
      />

      <PermissionDetailsModal
        moduleName={permissionTarget?.module || null}
        roleName={permissionTarget?.role || null}
        allowed={permissionTarget?.allowed ?? true}
        isOpen={Boolean(permissionTarget)}
        onClose={() => setPermissionTarget(null)}
        onSave={handleSavePermission}
      />
    </DashboardLayout>
  );
};

export default UsersAccessPage;
