import { Link } from 'react-router-dom';

import { CalendarIcon, ExternalIcon, ShareIcon } from '@/features/events/components/event-dashboard/event-icons';
import { formatEventDate } from '@/features/events/utils/event-dashboard-formatters';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

interface EventHeaderProps {
  event: EventSummary;
  photos: Photo[];
  mockMode: boolean;
  onShareEvent: () => void;
}

export function EventHeader({ event, photos, mockMode, onShareEvent }: EventHeaderProps) {
  const firstPhotoDate = photos[0]?.createdAt
    ? new Date(photos[0].createdAt).toLocaleDateString('pt-BR')
    : formatEventDate(event.eventDate);

  return (
    <section className="rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-[#ef7885]">
            Bem-vindos de volta, {event.title}!
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <h1 className="font-display text-[44px] font-semibold leading-none tracking-[-0.045em] text-[#161314] md:text-[52px]">
              Casamento {event.title}
            </h1>

            <span className="inline-flex h-9 items-center rounded-full bg-[#fff3e6] px-5 text-sm font-bold text-[#c5922e]">
              Evento ativo
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-medium text-[#2c2927]/62">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="size-[18px]" />
              {formatEventDate(event.eventDate)}
            </span>

            <span>•</span>

            <span>Recebendo fotos desde {firstPhotoDate}</span>

            {mockMode ? (
              <>
                <span>•</span>
                <span className="font-bold text-[#c5922e]">modo demonstração</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/e/${event.slug}`}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-[14px] border border-[#d6a45a] bg-white px-6 text-sm font-bold text-[#b57b26] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5"
          >
            Ver página pública
            <ExternalIcon className="size-4" />
          </Link>

          <button
            type="button"
            onClick={onShareEvent}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.26)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
          >
            <ShareIcon className="size-4" />
            Compartilhar evento
          </button>
        </div>
      </div>
    </section>
  );
}
