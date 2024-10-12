// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

  if (!storedUser && !storedToken) {
    return <Navigate to="/auth" replace />; 
  }

  return <>{children}</>; 
};

