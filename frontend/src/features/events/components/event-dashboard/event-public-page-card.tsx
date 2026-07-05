import { Link } from 'react-router-dom';

import { ExternalIcon } from '@/features/events/components/event-dashboard/event-icons';
import { eventDashboardMockImages } from '@/features/events/utils/event-dashboard-mock';
import type { EventSummary } from '@/types/event';

interface EventPublicPageCardProps {
  event: EventSummary;
}

export function EventPublicPageCard({ event }: EventPublicPageCardProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#f1ddd1] bg-[linear-gradient(135deg,#ffe9e2_0%,#fff8f3_52%,#ffffff_100%)] p-0 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
      <div className="grid gap-6 p-6 md:grid-cols-[250px_1fr] md:items-center">
        <div className="relative h-40 overflow-hidden rounded-[18px] bg-[#f5ded2]">
          <img src={eventDashboardMockImages[0]} alt="Página pública do evento" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-[#ffe4e1]/42" />
        </div>

        <div>
          <h2 className="font-display text-[36px] font-semibold leading-none tracking-[-0.04em] text-[#161314]">
            Sua página pública do evento
          </h2>

          <p className="mt-3 text-base leading-8 text-[#2c2927]/65">
            Compartilhe sua página com os convidados e permita que qualquer pessoa com o link veja as fotos e envie mensagens.
          </p>

          <Link
            to={`/e/${event.slug}`}
            className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
          >
            Abrir página pública
            <ExternalIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
