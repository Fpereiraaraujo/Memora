import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Pagination } from '@/components/ui/pagination';
import { EventFavoritesSection } from '@/features/events/components/event-dashboard/event-favorites-section';
import { EventPageHero } from '@/features/events/components/event-dashboard/event-page-hero';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';

const FAVORITES_PER_PAGE = 8;

export function EventFavoritesPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(dashboard.favoritePhotos.length / FAVORITES_PER_PAGE));

  const visibleFavorites = useMemo(() => {
    const start = (currentPage - 1) * FAVORITES_PER_PAGE;
    return dashboard.favoritePhotos.slice(start, start + FAVORITES_PER_PAGE);
  }, [currentPage, dashboard.favoritePhotos]);

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Favoritas não encontradas"
      emptyDescription="Não foi possível carregar as fotos favoritas deste evento."
    >
      {dashboard.event ? (
        <>
          <EventPageHero
            eyebrow="Favoritas"
            title="Suas melhores escolhas"
            description="Centralize aqui as fotos que você mais gostou para revisar com calma, compartilhar e baixar depois."
            badge={`${dashboard.favoritePhotos.length} curtidas`}
          />

          <EventFavoritesSection
            photos={visibleFavorites}
            onToggleFavorite={dashboard.toggleFavorite}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : null}
    </EventPageLayout>
  );
}
