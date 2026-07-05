import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Pagination } from '@/components/ui/pagination';
import { EventPageHero } from '@/features/events/components/event-dashboard/event-page-hero';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import {
  buildEventFavoritesPath,
  buildEventGalleryPath,
} from '@/features/events/utils/event-routes';
import { formatRelativeTime, getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';

const DOWNLOADS_PER_PAGE = 6;

export function EventDownloadsPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(dashboard.photos.length / DOWNLOADS_PER_PAGE));

  const visiblePhotos = useMemo(() => {
    const start = (currentPage - 1) * DOWNLOADS_PER_PAGE;
    return dashboard.photos.slice(start, start + DOWNLOADS_PER_PAGE);
  }, [currentPage, dashboard.photos]);

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Downloads indisponíveis"
      emptyDescription="Não foi possível carregar os downloads deste evento."
    >
      {dashboard.event ? (
        <>
          <EventPageHero
            eyebrow="Downloads"
            title="Baixe e organize suas memórias"
            description="Acesse todas as fotos recebidas e use as favoritas como um atalho para separar os arquivos mais importantes."
            badge={`${dashboard.photos.length} arquivos`}
            actions={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={buildEventGalleryPath(dashboard.event.id)}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
                >
                  Abrir galeria
                </Link>

                <Link
                  to={buildEventFavoritesPath(dashboard.event.id)}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#ead6cb] bg-white px-5 text-sm font-bold text-[#201914] transition hover:bg-[#fff8f3]"
                >
                  Ver favoritas
                </Link>
              </div>
            }
          />

          <section className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
            <section className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
              <h2 className="text-xl font-black text-[#161314]">Resumo rápido</h2>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[18px] bg-[#fff7f2] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c5922e]">Fotos totais</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#161314]">{dashboard.photos.length}</p>
                  <p className="mt-1 text-sm text-[#2c2927]/58">Arquivos prontos para abrir ou baixar manualmente.</p>
                </div>

                <div className="rounded-[18px] bg-[#fff1f2] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ef7885]">Favoritas</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#161314]">{dashboard.favoritePhotos.length}</p>
                  <p className="mt-1 text-sm text-[#2c2927]/58">Imagens já separadas para revisão rápida.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-[#161314]">Arquivos recentes</h2>
                <span className="rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-bold text-[#c5922e]">
                  Página {currentPage} de {totalPages}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {visiblePhotos.map((photo) => (
                  <a
                    key={photo.id}
                    href={getPhotoSrc(photo.downloadUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col gap-4 rounded-[18px] border border-[#f2dfd4] bg-[#fffaf7] p-4 transition hover:-translate-y-0.5 hover:bg-white sm:flex-row sm:items-center"
                  >
                    <img
                      src={getPhotoSrc(photo.downloadUrl)}
                      alt={photo.originalFilename}
                      className="h-24 w-full rounded-[16px] object-cover sm:w-28"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#161314]">{photo.originalFilename}</p>
                      <p className="mt-1 text-sm text-[#2c2927]/58">{photo.guestName || 'Convidado anônimo'}</p>
                      <p className="mt-2 text-xs text-[#2c2927]/46">{formatRelativeTime(photo.createdAt)}</p>
                    </div>

                    <span className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#ead6cb] bg-white px-5 text-sm font-bold text-[#201914]">
                      Abrir arquivo
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </section>

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
