import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Pagination } from '@/components/ui/pagination';
import { EventFavoritesSection } from '@/features/events/components/event-dashboard/event-favorites-section';
import { EventFeatureLockCard } from '@/features/events/components/event-dashboard/event-feature-lock-card';
import { EventPageHeader } from '@/features/events/components/event-dashboard/event-page-header';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import { canUseFavorites } from '@/features/events/utils/event-plan-features';

const FAVORITES_PER_PAGE = 8;

export function EventFavoritesPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);
  const [currentPage, setCurrentPage] = useState(1);
  const favoritesEnabled = canUseFavorites(dashboard.event);

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
        favoritesEnabled ? (
          <>
            <EventPageHeader
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
        ) : (
          <EventFeatureLockCard
            eventId={dashboard.event.id}
            requiredPlanLabel="Evento"
            eyebrow="Favoritas premium"
            title="Ative suas favoritas"
            description="Esse espaço fica disponível a partir do plano Evento para você destacar as melhores fotos do casamento."
          />
        )
      ) : null}
    </EventPageLayout>
  );
}
