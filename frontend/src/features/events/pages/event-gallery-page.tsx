import { Link, useParams } from 'react-router-dom';

import { EmptyState } from '@/components/ui/empty-state';
import { EventDashboardShell } from '@/features/events/components/event-dashboard/event-dashboard-shell';
import { EventFullGallerySection } from '@/features/events/components/event-dashboard/event-full-gallery-section';
import { EventLoadingState } from '@/features/events/components/event-dashboard/event-loading-state';
import { EventSidebar } from '@/features/events/components/event-dashboard/event-sidebar';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';

function GalleryNotFoundState() {
  return (
    <div className="min-h-screen bg-[#fff8f3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <EmptyState
          title="Galeria não encontrada"
          description="Não foi possível encontrar a galeria deste evento."
        />
      </div>
    </div>
  );
}

export function EventGalleryPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);

  if (!eventId) {
    return <GalleryNotFoundState />;
  }

  if (dashboard.loading) {
    return <EventLoadingState />;
  }

  if (!dashboard.event) {
    return <GalleryNotFoundState />;
  }

  return (
    <EventDashboardShell
      sidebar={
        <EventSidebar
          event={dashboard.event}
          copied={dashboard.copied}
          onCopyPublicLink={dashboard.copyPublicLink}
        />
      }
    >
      <section className="rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to={`/app/events/${dashboard.event.id}`}
              className="mb-5 inline-flex h-11 items-center justify-center rounded-[14px] border border-[#e8cfc1] bg-white px-5 text-sm font-bold text-[#201914] transition hover:bg-[#fff7f2]"
            >
              ← Voltar ao painel
            </Link>

            <p className="text-[15px] font-bold text-[#ef7885]">Galeria completa</p>

            <h1 className="mt-2 font-display text-[44px] font-semibold leading-none tracking-[-0.045em] text-[#161314] md:text-[52px]">
              Todas as fotos
            </h1>

            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#2c2927]/62">
              Todas as fotos enviadas pelos convidados ficam aqui, prontas para abrir, favoritar e baixar.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#fff3e6] px-5 py-2.5 text-sm font-bold text-[#c5922e]">
            {dashboard.photos.length} fotos
          </span>
        </div>
      </section>

      <EventFullGallerySection
        photos={dashboard.photos}
        favorites={dashboard.favorites}
        onToggleFavorite={dashboard.toggleFavorite}
      />
    </EventDashboardShell>
  );
}
