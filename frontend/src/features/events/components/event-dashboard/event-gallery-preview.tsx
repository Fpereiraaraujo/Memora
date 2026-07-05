import { Link } from 'react-router-dom';

import { HeartIcon } from '@/features/events/components/event-dashboard/event-icons';
import { getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import type { Photo } from '@/types/photo';

interface EventGalleryPreviewProps {
  photos: Photo[];
  favorites: string[];
  galleryPath: string;
  onToggleFavorite: (photoId: string) => void;
}

export function EventGalleryPreview({ photos, favorites, galleryPath, onToggleFavorite }: EventGalleryPreviewProps) {
  return (
    <section
      id="galeria"
      className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-[#161314]">Galeria do evento</h2>

        <Link to={galleryPath} className="text-sm font-bold text-[#ef7885] transition hover:text-[#e86d7b]">
          Ver todas
        </Link>
      </div>

      {photos.length === 0 ? (
        <div className="mt-6 rounded-[18px] bg-[#fff7f2] p-5 text-sm leading-7 text-[#2c2927]/62">
          Nenhuma foto enviada ainda.
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {photos.map((photo) => {
              const isFavorite = favorites.includes(photo.id);

              return (
                <div key={photo.id} className="group relative aspect-[1.08/1] overflow-hidden rounded-[16px] bg-[#f5ded2]">
                  <img
                    src={getPhotoSrc(photo.downloadUrl)}
                    alt={photo.originalFilename}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(photo.id)}
                    className={[
                      'absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/92 text-sm shadow-[0_8px_20px_rgba(24,24,27,0.12)] transition hover:scale-105',
                      isFavorite ? 'text-[#ef7885]' : 'text-[#2c2927]/46',
                    ].join(' ')}
                    aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <HeartIcon className="size-4" filled={isFavorite} />
                  </button>
                </div>
              );
            })}
          </div>

          <Link
            to={galleryPath}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[14px] border border-[#efb6bb] bg-white px-5 text-sm font-bold text-[#ef7885] transition hover:-translate-y-0.5 hover:bg-[#fff7f7]"
          >
            Ver todas as fotos
          </Link>
        </>
      )}
    </section>
  );
}
