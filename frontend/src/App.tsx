import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/auth-context';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { EventDetailPage } from '@/features/events/pages/event-detail-page';
import { PublicEventPage } from '@/features/public/pages/public-event-page';
import { PublicShell } from '@/components/layout/public-shell';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

function RootRoute() {
  const { token, ready } = useAuth();

  if (!ready) {
    return null;
  }

  return <Navigate to={token ? '/app' : '/login'} replace />;
}

function NotFoundPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="space-y-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">404</p>
          <h1 className="font-display text-4xl text-sand-50">Página não encontrada</h1>
          <p className="text-sm leading-6 text-sand-100/70">
            O caminho acessado não existe. Volte para o início e siga o fluxo do evento.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-2xl bg-sand-100 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-sand-200"
              to="/login"
            >
              Entrar
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-2xl bg-white/8 px-4 py-2.5 text-sm font-semibold text-sand-50 transition hover:bg-white/12"
              to="/register"
            >
              Criar conta
            </Link>
          </div>
        </Card>
      </div>
    </PublicShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/events/:eventId"
          element={
            <ProtectedRoute>
              <EventDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/e/:slug" element={<PublicEventPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
