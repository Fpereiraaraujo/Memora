import { Link } from 'react-router-dom';

import { ExternalIcon } from '@/features/events/components/event-dashboard/event-icons';
import { formatEventDate, getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import { eventDashboardMockImages } from '@/features/events/utils/event-dashboard-mock';
import type { PublicPageCustomization } from '@/types/customization';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

interface EventUploadHeaderProps {
  event: EventSummary;
  previewPhotos: Photo[];
  customization?: PublicPageCustomization | null;
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

export function EventUploadHeader({ event, previewPhotos, customization }: EventUploadHeaderProps) {
  const title = customization?.title?.trim() || event.title;
  const eventDate = customization?.eventDate ?? event.eventDate;
  const welcomeMessage = customization?.welcomeMessage?.trim()
    || 'Cada olhar, abraço, dança e detalhe faz parte da memória deste dia. Envie suas fotos e deixe sua versão desse momento registrada para sempre.';

  const customizedImages = [
    customization?.coverImageUrl,
    ...(customization?.highlightImageUrls ?? []),
  ].filter((image): image is string => Boolean(image));

  const coverImages = customizedImages.length > 0
    ? [
      customizedImages[0] ?? eventDashboardMockImages[1],
      customizedImages[1] ?? customizedImages[0] ?? eventDashboardMockImages[2],
      customizedImages[2] ?? customizedImages[0] ?? eventDashboardMockImages[3],
    ]
    : [
      previewPhotos[0]?.downloadUrl ?? eventDashboardMockImages[1],
      previewPhotos[1]?.downloadUrl ?? eventDashboardMockImages[2],
      previewPhotos[2]?.downloadUrl ?? eventDashboardMockImages[3],
    ];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#f4a1aa]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-[#d8a84f]/16 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/80 px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#c5922e]">
              <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
                ♥
              </span>
              {getEventLabel(event.type)}
            </span>

            <span className="inline-flex h-10 items-center rounded-full bg-[#fff3e6] px-4 text-xs font-bold text-[#c5922e]">
              {formatEventDate(eventDate)}
            </span>
          </div>

          <h1 className="max-w-4xl font-display text-[46px] font-semibold leading-[0.95] tracking-[-0.055em] text-[#161314] sm:text-[58px] lg:text-[68px]">
            Envie suas fotos para {title}
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#2c2927]/68 sm:text-base">
            {welcomeMessage}
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

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#2c2927]/70">
            <span className="inline-flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#fff4ef] text-xs text-[#d19a38]">✓</span>Upload sem login</span>
            <span className="inline-flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#fff4ef] text-xs text-[#d19a38]">✓</span>Fotos enviadas em segundos</span>
            <span className="inline-flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-[#fff4ef] text-xs text-[#d19a38]">✓</span>Recado opcional para os anfitriões</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-[24px] border border-[#f1ddd1] bg-[#fffaf7] p-3 shadow-[0_18px_48px_rgba(96,60,36,0.10)]">
              <img src={getPhotoSrc(coverImages[0])} alt="Momento do evento" className="h-[240px] w-full rounded-[18px] object-cover" />
            </div>

            <div className="rounded-[22px] border border-[#f1ddd1] bg-[linear-gradient(135deg,#fff7f4,#fff0f2)] p-5 shadow-[0_16px_38px_rgba(96,60,36,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c5922e]">Um recado para você</p>
              <p className="mt-3 font-display text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#161314]">
                Sua foto ajuda a contar essa história
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-[#f1ddd1] bg-white p-3 shadow-[0_24px_70px_rgba(96,60,36,0.12)]">
            <img src={getPhotoSrc(coverImages[1])} alt="Evento em destaque" className="h-[210px] w-full rounded-[20px] object-cover" />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <img src={getPhotoSrc(coverImages[2])} alt="Detalhes da celebração" className="h-[122px] w-full rounded-[18px] object-cover" />
              <div className="flex h-[122px] flex-col justify-between rounded-[18px] bg-[linear-gradient(145deg,#2f231d,#be835d_52%,#f6ceb3)] p-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/58">Memora</span>
                <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.04em]">
                  Obrigado por fazer parte deste momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
