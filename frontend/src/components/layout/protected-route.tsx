import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, token } = useAuth();

  if (!ready) {
    return <div className="min-h-screen bg-ink-950" />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
