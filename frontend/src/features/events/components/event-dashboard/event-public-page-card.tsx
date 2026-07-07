import { Link } from 'react-router-dom';

import { ExternalIcon, ImagesIcon } from '@/features/events/components/event-dashboard/event-icons';
import { eventDashboardMockImages } from '@/features/events/utils/event-dashboard-mock';
import { buildEventPublicPageSettingsPath } from '@/features/events/utils/event-routes';
import type { EventSummary } from '@/types/event';

interface EventPublicPageCardProps {
  event: EventSummary;
  publicLinksEnabled: boolean;
}

export function EventPublicPageCard({ event, publicLinksEnabled }: EventPublicPageCardProps) {
  const settingsPath = buildEventPublicPageSettingsPath(event.id);

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#f1ddd1] bg-[linear-gradient(135deg,#ffe9e2_0%,#fff8f3_52%,#ffffff_100%)] p-0 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
      <div className="grid gap-6 p-6 lg:grid-cols-[260px_1fr_auto] lg:items-center">
        <Link to={settingsPath} className="group relative h-44 overflow-hidden rounded-[18px] bg-[#f5ded2] lg:h-40">
          <img
            src={eventDashboardMockImages[0]}
            alt="Página pública do evento"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/12 to-[#ffe4e1]/46" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-xs font-black text-[#c5922e] shadow-[0_10px_24px_rgba(96,60,36,0.10)] backdrop-blur">
            <ImagesIcon className="size-4" />
            Página dos convidados
          </div>
        </Link>

        <div>
          <p className="text-sm font-bold text-[#ef7885]">
            Esta é a página como os convidados irão ver
          </p>

          <h2 className="mt-2 font-display text-[36px] font-semibold leading-none tracking-[-0.04em] text-[#161314]">
            Personalize sua página pública
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-8 text-[#2c2927]/65">
            Escolha a foto de capa, fotos em destaque, data, nome dos noivos e a mensagem que aparece para quem acessa o link público do evento.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[210px]">
          <Link
            to={settingsPath}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
          >
            Personalizar página
          </Link>

          {publicLinksEnabled ? (
            <Link
              to={`/e/${event.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#d6a45a] bg-white px-6 text-sm font-bold text-[#b57b26] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5 hover:bg-[#fff8ef]"
            >
              Abrir prévia
              <ExternalIcon className="size-4" />
            </Link>
          ) : (
            <p className="rounded-[14px] border border-[#f7dec7] bg-[#fff7ef] px-5 py-3 text-sm font-bold text-[#8f6228]">
              A prévia será aberta assim que o evento tiver um slug.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
