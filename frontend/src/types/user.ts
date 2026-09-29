export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type UserPresence = 'ONLINE' | 'OFFLINE';

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  roleId: string;
  roleName: string;
  storeIds: string[];
  storeAccessText: string;
  status: UserStatus;
  presenceStatus: UserPresence;
  lastLoginAt?: string;
  avatar?: string;
  initials: string;
  avatarBg?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  userRoles: number;
  permissionGroups: number;
  trends: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    userRoles: number;
    permissionGroups: number;
  };
}
