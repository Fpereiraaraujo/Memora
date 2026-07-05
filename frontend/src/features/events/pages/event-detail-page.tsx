import { useParams } from 'react-router-dom';

import { EmptyState } from '@/components/ui/empty-state';
import { EventDashboardShell } from '@/features/events/components/event-dashboard/event-dashboard-shell';
import { EventDownloadsCard } from '@/features/events/components/event-dashboard/event-downloads-card';
import { EventFavoritesSection } from '@/features/events/components/event-dashboard/event-favorites-section';
import { EventGalleryPreview } from '@/features/events/components/event-dashboard/event-gallery-preview';
import { EventHeader } from '@/features/events/components/event-dashboard/event-header';
import { EventLoadingState } from '@/features/events/components/event-dashboard/event-loading-state';
import { EventMessagesCard } from '@/features/events/components/event-dashboard/event-messages-card';
import { EventPublicPageCard } from '@/features/events/components/event-dashboard/event-public-page-card';
import { EventQrCard } from '@/features/events/components/event-dashboard/event-qr-card';
import { EventSidebar } from '@/features/events/components/event-dashboard/event-sidebar';
import { EventStatsSection } from '@/features/events/components/event-dashboard/event-stats-section';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';

function EventNotFoundState() {
  return (
    <div className="min-h-screen bg-[#fff8f3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <EmptyState
          title="Evento não encontrado"
          description="Não foi possível encontrar o evento solicitado."
        />
      </div>
    </div>
  );
}

export function EventDetailPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);

  if (!eventId) {
    return <EventNotFoundState />;
  }

  if (dashboard.loading) {
    return <EventLoadingState />;
  }

  if (!dashboard.event) {
    return <EventNotFoundState />;
  }

  const galleryPath = `/app/events/${dashboard.event.id}/gallery`;

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
      <EventHeader
        event={dashboard.event}
        photos={dashboard.photos}
        mockMode={dashboard.mockMode}
        onShareEvent={dashboard.shareEvent}
      />

      <EventStatsSection
        photosCount={dashboard.photos.length}
        guestCount={dashboard.guestCount}
        favoritesCount={dashboard.favoritePhotos.length}
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.15fr_0.95fr]">
        <EventQrCard
          qrPreviewUrl={dashboard.qrPreviewUrl}
          copied={dashboard.copied}
          onCopyPublicLink={dashboard.copyPublicLink}
        />

        <EventGalleryPreview
          photos={dashboard.galleryPreview}
          favorites={dashboard.favorites}
          galleryPath={galleryPath}
          onToggleFavorite={dashboard.toggleFavorite}
        />

        <EventMessagesCard messages={dashboard.messagePhotos} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <EventPublicPageCard event={dashboard.event} />

        <EventDownloadsCard
          photosCount={dashboard.photos.length}
          favoritesCount={dashboard.favoritePhotos.length}
          galleryPath={galleryPath}
        />
      </section>

      <EventFavoritesSection
        photos={dashboard.favoritePhotos}
        onToggleFavorite={dashboard.toggleFavorite}
      />
    </EventDashboardShell>
  );
}
