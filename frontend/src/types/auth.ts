export type UserRole = 'ADMIN' | 'REGIONAL_MANAGER' | 'STORE_MANAGER' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: 'bar-chart' | 'box' | 'users' | 'clipboard' | 'bell' | 'analytics' | 'camera';
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  iconName: 'store' | 'users' | 'cube' | 'clock';
}
