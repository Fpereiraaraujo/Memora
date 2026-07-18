import { formatEventDate } from '@/features/events/utils/event-dashboard-formatters';
import { EventThemeDecoration } from '@/features/public/components/event-page/event-theme-decoration';
import { EventDecorativeImage } from '@/features/public/components/event-page/event-decorative-image';
import {
  resolveEventTheme,
  toEventThemeCssVariables,
} from '@/features/public/utils/event-theme';
import type { PublicPageCustomization } from '@/types/customization';
import type { EventSummary } from '@/types/event';
import { cn } from '@/lib/cn';

interface EventThemePreviewProps {
  event: EventSummary;
  customization: PublicPageCustomization;
  coverImageUrl: string | null;
  highlightImageUrls: string[];
  decorativeImageUrl: string | null;
}

const EVENT_LABELS: Record<string, string> = {
  WEDDING: 'Casamento',
  BIRTHDAY: 'Aniversário',
  GRADUATION: 'Formatura',
  BABY_SHOWER: 'Chá de bebê',
  BAPTISM: 'Batizado',
  CORPORATE: 'Evento corporativo',
  OTHER: 'Evento especial',
};

export function EventThemePreview({
  event,
  customization,
  coverImageUrl,
  highlightImageUrls,
  decorativeImageUrl,
}: EventThemePreviewProps) {
  const theme = resolveEventTheme(customization);
  const cssVariables = toEventThemeCssVariables(theme);

  return (
    <section className="min-w-0 xl:sticky xl:top-6">
      <div className="min-w-0 overflow-hidden rounded-[24px] border border-[#f1ddd1] bg-white p-4 shadow-[0_22px_60px_rgba(96,60,36,0.08)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">
              Prévia em tempo real
            </p>
            <h2 className="mt-2 text-xl font-black text-[#161314]">
              Primeira impressão dos convidados
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#2c2927]/64">
              Esta prévia usa os mesmos tokens visuais da página pública.
            </p>
          </div>
          <span
            className="mt-1 hidden size-11 shrink-0 rounded-[15px] border-4 border-white shadow-sm sm:block"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        <div
          className="relative mt-5 overflow-hidden rounded-[24px] border border-white/80 bg-[var(--event-secondary-color)] p-4 text-[var(--event-foreground-color)] shadow-[0_24px_55px_rgba(62,43,30,0.12)] sm:mt-6 sm:p-6"
          style={cssVariables}
        >
          <div className="absolute -right-20 -top-20 size-52 rounded-full bg-[var(--event-primary-color)] opacity-15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-[var(--event-accent-color)] opacity-15 blur-3xl" />
          <EventThemeDecoration style={theme.decorationStyle} />
          <EventDecorativeImage
            imageUrl={decorativeImageUrl}
            position={customization.decorativeImagePosition}
            scope="page"
            className="max-w-[34%]"
          />

          <div className="relative">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/80 bg-white/78 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--event-accent-ink-color)] backdrop-blur">
                {EVENT_LABELS[event.type] ?? 'Evento especial'}
              </span>
              {customization.eventDate ? (
                <span className="rounded-full bg-[var(--event-primary-soft-color)] px-3 py-2 text-[10px] font-black text-[var(--event-foreground-color)]">
                  {formatEventDate(customization.eventDate)}
                </span>
              ) : null}
            </div>

            <h3 className="mt-5 max-w-[90%] font-display text-[36px] font-semibold leading-[0.92] tracking-[-0.05em] sm:text-[48px]">
              {customization.title || event.title}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--event-muted-foreground-color)]">
              {customization.welcomeMessage}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex h-10 items-center rounded-[13px] bg-[var(--event-primary-color)] px-5 text-xs font-black text-[var(--event-on-primary-color)] shadow-[0_12px_26px_rgba(49,39,33,0.12)]">
                Enviar fotos
              </span>
              {customization.publicGalleryEnabled ? (
                <span className="inline-flex h-10 items-center rounded-[13px] border border-white bg-white/82 px-5 text-xs font-black">
                  Ver galeria
                </span>
              ) : (
                <span className="inline-flex h-10 items-center rounded-[13px] border border-white bg-white/82 px-5 text-xs font-black">
                  Galeria privada
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-[1.25fr_0.75fr] gap-3">
              <div className="relative h-40 overflow-hidden rounded-[18px] border-4 border-white bg-[var(--event-primary-soft-color)] shadow-sm">
                {coverImageUrl ? (
                  <img
                    src={coverImageUrl}
                    alt="Prévia da capa"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      'flex h-full items-end p-4',
                      customization.decorativeImagePosition === 'HERO_RIGHT'
                        && 'pr-[48%]',
                      customization.decorativeImagePosition === 'HERO_BOTTOM'
                        && 'items-start pb-[40%]',
                    )}
                  >
                    <p className="font-display text-2xl font-semibold leading-none text-[var(--event-primary-color)]">
                      Memórias deste dia
                    </p>
                  </div>
                )}
                <EventDecorativeImage
                  imageUrl={decorativeImageUrl}
                  position={customization.decorativeImagePosition}
                  scope="hero"
                />
              </div>
              <div className="grid gap-3">
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className="h-[74px] overflow-hidden rounded-[15px] border-4 border-white bg-[var(--event-primary-soft-color)] shadow-sm"
                  >
                    {highlightImageUrls[index] ? (
                      <img
                        src={highlightImageUrls[index]}
                        alt={`Destaque ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#514741]/64">
          <span className="rounded-full bg-[#fff4f4] px-3 py-2">
            Contraste automático
          </span>
          <span className="rounded-full bg-[#fff8ef] px-3 py-2">
            Layout protegido
          </span>
          <span className="rounded-full bg-[#f1f8f8] px-3 py-2">
            Mobile-first
          </span>
        </div>
      </div>
    </section>
  );
}
