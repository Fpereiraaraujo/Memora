import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { buildEventCheckoutPath, buildEventOverviewPath } from '@/features/events/utils/event-routes';
import type { EventPlanCode, EventStatus, EventSummary, EventType } from '@/types/event';

interface EventCardProps {
  event: EventSummary;
  publicLinksEnabled?: boolean;
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  WEDDING: 'Casamento',
  BIRTHDAY: 'Aniversario',
  GRADUATION: 'Formatura',
  BABY_SHOWER: 'Cha de bebe',
  BAPTISM: 'Batizado',
  CORPORATE: 'Corporativo',
  OTHER: 'Outro evento',
};

const EVENT_PLAN_LABELS: Record<EventPlanCode, string> = {
  ESSENTIAL: 'Essencial',
  EVENT: 'Evento',
  PREMIUM: 'Premium',
};

function formatStatusTone(status: EventStatus) {
  if (status === 'ACTIVE') {
    return 'success';
  }

  if (status === 'DRAFT') {
    return 'warning';
  }

  return 'neutral';
}

function formatStatusLabel(status: EventStatus) {
  const labels: Record<EventStatus, string> = {
    ACTIVE: 'Ativo',
    DRAFT: 'Rascunho',
    PAUSED: 'Pausado',
    EXPIRED: 'Expirado',
  };

  return labels[status];
}

function formatDate(date: string | null) {
  if (!date) {
    return 'Data a confirmar';
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function EventCard({ event, publicLinksEnabled = true }: EventCardProps) {
  const isDraft = event.status === 'DRAFT';
  const canOpenPublicPage = Boolean(event.slug && publicLinksEnabled);

  return (
    <article className="rounded-[2rem] border border-[#f0d8ca] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,243,0.82))] p-5 shadow-[0_18px_46px_rgba(96,60,36,0.06)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#b87955]">
              <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">♡</span>
              {EVENT_TYPE_LABELS[event.type]}
            </span>

            <Badge tone={formatStatusTone(event.status)}>{formatStatusLabel(event.status)}</Badge>
          </div>

          <div>
            <h3 className="font-display text-4xl font-semibold tracking-[-0.04em] text-ink-900">{event.title}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-800/66">
              {formatDate(event.eventDate)}
              {event.location ? ` • ${event.location}` : ''}
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-[#f0ddd0] bg-white/84 px-4 py-3 text-sm text-ink-800/72">
            <span className="font-bold text-ink-900">Slug:</span> {event.slug}
          </div>

          {event.planCode ? (
            <div className="rounded-[1.4rem] border border-[#f7e4bf] bg-[#fff8ea] px-4 py-3 text-sm text-[#8f6228]">
              <span className="font-bold">Plano:</span> {EVENT_PLAN_LABELS[event.planCode]}
              {event.photoLimit ? ` • ${event.photoLimit} fotos` : ''}
            </div>
          ) : null}

          {isDraft ? (
            <div className="rounded-[1.4rem] border border-[#f7dec7] bg-[#fff7ef] px-4 py-3 text-sm text-[#8f6228]">
              Evento em rascunho. Para teste, o link publico e o upload ficam liberados pelo frontend.
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 md:min-w-[180px]">
          {isDraft ? (
            <Link
              to={buildEventCheckoutPath(event.id)}
              className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5"
            >
              Escolher plano
            </Link>
          ) : (
            <Link
              to={buildEventOverviewPath(event.id)}
              className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5"
            >
              Abrir painel
            </Link>
          )}

          {canOpenPublicPage ? (
            <Link
              to={`/e/${event.slug}`}
              className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-5 py-3 text-sm font-bold text-ink-900 shadow-[0_12px_28px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5"
            >
              Ver pagina publica
            </Link>
          ) : (
            <Link
              to={buildEventOverviewPath(event.id)}
              className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-5 py-3 text-sm font-bold text-ink-900 shadow-[0_12px_28px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5"
            >
              {isDraft ? 'Revisar evento' : 'Ver painel'}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
