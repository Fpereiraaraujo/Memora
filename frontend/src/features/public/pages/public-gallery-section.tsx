import { useCallback, useState } from 'react';

import { getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import type { Photo } from '@/types/photo';
import { PublicImageViewer } from './public-image-viewer';

interface PublicGallerySectionProps {
  photos: Photo[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export function PublicGallerySection({
  photos,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: PublicGallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getPhotoUrl = useCallback((photo: Photo) => getPhotoSrc(photo.downloadUrl ?? ''), []);

  const viewerOpen = selectedIndex !== null && photos[selectedIndex];

  return (
    <section
      id="galeria"
      className="rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_22px_60px_rgba(96,60,36,0.07)] sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#ef7885]">
            Galeria pública
          </p>

          <h2 className="mt-2 font-display text-[38px] font-semibold leading-none tracking-[-0.045em] text-[#161314] sm:text-[44px]">
            Fotos compartilhadas
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#2c2927]/62">
            Toque em uma foto para abrir em tela cheia e navegar entre as lembranças do evento.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-bold text-[#c5922e]">
          {totalElements} fotos
        </span>
      </div>

      {photos.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-dashed border-[#efcfc4] bg-[#fffaf7] p-8 text-center">
          <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#161314]">
            Ainda não existem fotos neste evento.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#2c2927]/62">
            Seja a primeira pessoa a compartilhar uma lembrança deste momento.
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
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="group relative aspect-square overflow-hidden rounded-[18px] bg-[#f5ded2] text-left shadow-[0_12px_28px_rgba(96,60,36,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(96,60,36,0.13)] active:scale-[0.99]"
                aria-label={`Abrir foto ${index + 1}`}
              >
                <img
                  src={getPhotoUrl(photo)}
                  alt={photo.originalFilename ?? 'Foto do evento'}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="absolute bottom-2 left-2 right-2 translate-y-2 rounded-[12px] bg-white/90 px-3 py-2 opacity-0 shadow-[0_10px_24px_rgba(24,24,27,0.14)] backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="truncate text-xs font-bold text-[#161314]">
                    Ver foto em tela cheia
                  </p>
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-7 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm font-semibold text-[#2c2927]/58">
                Página {currentPage} de {totalPages}
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
                  Próxima
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <PublicImageViewer
        photos={photos}
        currentIndex={selectedIndex ?? 0}
        open={Boolean(viewerOpen)}
        onClose={() => setSelectedIndex(null)}
        onChangeIndex={setSelectedIndex}
        getPhotoUrl={getPhotoUrl}
      />
    </section>
  );
}