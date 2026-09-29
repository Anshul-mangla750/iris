import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';
import type { LoginCredentials } from '../../types/auth';
import { getDashboardRouteByRole } from '../../utils/authRedirect';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, error, login, clearError } = useAuth();

  // If already authenticated, redirect to destination or role-based dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      const targetRoute = from || getDashboardRouteByRole(user.role);
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLoginSubmit = async (credentials: LoginCredentials) => {
    const authenticatedUser = await login(credentials);
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const targetRoute = from || getDashboardRouteByRole(authenticatedUser.role);
    navigate(targetRoute, { replace: true });
  };

  return (
    <AuthLayout>
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={clearError}
      />
    </AuthLayout>
  );
};

export default Login;
