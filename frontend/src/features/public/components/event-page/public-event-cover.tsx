import { formatEventDate } from '@/features/events/utils/event-dashboard-formatters';
import {
  EventThemeDecoration,
  getEventDecorationMark,
} from '@/features/public/components/event-page/event-theme-decoration';
import { EventDecorativeImage } from '@/features/public/components/event-page/event-decorative-image';
import { cn } from '@/lib/cn';
import type { PublicPageCustomization } from '@/types/customization';
import type { EventSummary } from '@/types/event';

interface PublicEventCoverProps {
  event: EventSummary;
  customization: PublicPageCustomization;
  totalPhotos: number;
  publicGalleryEnabled: boolean;
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

export function PublicEventCover({
  event,
  customization,
  totalPhotos,
  publicGalleryEnabled,
}: PublicEventCoverProps) {
  return (
    <section
      id="topo-publico"
      className="relative overflow-hidden rounded-[28px] border border-[var(--event-border-color)] bg-[var(--event-surface-color)] p-6 text-[var(--event-foreground-color)] backdrop-blur sm:p-8 lg:p-10"
      style={{
        background: 'linear-gradient(145deg, var(--event-surface-color) 0%, var(--event-surface-color) 64%, var(--event-secondary-color) 145%)',
        boxShadow: '0 24px 70px var(--event-primary-shadow-color)',
      }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[var(--event-primary-mist-color)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-[var(--event-accent-mist-color)] blur-3xl" />
      <EventThemeDecoration
        style={customization.decorationStyle}
        className="opacity-70"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--event-border-color)] bg-white/84 px-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--event-accent-ink-color)] backdrop-blur">
              <span className="grid size-5 place-items-center rounded-full bg-[var(--event-primary-soft-color)] text-[var(--event-primary-ink-color)]">
                {getEventDecorationMark(customization.decorationStyle)}
              </span>
              {getEventLabel(event.type)}
            </span>

            <span className="inline-flex h-10 items-center rounded-full bg-[var(--event-primary-soft-color)] px-4 text-xs font-bold text-[var(--event-primary-ink-color)]">
              {formatEventDate(customization.eventDate ?? event.eventDate)}
            </span>
          </div>

          <h1 className="max-w-4xl font-display text-[46px] font-semibold leading-[0.95] tracking-[-0.055em] text-[var(--event-foreground-color)] sm:text-[58px] lg:text-[68px]">
            {customization.title}
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[var(--event-muted-foreground-color)] sm:text-base">
            {customization.welcomeMessage}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#upload"
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[var(--event-primary-color)] px-6 text-sm font-bold text-[var(--event-on-primary-color)] transition hover:-translate-y-0.5 hover:bg-[var(--event-primary-hover-color)] active:scale-[0.98]"
              style={{ boxShadow: '0 16px 38px var(--event-primary-shadow-color)' }}
            >
              Enviar fotos
            </a>

            {publicGalleryEnabled ? (
              <a
                href="#galeria"
                className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[var(--event-border-color)] bg-white px-6 text-sm font-bold text-[var(--event-foreground-color)] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5 hover:bg-[var(--event-primary-soft-color)] active:scale-[0.98]"
              >
                Ver galeria
              </a>
            ) : null}
          </div>

          {publicGalleryEnabled ? (
            <div className="mt-7">
              <span className="inline-flex items-center rounded-full bg-[var(--event-accent-soft-color)] px-4 py-2 text-xs font-bold text-[var(--event-accent-ink-color)]">
                {totalPhotos} foto{totalPhotos === 1 ? '' : 's'} já compartilhada{totalPhotos === 1 ? '' : 's'}
              </span>
            </div>
          ) : (
            <p className="mt-7 inline-flex rounded-full bg-[var(--event-accent-soft-color)] px-4 py-2 text-xs font-bold text-[var(--event-accent-ink-color)]">
              As fotos enviadas ficam privadas para os anfitriões
            </p>
          )}
        </div>

        <div className="relative">
          <div
            className="mx-auto max-w-[420px] rounded-[26px] border border-[var(--event-border-color)] bg-white/82 p-4 backdrop-blur"
            style={{ boxShadow: '0 24px 70px var(--event-primary-shadow-color)' }}
          >
            <div
              className="relative h-[380px] overflow-hidden rounded-[22px]"
              style={{
                background: 'linear-gradient(145deg, var(--event-primary-soft-color), var(--event-secondary-color) 54%, var(--event-accent-soft-color))',
              }}
            >
              {customization.coverImageUrl ? (
                <img
                  src={customization.coverImageUrl}
                  alt={`Capa do evento ${customization.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative flex h-full flex-col p-6">
                  <EventThemeDecoration
                    style={customization.decorationStyle}
                    className="opacity-80"
                  />

                  <span className="relative inline-flex w-fit rounded-full bg-white/82 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--event-accent-ink-color)] backdrop-blur">
                    Memora
                  </span>

                  <div
                    className={cn(
                      'relative mt-auto',
                      customization.decorativeImagePosition === 'HERO_RIGHT'
                        && 'max-w-[56%]',
                      customization.decorativeImagePosition === 'HERO_BOTTOM'
                        && 'mb-auto mt-8 max-w-[88%]',
                    )}
                  >
                    <p className="font-display text-[42px] font-semibold leading-none tracking-[-0.045em] text-[var(--event-foreground-color)]">
                      Compartilhe
                      <br />
                      esse momento
                    </p>

                    <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--event-muted-foreground-color)]">
                      Envie fotos, bastidores e lembranças para os anfitriões.
                    </p>
                  </div>
                </div>
              )}
              <EventDecorativeImage
                imageUrl={customization.decorativeImageUrl}
                position={customization.decorativeImagePosition}
                scope="hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
