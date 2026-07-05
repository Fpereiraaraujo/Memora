import { Link } from 'react-router-dom';

import { buildEventFavoritesPath } from '@/features/events/utils/event-routes';

interface EventDownloadsCardProps {
  eventId: string;
  photosCount: number;
  favoritesCount: number;
  galleryPath: string;
}

export function EventDownloadsCard({ eventId, photosCount, favoritesCount, galleryPath }: EventDownloadsCardProps) {
  return (
    <section
      id="downloads"
      className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#161314]">Downloads</h2>

          <p className="mt-3 text-sm leading-7 text-[#2c2927]/65">
            Baixe as fotos recebidas ou salve apenas as favoritas marcadas por você.
          </p>
        </div>

        <span className="rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-bold text-[#c5922e]">
          {photosCount} fotos
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          to={galleryPath}
          className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
        >
          Abrir galeria
        </Link>

        <Link
          to={buildEventFavoritesPath(eventId)}
          className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#efb6bb] bg-white px-5 text-sm font-bold text-[#201914] transition hover:-translate-y-0.5 hover:bg-[#fff7f7]"
        >
          Ver favoritas
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[18px] bg-[#fff7f2] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c5922e]">Total</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#161314]">{photosCount}</p>
          <p className="mt-1 text-xs font-semibold text-[#2c2927]/52">fotos disponíveis</p>
        </div>

        <div className="rounded-[18px] bg-[#fff1f2] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ef7885]">Favoritas</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#161314]">{favoritesCount}</p>
          <p className="mt-1 text-xs font-semibold text-[#2c2927]/52">fotos curtidas</p>
        </div>
      </div>
    </section>
  );
}
