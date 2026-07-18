interface EventHighlightsSectionProps {
  images: string[];
}

export function EventHighlightsSection({ images }: EventHighlightsSectionProps) {
  const visibleImages = images.filter(Boolean).slice(0, 3);

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <section
      id="destaques"
      className="rounded-[28px] border border-[var(--event-border-color)] bg-white/92 p-6 shadow-[0_22px_60px_var(--event-primary-mist-color)] sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[var(--event-primary-ink-color)]">
            Escolhidas pelos anfitriões
          </p>

          <h2 className="mt-2 font-display text-[38px] font-semibold leading-none tracking-[-0.045em] text-[var(--event-foreground-color)] sm:text-[44px]">
            Destaques do evento
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--event-muted-foreground-color)]">
            Essas são as fotos escolhidas pelos anfitriões para abrir a experiência pública do evento.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[var(--event-accent-soft-color)] px-4 py-2 text-xs font-bold text-[var(--event-accent-ink-color)]">
          {visibleImages.length}/3 fotos
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="group aspect-[4/5] overflow-hidden rounded-[20px] bg-[var(--event-primary-soft-color)] shadow-[0_14px_32px_var(--event-primary-mist-color)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_var(--event-primary-shadow-color)] active:scale-[0.99]"
          >
            <img
              src={image}
              alt={`Destaque do evento ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
