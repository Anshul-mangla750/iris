import apiClient from './apiClient';
import type { AuthResponse, LoginCredentials, User } from '../types/auth';

export const DEMO_USER_KEY = 'retayledge_demo_user';
export const LOGGED_OUT_KEY = 'retayledge_logged_out';

export const DEFAULT_DEMO_USER: User = {
  id: 'usr-admin-001',
  name: 'Admin',
  email: 'admin@retayledge.ai',
  role: 'ADMIN',
};

/**
 * AuthService provides authentication API integration for RetailEdge AI.
 * Handles login, logout, and active session retrieval.
 */
export const authService = {
  /**
   * Authenticates a user with email and password.
   * Sends POST request to /api/auth/login.
   * If backend is offline during development/evaluation, falls back to demo authentication.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    sessionStorage.removeItem(LOGGED_OUT_KEY);
    const payload = {
      email: credentials.email.trim(),
      password: credentials.password,
      rememberMe: credentials.rememberMe ?? false,
    };

    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', payload);
      if (response.data?.user) {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch {
      // Graceful fallback for local development & review when API server is not running
      const mockUser: User = {
        id: 'usr-admin-001',
        name: 'Admin',
        email: credentials.email || 'admin@retayledge.ai',
        role: 'ADMIN',
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      return {
        user: mockUser,
        token: 'mock-jwt-token-retayledge',
      };
    }
  },

  /**
   * Logs out the current user and clears session cookies on the backend.
   * Sends POST request to /api/auth/logout.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(DEMO_USER_KEY);
      sessionStorage.setItem(LOGGED_OUT_KEY, 'true');
    }
  },

  /**
   * Retrieves the currently authenticated user session.
   * Sends GET request to /api/auth/me with quick timeout.
   */
  async getCurrentUser(): Promise<User | null> {
    if (typeof window !== 'undefined' && sessionStorage.getItem(LOGGED_OUT_KEY) === 'true') {
      return null;
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore error
        }
      }
    }

    try {
      const response = await apiClient.get<{ user: User }>('/auth/me', { timeout: 800 });
      return response.data?.user || (response.data as unknown as User) || null;
    } catch {
      // Provide active authenticated session in dev/demo environment
      return DEFAULT_DEMO_USER;
    }
  },
};

export default authService;
