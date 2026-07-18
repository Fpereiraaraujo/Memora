import {
  applyPublicPageIdentityToQrArt,
} from '@/features/events/utils/qr-art-config';
import {
  getEventThemeTemplate,
  resolveEventTheme,
  toEventThemeCssVariables,
} from '@/features/public/utils/event-theme';
import type { PublicPageCustomization } from '@/types/customization';
import type { EventQrArtCustomization } from '@/types/qr-art';

interface QrArtPageIdentityCardProps {
  art: EventQrArtCustomization;
  publicPage: PublicPageCustomization;
  onApply: () => void;
}

export function QrArtPageIdentityCard({
  art,
  publicPage,
  onApply,
}: QrArtPageIdentityCardProps) {
  const theme = resolveEventTheme(publicPage);
  const template = getEventThemeTemplate(theme.templateCode);
  const synchronizedArt = applyPublicPageIdentityToQrArt(art, publicPage);
  const synchronized = art.title === synchronizedArt.title
    && art.templateCode === synchronizedArt.templateCode
    && art.primaryColor === synchronizedArt.primaryColor
    && art.secondaryColor === synchronizedArt.secondaryColor
    && art.accentColor === synchronizedArt.accentColor;

  return (
    <section
      className="relative mb-8 overflow-hidden rounded-[22px] border border-[var(--event-border-color)] bg-[var(--event-secondary-color)] p-5"
      style={toEventThemeCssVariables(theme)}
    >
      <div className="pointer-events-none absolute -right-12 -top-14 size-36 rounded-full bg-[var(--event-primary-color)] opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 left-1/3 size-32 rounded-full bg-[var(--event-accent-color)] opacity-15 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--event-accent-ink-color)]">
            Identidade da página
          </p>
          <h2 className="mt-2 text-lg font-black text-[var(--event-foreground-color)]">
            {template.name}
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-6 text-[var(--event-muted-foreground-color)]">
            Aplique o título, o modelo e as cores da página pública. Seus textos complementares,
            formato e opções de impressão serão mantidos.
          </p>

          <div className="mt-4 flex items-center gap-2">
            {[theme.primary, theme.secondary, theme.accent].map((color) => (
              <span
                key={color}
                className="size-7 rounded-full border-2 border-white shadow-[0_6px_16px_rgba(33,28,25,0.12)]"
                style={{ backgroundColor: color }}
                aria-label={`Cor ${color}`}
              />
            ))}
            <span className="ml-1 truncate text-xs font-bold text-[var(--event-muted-foreground-color)]">
              {publicPage.title}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={synchronized}
          onClick={onApply}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-[14px] border border-[var(--event-primary-color)] bg-[var(--event-primary-color)] px-5 text-xs font-black text-[var(--event-on-primary-color)] shadow-[0_12px_28px_var(--event-primary-shadow-color)] transition hover:-translate-y-0.5 hover:bg-[var(--event-primary-hover-color)] disabled:cursor-default disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {synchronized ? 'Identidade aplicada' : 'Usar esta identidade'}
        </button>
      </div>
    </section>
  );
}
