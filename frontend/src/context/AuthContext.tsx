import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AuthState, LoginCredentials, User } from '../types/auth';
import authService, { DEFAULT_DEMO_USER, LOGGED_OUT_KEY } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(LOGGED_OUT_KEY) === 'true') {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    }
    return {
      user: DEFAULT_DEMO_USER,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  });

  // Restore authenticated session on initial mount
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          if (user) {
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            setState((prev) => ({
              ...prev,
              user: null,
              isAuthenticated: false,
              isLoading: false,
            }));
          }
        }
      } catch {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      const user = response.user;

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
