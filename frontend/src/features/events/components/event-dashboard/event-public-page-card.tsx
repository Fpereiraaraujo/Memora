import { Link } from 'react-router-dom';

import { ExternalIcon, ImagesIcon } from '@/features/events/components/event-dashboard/event-icons';
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
        <Link to={settingsPath} className="group relative h-44 overflow-hidden rounded-[18px] bg-[linear-gradient(145deg,#fff4ef_0%,#ffe2db_48%,#f8c7bb_100%)] lg:h-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(239,120,133,0.24),transparent_34%)]" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-xs font-black text-[#c5922e] shadow-[0_10px_24px_rgba(96,60,36,0.10)] backdrop-blur">
            <ImagesIcon className="size-4" />
            Pagina dos convidados
          </div>
          <div className="absolute inset-x-4 bottom-4 rounded-[16px] border border-white/70 bg-white/82 p-4 shadow-[0_10px_24px_rgba(96,60,36,0.10)] backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c5922e]">Hero do evento</p>
            <p className="mt-2 font-display text-[22px] font-semibold leading-none tracking-[-0.04em] text-[#201914]">
              {event.title}
            </p>
          </div>
        </Link>

        <div>
          <p className="text-sm font-bold text-[#ef7885]">
            Esta e a pagina que os convidados vao ver
          </p>

          <h2 className="mt-2 font-display text-[36px] font-semibold leading-none tracking-[-0.04em] text-[#161314]">
            Personalize sua pagina publica
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-8 text-[#2c2927]/65">
            Defina foto de capa, destaques, nome dos noivos, data e a mensagem principal para deixar a experiencia dos convidados mais bonita e clara.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[210px]">
          <Link
            to={settingsPath}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
          >
            Personalizar pagina
          </Link>

          {publicLinksEnabled ? (
            <Link
              to={`/e/${event.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#d6a45a] bg-white px-6 text-sm font-bold text-[#b57b26] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5 hover:bg-[#fff8ef]"
            >
              Abrir previa
              <ExternalIcon className="size-4" />
            </Link>
          ) : (
            <p className="rounded-[14px] border border-[#f7dec7] bg-[#fff7ef] px-5 py-3 text-sm font-bold text-[#8f6228]">
              A previa sera aberta assim que o evento tiver um slug.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
