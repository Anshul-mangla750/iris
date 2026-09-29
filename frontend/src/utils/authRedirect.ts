import type { UserRole } from '../types/auth';

/**
 * Returns the destination dashboard path according to the user's role.
 * Centralizes all role-based routing decisions in one place.
 *
 * For RetailEdge AI, all authenticated roles land on the main Store Operations Dashboard:
 * /login -> authentication -> /dashboard
 */
export function getDashboardRouteByRole(role?: UserRole | string | null): string {
  if (!role) {
    return '/login';
  }

  // Official authenticated route specified in specifications
  return '/dashboard';
}

export default getDashboardRouteByRole;
