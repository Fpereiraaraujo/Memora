import { Link } from 'react-router-dom';

import { ExternalIcon } from '@/features/events/components/event-dashboard/event-icons';
import { formatEventDate } from '@/features/events/utils/event-dashboard-formatters';
import type { EventSummary } from '@/types/event';

interface EventUploadHeaderProps {
  event: EventSummary;
}

function getEventLabel(type: string) {
  const labels: Record<string, string> = {
    WEDDING: 'Casamento',
    BIRTHDAY: 'Aniversário',
    GRADUATION: 'Formatura',
    BABY_SHOWER: 'Chá de bebê',
    BAPTISM: 'Batizado',
    CORPORATE: 'Evento corporativo',
    OTHER: 'Evento especial',
  };

  return labels[type] ?? 'Evento especial';
}

export function EventUploadHeader({ event }: EventUploadHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#f4a1aa]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-[#d8a84f]/16 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/80 px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#c5922e]">
              <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">♥</span>
              {getEventLabel(event.type)}
            </span>

            <span className="inline-flex h-10 items-center rounded-full bg-[#fff3e6] px-4 text-xs font-bold text-[#c5922e]">
              {formatEventDate(event.eventDate)}
            </span>
          </div>

          <h1 className="max-w-4xl font-display text-[46px] font-semibold leading-[0.95] tracking-[-0.055em] text-[#161314] sm:text-[58px] lg:text-[68px]">
            Envie suas fotos para {event.title}
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#2c2927]/68 sm:text-base">
            Compartilhe os momentos que você registrou. Sua foto pode virar uma das lembranças preferidas dos anfitriões.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#upload"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.26)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
            >
              Enviar foto agora
              <span aria-hidden="true">+</span>
            </a>

            <Link
              to={`/e/${event.slug}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#e8cfc1] bg-white px-6 text-sm font-bold text-[#201914] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5 hover:bg-[#fff7f2]"
            >
              Ver fotos do evento
              <ExternalIcon className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto max-w-[390px] rounded-[26px] border border-[#f1ddd1] bg-[#fffaf7] p-4 shadow-[0_24px_70px_rgba(96,60,36,0.12)]">
            <div className="relative h-[360px] overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#3b2721,#b77955_48%,#f3c4b0)] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.62),transparent_30%),linear-gradient(135deg,rgba(255,255,255,.18),transparent)]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="inline-flex w-fit rounded-full bg-white/82 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#c5922e] backdrop-blur">
                  Memora
                </div>

                <div>
                  <p className="font-display text-[42px] font-semibold leading-none tracking-[-0.045em] text-white">
                    Compartilhe
                    <br />
                    esse momento
                  </p>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">
                    Bastidores, abraços, risadas e detalhes também contam a história.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="h-20 rounded-[16px] bg-[#f9d7dc]" />
              <div className="h-20 rounded-[16px] bg-[#f5c0a7]" />
              <div className="h-20 rounded-[16px] bg-[#ecd5ad]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
