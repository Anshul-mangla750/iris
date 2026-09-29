export interface Role {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  storeScope: 'ALL' | 'ASSIGNED';
  isSystemRole: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  iconName: 'crown' | 'users' | 'package' | 'receipt' | 'shield' | 'chart';
  iconColor: string;
  iconBg: string;
}
