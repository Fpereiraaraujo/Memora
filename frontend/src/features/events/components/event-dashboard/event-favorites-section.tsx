import { HeartIcon } from '@/features/events/components/event-dashboard/event-icons';
import { getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import type { Photo } from '@/types/photo';

interface EventFavoritesSectionProps {
  photos: Photo[];
  onToggleFavorite: (photoId: string) => void;
}

export function EventFavoritesSection({ photos, onToggleFavorite }: EventFavoritesSectionProps) {
  return (
    <section
      id="favoritas"
      className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#161314]">Favoritas</h2>

          <p className="mt-3 text-sm leading-7 text-[#2c2927]/65">
            Fotos curtidas por você. Use essa área para separar as melhores memórias do evento.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#fff1f2] px-4 py-2 text-xs font-bold text-[#ef7885]">
          {photos.length} favoritas
        </span>
      </div>

      {photos.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {photos.map((photo) => {
            const photoSrc = getPhotoSrc(photo.downloadUrl);

            return (
              <div key={photo.id} className="group overflow-hidden rounded-[18px] border border-[#f2dfd4] bg-[#fffaf7]">
                <a href={photoSrc} target="_blank" rel="noreferrer" className="relative block aspect-square overflow-hidden bg-[#f5ded2]">
                  <img
                    src={photoSrc}
                    alt={photo.originalFilename}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/92 text-sm text-[#ef7885] shadow-[0_8px_20px_rgba(24,24,27,0.12)]">
                    <HeartIcon className="size-4" filled />
                  </span>
                </a>

                <div className="p-4">
                  <p className="truncate text-sm font-bold text-[#161314]">{photo.guestName || 'Convidado anônimo'}</p>

                  <p className="mt-1 truncate text-xs text-[#2c2927]/52">{photo.originalFilename}</p>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(photo.id)}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-[12px] border border-[#efb6bb] bg-white px-4 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
                  >
                    Remover favorita
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-[18px] bg-[#fff7f2] p-6 text-sm leading-7 text-[#2c2927]/62">
          Você ainda não curtiu nenhuma foto. Clique no coração das imagens da galeria para marcar suas favoritas.
        </div>
      )}
    </section>
  );
}
