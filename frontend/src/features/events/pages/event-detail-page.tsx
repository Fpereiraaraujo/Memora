import { useParams } from 'react-router-dom';

import { EventDownloadsCard } from '@/features/events/components/event-dashboard/event-downloads-card';
import { EventFavoritesSection } from '@/features/events/components/event-dashboard/event-favorites-section';
import { EventGalleryPreview } from '@/features/events/components/event-dashboard/event-gallery-preview';
import { EventHeader } from '@/features/events/components/event-dashboard/event-header';
import { EventMessagesCard } from '@/features/events/components/event-dashboard/event-messages-card';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { EventPublicPageCard } from '@/features/events/components/event-dashboard/event-public-page-card';
import { EventQrCard } from '@/features/events/components/event-dashboard/event-qr-card';
import { EventStatsSection } from '@/features/events/components/event-dashboard/event-stats-section';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import {
  buildEventGalleryPath,
  buildEventMessagesPath,
} from '@/features/events/utils/event-routes';

export function EventDetailPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);

  const galleryPath = dashboard.event ? buildEventGalleryPath(dashboard.event.id) : '';
  const messagesPath = dashboard.event ? buildEventMessagesPath(dashboard.event.id) : '';

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Evento não encontrado"
      emptyDescription="Não foi possível encontrar o evento solicitado."
    >
      {dashboard.event ? (
        <>
          <EventHeader
            event={dashboard.event}
            photos={dashboard.photos}
            mockMode={dashboard.mockMode}
            onShareEvent={dashboard.shareEvent}
            publicLinksEnabled={dashboard.publicLinksEnabled}
          />

          <EventPublicPageCard
            event={dashboard.event}
            publicLinksEnabled={dashboard.publicLinksEnabled}
          />

          <EventStatsSection
            photosCount={dashboard.mediaPhotos.length}
            guestCount={dashboard.guestCount}
            favoritesCount={dashboard.favoritePhotos.length}
          />

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.15fr_0.95fr]">
            <EventQrCard
              qrPreviewUrl={dashboard.qrPreviewUrl}
              copied={dashboard.uploadLinkCopied}
              eventStatus={dashboard.event.status}
              onCopyUploadLink={dashboard.copyUploadLink}
            />

            <EventGalleryPreview
              photos={dashboard.galleryPreview}
              favorites={dashboard.favorites}
              galleryPath={galleryPath}
              onToggleFavorite={dashboard.toggleFavorite}
            />

            <EventMessagesCard
              messages={dashboard.messages}
              messagesPath={messagesPath}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr]">
            <EventDownloadsCard
              eventId={dashboard.event.id}
              photosCount={dashboard.mediaPhotos.length}
              favoritesCount={dashboard.favoritePhotos.length}
              galleryPath={galleryPath}
            />
          </section>

          <EventFavoritesSection
            photos={dashboard.favoritePhotos}
            onToggleFavorite={dashboard.toggleFavorite}
          />
        </>
      ) : null}
    </EventPageLayout>
  );
}
