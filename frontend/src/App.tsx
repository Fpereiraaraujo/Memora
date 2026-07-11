import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { AdminRoute } from '@/components/layout/admin-route';
import { PublicShell } from '@/components/layout/public-shell';
import { Card } from '@/components/ui/card';
import { AuthProvider, useAuth } from '@/features/auth/auth-context';
import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { EventDetailPage } from '@/features/events/pages/event-detail-page';
import { EventDownloadsPage } from '@/features/events/pages/event-downloads-page';
import { EventFavoritesPage } from '@/features/events/pages/event-favorites-page';
import { EventGalleryPage } from '@/features/events/pages/event-gallery-page';
import { EventCheckoutPage } from '@/features/events/pages/event-checkout-page';
import { EventMessagesPage } from '@/features/events/pages/event-messages-page';
import { EventQrCodePage } from '@/features/events/pages/event-qrcode-page';
import { EventPublicPageSettingsPage } from '@/features/events/pages/event-public-page-settings-page';
import { EventInvitationPage } from '@/features/events/pages/event-invitation-page';
import { invitationFeatureEnabled } from '@/features/events/utils/event-feature-toggles';
import { HomePage } from '@/features/home/pages/home-page';
import { PublicEventPage } from '@/features/public/pages/public-event-page';
import { PublicInvitationPage } from '@/features/public/pages/public-invitation-page';
import { AdminDashboardPage } from '@/features/admin/pages/admin-dashboard-page';

function RootRedirect() {
  const { token, ready, user } = useAuth();

  if (!ready) {
    return null;
  }

  return <Navigate to={token ? (user?.role === 'ADMIN' ? '/admin' : '/app') : '/login'} replace />;
}


function PublicUploadRedirect() {
  const { slug } = useParams();

  return <Navigate to={{ pathname: `/e/${slug ?? ''}`, hash: '#upload' }} replace />;
}

function LegacyEventRedirect() {
  const { eventId } = useParams();
  return <Navigate to={`/app/events/${eventId ?? ''}`} replace />;
}

function LegacyEventPublicPageRedirect() {
  const { eventId } = useParams();
  return <Navigate to={`/app/events/${eventId ?? ''}/public-page`} replace />;
}

function EventInvitationStandbyRedirect() {
  const { eventId } = useParams();
  return <Navigate to={`/app/events/${eventId ?? ''}`} replace />;
}

function NotFoundPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="space-y-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#b9852f]">404</p>

          <h1 className="font-display text-5xl font-semibold tracking-[-0.04em] text-ink-900">
            Página não encontrada
          </h1>

          <p className="mx-auto max-w-xl text-sm leading-7 text-ink-800/72">
            O caminho acessado não existe. Volte para a página inicial ou entre na sua conta para gerenciar seus eventos.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-2xl bg-[#ef7885] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
              to="/"
            >
              Voltar para início
            </Link>

            <Link
              className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white/75 px-6 py-3 text-sm font-bold text-ink-900 shadow-[0_18px_40px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
              to="/login"
            >
              Entrar
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
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin"
          element={<AdminRoute><AdminDashboardPage /></AdminRoute>}
        />

        <Route
          path="/admin/access-denied"
          element={<AdminDashboardPage accessDenied />}
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/events/:eventId/checkout"
          element={
            <ProtectedRoute>
              <EventCheckoutPage />
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

        <Route
          path="/app/event/:eventId"
          element={
            <ProtectedRoute>
              <LegacyEventRedirect />
            </ProtectedRoute>
          }
        />


        <Route
          path="/app/events/:eventId/public-page"
          element={
            <ProtectedRoute>
              <EventPublicPageSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/events/:eventId/invitation"
          element={
            <ProtectedRoute>
              {invitationFeatureEnabled ? <EventInvitationPage /> : <EventInvitationStandbyRedirect />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/event/:eventId/public-page"
          element={
            <ProtectedRoute>
              <LegacyEventPublicPageRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/events/:eventId/gallery"
          element={
            <ProtectedRoute>
              <EventGalleryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/events/:eventId/qrcode"
          element={
            <ProtectedRoute>
              <EventQrCodePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/events/:eventId/favorites"
          element={
            <ProtectedRoute>
              <EventFavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/events/:eventId/downloads"
          element={
            <ProtectedRoute>
              <EventDownloadsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/events/:eventId/messages"
          element={
            <ProtectedRoute>
              <EventMessagesPage />
            </ProtectedRoute>
          }
        />

        <Route path="/e/:slug/upload" element={<PublicUploadRedirect />} />
        <Route path="/i/:token" element={<PublicInvitationPage />} />
        <Route path="/e/:slug" element={<PublicEventPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
