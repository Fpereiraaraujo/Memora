import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/auth-context';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { ready, token, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="min-h-screen bg-[#fff8f3]" />;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return children;
}
