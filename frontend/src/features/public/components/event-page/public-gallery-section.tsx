import { useCallback, useMemo, useState } from 'react';

import { getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import { PublicImageViewer } from '@/features/public/components/event-page/public-image-viewer';
import type { Photo } from '@/types/photo';

interface PublicGallerySectionProps {
  photos: Photo[];
  allLoadedPhotos: Photo[];
  topLikedPhotos: Photo[];
  likedPhotoIds: string[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onLikeToggle: (photo: Photo) => void;
  onPrefetchMore: () => void;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 20.4 4.9 13.8a4.8 4.8 0 0 1-.1-6.9 4.9 4.9 0 0 1 7-.1l.2.2.2-.2a4.9 4.9 0 0 1 7 .1 4.8 4.8 0 0 1-.1 6.9L12 20.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PublicGallerySection({
  photos,
  allLoadedPhotos,
  topLikedPhotos,
  likedPhotoIds,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onLikeToggle,
  onPrefetchMore,
}: PublicGallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getPhotoUrl = useCallback((photo: Photo) => {
    if (!photo.downloadUrl) {
      return '';
    }

    return getPhotoSrc(photo.downloadUrl);
  }, []);

  const viewerOpen = selectedIndex !== null && Boolean(allLoadedPhotos[selectedIndex]);
  const topTenPhotos = useMemo(
    () => topLikedPhotos.filter((photo) => Boolean(photo.downloadUrl) && photo.likesCount > 0).slice(0, 10),
    [topLikedPhotos],
  );

  return (
    <section
      id="galeria"
      className="rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_22px_60px_rgba(96,60,36,0.07)] sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#ef7885]">Galeria publica</p>

          <h2 className="mt-2 font-display text-[38px] font-semibold leading-none tracking-[-0.045em] text-[#161314] sm:text-[44px]">
            Fotos compartilhadas
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#2c2927]/62">
            Toque em uma foto para abrir em tela cheia, curtir e continuar navegando sem ficar preso apenas na pagina atual.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-bold text-[#c5922e]">
          {totalElements} fotos
        </span>
      </div>

      {topTenPhotos.length > 0 ? (
        <div className="mt-6 rounded-[22px] border border-[#f1ddd1] bg-[#fffaf7] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">Top 10</p>
              <p className="mt-1 text-sm font-bold text-[#161314]">Fotos mais curtidas pelos convidados</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {topTenPhotos.map((photo, index) => {
              const photoUrl = getPhotoUrl(photo);
              const isLiked = likedPhotoIds.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-[18px] bg-[#f5ded2] text-left shadow-[0_12px_28px_rgba(96,60,36,0.07)]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const photoIndex = allLoadedPhotos.findIndex((currentPhoto) => currentPhoto.id === photo.id);
                      if (photoIndex >= 0) {
                        setSelectedIndex(photoIndex);
                      }
                    }}
                    className="h-full w-full"
                    aria-label={`Abrir foto mais curtida ${index + 1}`}
                  >
                    <img
                      src={photoUrl}
                      alt={photo.guestName || `Foto ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </button>

                  <div className="absolute left-2 top-2 rounded-full bg-white/92 px-2 py-1 text-[11px] font-black text-[#c5922e] shadow-[0_8px_20px_rgba(24,24,27,0.12)]">
                    #{index + 1}
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onLikeToggle(photo);
                    }}
                    className={[
                      'absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold shadow-[0_8px_20px_rgba(24,24,27,0.12)]',
                      isLiked ? 'bg-[#ef7885] text-white' : 'bg-white/92 text-[#ef7885]',
                    ].join(' ')}
                    aria-label={isLiked ? 'Remover curtida' : 'Curtir foto'}
                  >
                    <HeartIcon filled={isLiked} />
                    {photo.likesCount}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {photos.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-dashed border-[#efcfc4] bg-[#fffaf7] p-8 text-center">
          <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#161314]">
            Ainda nao existem fotos neste evento.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#2c2927]/62">
            Seja a primeira pessoa a compartilhar uma lembranca deste momento.
          </p>

          <a
            href="#upload"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.2)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b] active:scale-[0.98]"
          >
            Enviar fotos
          </a>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => {
              const photoUrl = getPhotoUrl(photo);
              const isLiked = likedPhotoIds.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-[18px] bg-[#f5ded2] text-left shadow-[0_12px_28px_rgba(96,60,36,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(96,60,36,0.13)]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const photoIndex = allLoadedPhotos.findIndex((currentPhoto) => currentPhoto.id === photo.id);
                      setSelectedIndex(photoIndex >= 0 ? photoIndex : index);
                    }}
                    className="h-full w-full"
                    aria-label={`Abrir foto ${index + 1}`}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={photo.guestName || 'Foto do evento'}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[#fff7f2] text-xs font-bold text-[#2c2927]/48">
                        Foto indisponivel
                      </div>
                    )}
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent opacity-60 transition group-hover:opacity-100" />

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onLikeToggle(photo);
                    }}
                    className={[
                      'absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold shadow-[0_8px_20px_rgba(24,24,27,0.12)]',
                      isLiked ? 'bg-[#ef7885] text-white' : 'bg-white/92 text-[#ef7885]',
                    ].join(' ')}
                    aria-label={isLiked ? 'Remover curtida da foto' : 'Curtir foto'}
                  >
                    <HeartIcon filled={isLiked} />
                    {photo.likesCount}
                  </button>
                </div>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <div className="mt-7 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm font-semibold text-[#2c2927]/58">
                Pagina {currentPage} de {totalPages}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setSelectedIndex(null);
                    onPageChange(currentPage - 1);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#e8cfc1] bg-white px-5 text-sm font-bold text-[#201914] transition hover:bg-[#fff7f2] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Anterior
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setSelectedIndex(null);
                    onPageChange(currentPage + 1);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white transition hover:bg-[#e86d7b] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Proxima
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <PublicImageViewer
        photos={allLoadedPhotos}
        currentIndex={selectedIndex ?? 0}
        open={viewerOpen}
        likedPhotoIds={likedPhotoIds}
        onClose={() => setSelectedIndex(null)}
        onChangeIndex={setSelectedIndex}
        onToggleLike={onLikeToggle}
        onPrefetchMore={onPrefetchMore}
        getPhotoUrl={getPhotoUrl}
      />
    </section>
  );
}
