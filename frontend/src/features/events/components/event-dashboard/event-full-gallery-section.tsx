import { useMemo, useState } from 'react';

import { EventImageViewer } from '@/features/events/components/event-dashboard/event-image-viewer';
import { HeartIcon } from '@/features/events/components/event-dashboard/event-icons';
import { getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import type { Photo } from '@/types/photo';

interface EventFullGallerySectionProps {
  photos: Photo[];
  favorites: string[];
  onToggleFavorite: (photoId: string) => void;
}

export function EventFullGallerySection({ photos, favorites, onToggleFavorite }: EventFullGallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const viewerImages = useMemo(
    () =>
      photos.map((photo) => ({
        id: photo.id,
        src: getPhotoSrc(photo.downloadUrl || ''),
        alt: 'Foto do evento',
        title: photo.guestName || 'Memória enviada por convidado',
      })),
    [photos],
  );

  return (
    <section className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#161314]">Galeria completa</h2>

          <p className="mt-3 text-sm leading-7 text-[#2c2927]/65">
            Todas as fotos enviadas pelos convidados ficam aqui, prontas para abrir e baixar.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-bold text-[#c5922e]">
          {photos.length} fotos
        </span>
      </div>

      {photos.length === 0 ? (
        <div className="mt-6 rounded-[18px] bg-[#fff7f2] p-6 text-sm leading-7 text-[#2c2927]/62">
          Ainda não existem fotos neste evento.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            {photos.map((photo, index) => {
              const isFavorite = favorites.includes(photo.id);
              const photoSrc = getPhotoSrc(photo.downloadUrl || '');

              return (
                <div key={photo.id} className="group overflow-hidden rounded-[18px] border border-[#f2dfd4] bg-[#fffaf7]">
                  <div className="relative aspect-square overflow-hidden bg-[#f5ded2]">
                    <button
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className="h-full w-full"
                    >
                    <img
                      src={photoSrc}
                      alt="Foto do evento"
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(photo.id);
                      }}
                      className={[
                        'absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/92 text-sm shadow-[0_8px_20px_rgba(24,24,27,0.12)] transition hover:scale-105',
                        isFavorite ? 'text-[#ef7885]' : 'text-[#2c2927]/46',
                      ].join(' ')}
                      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <HeartIcon className="size-4" filled={isFavorite} />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className="inline-flex h-10 items-center justify-center rounded-[12px] bg-white px-4 text-xs font-bold text-[#201914] transition hover:bg-[#fff1f2]"
                      >
                        Abrir
                      </button>

                      <a
                        href={photoSrc}
                        download
                        className="inline-flex h-10 items-center justify-center rounded-[12px] bg-[#ef7885] px-4 text-xs font-bold text-white transition hover:bg-[#e86d7b]"
                      >
                        Baixar
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <EventImageViewer
            images={viewerImages}
            open={selectedIndex !== null}
            currentIndex={selectedIndex ?? 0}
            onClose={() => setSelectedIndex(null)}
            onChangeIndex={setSelectedIndex}
            renderHeaderAction={(image) => {
              const isFavorite = favorites.includes(image.id);

              return (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(image.id)}
                  className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#efb6bb] bg-[#fff7f7] px-4 text-sm font-bold text-[#ef7885] transition hover:-translate-y-0.5"
                  aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <HeartIcon className="size-4" filled={isFavorite} />
                  {isFavorite ? 'Favorita' : 'Favoritar'}
                </button>
              );
            }}
          />
        </>
      )}
    </section>
  );
}
