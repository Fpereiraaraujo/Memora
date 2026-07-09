import { Link } from 'react-router-dom';

import { CalendarIcon, ExternalIcon, ShareIcon } from '@/features/events/components/event-dashboard/event-icons';
import { formatEventDate } from '@/features/events/utils/event-dashboard-formatters';
import { buildEventCheckoutPath } from '@/features/events/utils/event-routes';
import type { EventStatus, EventSummary, EventType } from '@/types/event';
import type { Photo } from '@/types/photo';

interface EventHeaderProps {
  event: EventSummary;
  photos: Photo[];
  mockMode: boolean;
  onShareEvent: () => void;
  publicLinksEnabled: boolean;
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  WEDDING: 'Casamento',
  BIRTHDAY: 'Aniversario',
  GRADUATION: 'Formatura',
  BABY_SHOWER: 'Cha de bebe',
  BAPTISM: 'Batizado',
  CORPORATE: 'Corporativo',
  OTHER: 'Evento',
};

const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: 'Rascunho',
  ACTIVE: 'Evento ativo',
  PAUSED: 'Pausado',
  EXPIRED: 'Expirado',
};

function statusClassName(status: EventStatus) {
  if (status === 'ACTIVE') {
    return 'bg-[#eefbf1] text-[#3f8b46]';
  }

  if (status === 'DRAFT') {
    return 'bg-[#fff3e6] text-[#c5922e]';
  }

  return 'bg-[#fff1f2] text-[#ef7885]';
}

export function EventHeader({ event, photos, mockMode, onShareEvent, publicLinksEnabled }: EventHeaderProps) {
  const firstPhotoDate = photos[0]?.createdAt
    ? new Date(photos[0].createdAt).toLocaleDateString('pt-BR')
    : 'aguardando primeiro upload';
  const eventTypeLabel = EVENT_TYPE_LABELS[event.type];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-[#f4a1aa]/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 size-80 rounded-full bg-[#d8a84f]/16 blur-3xl" />

      <div className="relative flex flex-col gap-7 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/75 px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#c5922e] shadow-[0_12px_28px_rgba(96,60,36,0.06)] backdrop-blur">
              <span className="size-2 rounded-full bg-[#ef7885]" />
              Painel do evento
            </span>

            <span className={`inline-flex h-10 items-center rounded-full px-4 text-xs font-bold ${statusClassName(event.status)}`}>
              {EVENT_STATUS_LABELS[event.status]}
            </span>
          </div>

          <p className="text-[15px] font-bold text-[#ef7885]">
            {eventTypeLabel} de {event.title}
          </p>

          <h1 className="mt-2 max-w-4xl font-display text-[46px] font-semibold leading-[0.95] tracking-[-0.055em] text-[#161314] md:text-[64px]">
            O centro das memorias do seu evento
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#2c2927]/70">
            Aqui voce acompanha o evento, copia o link de upload, prepara o QR Code, ve uma previa das fotos, recados e favoritas.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-medium text-[#2c2927]/62">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="size-[18px]" />
              {formatEventDate(event.eventDate)}
            </span>

            <span>•</span>
            <span>{event.location || 'Local a confirmar'}</span>
            <span>•</span>
            <span>Fotos desde {firstPhotoDate}</span>

            {mockMode ? (
              <>
                <span>•</span>
                <span className="font-bold text-[#c5922e]">modo demonstracao</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row xl:flex-col 2xl:flex-row">
          {publicLinksEnabled ? (
            <Link
              to={`/e/${event.slug}`}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-[14px] border border-[#d6a45a] bg-white px-6 text-sm font-bold text-[#b57b26] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5"
            >
              Ver pagina publica
              <ExternalIcon className="size-4" />
            </Link>
          ) : null}

          {event.status === 'DRAFT' ? (
            <Link
              to={buildEventCheckoutPath(event.id)}
              className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#efb6bb] bg-white px-6 text-sm font-bold text-[#ef7885] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5 hover:bg-[#fff7f7]"
            >
              Ver planos
            </Link>
          ) : null}

          <button
            type="button"
            onClick={onShareEvent}
            disabled={!publicLinksEnabled}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.26)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b] disabled:cursor-not-allowed disabled:bg-[#d8c6bd] disabled:shadow-none disabled:hover:translate-y-0"
          >
            <ShareIcon className="size-4" />
            {publicLinksEnabled ? 'Compartilhar evento' : 'Link indisponivel'}
          </button>
        </div>
      </div>
    </section>
  );
}
