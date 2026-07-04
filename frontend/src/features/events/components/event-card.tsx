import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EVENT_STATUS_LABELS, type EventSummary } from '@/types/event';

interface EventCardProps {
  event: EventSummary;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sand-100/45">{event.type}</p>
            <h3 className="mt-2 font-display text-2xl text-sand-50">{event.title}</h3>
          </div>
          <Badge tone={event.status === 'ACTIVE' ? 'success' : event.status === 'DRAFT' ? 'warning' : 'neutral'}>
            {EVENT_STATUS_LABELS[event.status]}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-sand-100/72">
          <p>
            <span className="text-sand-100/45">Slug:</span> {event.slug}
          </p>
          <p>
            <span className="text-sand-100/45">Data:</span> {event.eventDate ?? 'Sem data'}
          </p>
          <p>
            <span className="text-sand-100/45">Local:</span> {event.location ?? 'Sem local'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center justify-center rounded-2xl bg-white/8 px-4 py-2.5 text-sm font-semibold text-sand-50 transition hover:bg-white/12"
          to={`/app/events/${event.id}`}
        >
          Abrir painel
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-sand-100/80 transition hover:bg-white/8 hover:text-sand-50"
          to={`/e/${event.slug}`}
        >
          Página pública
        </Link>
      </div>
    </Card>
  );
}
