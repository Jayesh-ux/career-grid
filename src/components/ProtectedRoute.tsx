/**
 * Protected route wrapper (HOC) for auth checks.
 * Redirects to /login if not authenticated.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Component {...rest} />;
};
