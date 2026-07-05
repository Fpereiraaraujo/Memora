import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Pagination } from '@/components/ui/pagination';
import { EventFullGallerySection } from '@/features/events/components/event-dashboard/event-full-gallery-section';
import { EventPageHero } from '@/features/events/components/event-dashboard/event-page-hero';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { useAuth } from '@/features/auth/auth-context';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import { api } from '@/lib/api';
import type { Photo } from '@/types/photo';

const GALLERY_PAGE_SIZE = 12;

export function EventGalleryPage() {
  const { eventId } = useParams();
  const { token } = useAuth();
  const dashboard = useEventDashboard(eventId);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [eventId]);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      if (!eventId) {
        return;
      }

      if (dashboard.mockMode || !token) {
        const start = (currentPage - 1) * GALLERY_PAGE_SIZE;
        const fallbackPhotos = dashboard.photos.slice(start, start + GALLERY_PAGE_SIZE);

        if (active) {
          setVisiblePhotos(fallbackPhotos);
          setTotalElements(dashboard.photos.length);
          setTotalPages(Math.max(1, Math.ceil(dashboard.photos.length / GALLERY_PAGE_SIZE)));
          setPageError(null);
        }

        return;
      }

      try {
        const page = await api.listEventPhotosPage(token, eventId, currentPage - 1, GALLERY_PAGE_SIZE);

        if (active) {
          setVisiblePhotos(page.content);
          setTotalElements(page.totalElements);
          setTotalPages(Math.max(1, page.totalPages));
          setPageError(null);
        }
      } catch (exception) {
        const start = (currentPage - 1) * GALLERY_PAGE_SIZE;
        const fallbackPhotos = dashboard.photos.slice(start, start + GALLERY_PAGE_SIZE);

        if (active) {
          setVisiblePhotos(fallbackPhotos);
          setTotalElements(dashboard.photos.length);
          setTotalPages(Math.max(1, Math.ceil(dashboard.photos.length / GALLERY_PAGE_SIZE)));
          setPageError(exception instanceof Error ? exception.message : 'Não foi possível carregar a galeria paginada.');
        }
      }
    }

    void loadPage();

    return () => {
      active = false;
    };
  }, [currentPage, dashboard.mockMode, dashboard.photos, eventId, token]);

  const hydratedVisiblePhotos = useMemo(() => {
    if (visiblePhotos.length === 0) {
      return visiblePhotos;
    }

    const favoritesById = new Map(dashboard.photos.map((photo) => [photo.id, photo.favorite]));

    return visiblePhotos.map((photo) => ({
      ...photo,
      favorite: favoritesById.get(photo.id) ?? photo.favorite,
    }));
  }, [dashboard.photos, visiblePhotos]);

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Galeria não encontrada"
      emptyDescription="Não foi possível encontrar a galeria deste evento."
    >
      {dashboard.event ? (
        <>
          <EventPageHero
            eyebrow="Galeria completa"
            title="Todas as fotos do evento"
            description="Explore todos os envios dos convidados em uma visualização paginada, pronta para curtir, revisar e compartilhar."
            badge={`${totalElements || dashboard.photos.length} fotos`}
          />

          {pageError ? (
            <div className="rounded-[18px] border border-amber-200 bg-amber-100/80 px-5 py-4 text-sm font-semibold text-amber-700">
              {pageError}
            </div>
          ) : null}

          <EventFullGallerySection
            photos={hydratedVisiblePhotos}
            favorites={dashboard.favorites}
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
