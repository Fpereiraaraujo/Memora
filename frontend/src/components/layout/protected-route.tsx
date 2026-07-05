import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, token } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="min-h-screen bg-ink-950" />;
  }

  if (!token && location.pathname.startsWith('/app')) {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
