import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';
import { Loading } from './ui';
import { ROUTES } from '../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang xác thực..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    // Redirect to home page if user is not admin
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
