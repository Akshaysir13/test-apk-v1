// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route but user is not admin
  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}