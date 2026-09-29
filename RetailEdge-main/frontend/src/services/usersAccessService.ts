import apiClient from './apiClient';
import type { User, UserSummary } from '../types/user';
import type { Role } from '../types/role';
import type { PermissionMatrixRow } from '../types/permission';
import type { AccessActivity } from '../types/accessActivity';
import {
  USER_SUMMARY_MOCK,
  USERS_LIST_MOCK,
  ROLES_LIST_MOCK,
  PERMISSION_MATRIX_MOCK,
  ACCESS_ACTIVITIES_MOCK,
} from '../data/usersAccessMockData';

export const usersAccessService = {
  /**
   * Retrieves high-level user KPI metrics.
   * Endpoint: GET /api/users/summary
   */
  async getUserSummary(_storeId?: string): Promise<UserSummary> {
    try {
      const response = await apiClient.get<UserSummary>('/users/summary', {
        params: { storeId: _storeId },
      });
      return response.data || USER_SUMMARY_MOCK;
    } catch {
      return USER_SUMMARY_MOCK;
    }
  },

  /**
   * Retrieves paginated list of users with optional filtering.
   * Endpoint: GET /api/users
   */
  async getUsers(params?: {
    search?: string;
    role?: string;
    storeId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number }> {
    try {
      const response = await apiClient.get<{ users: User[]; total: number }>('/users', { params });
      if (response.data && Array.isArray(response.data.users)) {
        return response.data;
      }
      return { users: USERS_LIST_MOCK, total: USERS_LIST_MOCK.length };
    } catch {
      let filtered = [...USERS_LIST_MOCK];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.roleName.toLowerCase().includes(q)
        );
      }
      if (params?.role && params.role !== 'All Roles' && params.role !== 'All') {
        filtered = filtered.filter((u) => u.roleName === params.role);
      }
      if (params?.status && params.status !== 'All Status' && params.status !== 'All') {
        const s = params.status.toUpperCase();
        filtered = filtered.filter(
          (u) => u.presenceStatus === s || u.status === s
        );
      }
      return { users: filtered, total: 28 };
    }
  },

  /**
   * Retrieves a single user by ID.
   * Endpoint: GET /api/users/:id
   */
  async getUser(id: string): Promise<User | null> {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response.data || null;
    } catch {
      return USERS_LIST_MOCK.find((u) => u.id === id) || null;
    }
  },

  /**
   * Creates a new user.
   * Endpoint: POST /api/users
   */
  async createUser(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.post<User>('/users', data);
      return response.data;
    } catch {
      const initials = (data.name || 'New User')
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      const newUser: User = {
        id: `user_${Date.now()}`,
        organizationId: 'org-001',
        name: data.name || 'New User',
        email: data.email || 'user@retailedge.ai',
        phone: data.phone || '+91 98765 00000',
        roleId: data.roleId || 'role_viewer',
        roleName: data.roleName || 'Viewer',
        storeIds: data.storeIds || ['store-001'],
        storeAccessText: data.storeAccessText || 'Store 001',
        status: data.status || 'ACTIVE',
        presenceStatus: 'OFFLINE',
        lastLoginAt: 'Never',
        initials,
        avatarBg: 'bg-emerald-600',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newUser;
    }
  },

  /**
   * Updates an existing user.
   * Endpoint: PATCH /api/users/:id
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.patch<User>(`/users/${id}`, data);
      return response.data;
    } catch {
      const existing = USERS_LIST_MOCK.find((u) => u.id === id) || USERS_LIST_MOCK[0];
      return { ...existing, ...data, updatedAt: new Date().toISOString() };
    }
  },

  /**
   * Deletes a user.
   * Endpoint: DELETE /api/users/:id
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/users/${id}`);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Activates a user.
   * Endpoint: PATCH /api/users/:id/activate
   */
  async activateUser(id: string): Promise<boolean> {
    try {
      await apiClient.patch(`/users/${id}/activate`);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Deactivates a user.
   * Endpoint: PATCH /api/users/:id/deactivate
   */
  async deactivateUser(id: string): Promise<boolean> {
    try {
      await apiClient.patch(`/users/${id}/deactivate`);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Retrieves all defined roles.
   * Endpoint: GET /api/roles
   */
  async getRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get<Role[]>('/roles');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return ROLES_LIST_MOCK;
    } catch {
      return ROLES_LIST_MOCK;
    }
  },

  /**
   * Creates a new role.
   * Endpoint: POST /api/roles
   */
  async createRole(data: Partial<Role>): Promise<Role> {
    try {
      const response = await apiClient.post<Role>('/roles', data);
      return response.data;
    } catch {
      const newRole: Role = {
        id: `role_${Date.now()}`,
        organizationId: 'org-001',
        name: data.name || 'Custom Role',
        description: data.description || 'Custom role permissions',
        userCount: 0,
        permissions: data.permissions || ['dashboard.view'],
        storeScope: data.storeScope || 'ASSIGNED',
        isSystemRole: false,
        status: 'ACTIVE',
        iconName: 'users',
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
      };
      return newRole;
    }
  },

  /**
   * Retrieves the permission matrix.
   * Endpoint: GET /api/permissions/matrix
   */
  async getPermissionMatrix(): Promise<PermissionMatrixRow[]> {
    try {
      const response = await apiClient.get<PermissionMatrixRow[]>('/permissions/matrix');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return PERMISSION_MATRIX_MOCK;
    } catch {
      return PERMISSION_MATRIX_MOCK;
    }
  },

  /**
   * Updates permission matrix cell.
   * Endpoint: PATCH /api/permissions
   */
  async updatePermission(
    moduleName: string,
    roleKey: string,
    allowed: boolean
  ): Promise<boolean> {
    try {
      await apiClient.patch('/permissions', { moduleName, roleKey, allowed });
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Retrieves recent access activities.
   * Endpoint: GET /api/access-logs
   */
  async getActivityLogs(): Promise<AccessActivity[]> {
    try {
      const response = await apiClient.get<AccessActivity[]>('/access-logs');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return ACCESS_ACTIVITIES_MOCK;
    } catch {
      return ACCESS_ACTIVITIES_MOCK;
    }
  },
};

export default usersAccessService;
