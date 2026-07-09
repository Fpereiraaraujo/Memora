interface CoupleHighlightsSectionProps {
  images: string[];
}

export function CoupleHighlightsSection({ images }: CoupleHighlightsSectionProps) {
  const visibleImages = images.filter(Boolean).slice(0, 5);

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_22px_60px_rgba(96,60,36,0.07)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#ef7885]">
            Escolhidas pelos anfitriões
          </p>

          <h2 className="mt-2 font-display text-[38px] font-semibold leading-none tracking-[-0.045em] text-[#161314] sm:text-[44px]">
            Destaque dos Noivos
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#2c2927]/62">
            Essas são as fotos escolhidas pelos noivos para abrir a experiência pública do evento.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-bold text-[#c5922e]">
          {visibleImages.length}/5 fotos
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {visibleImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="group aspect-[4/5] overflow-hidden rounded-[20px] bg-[#f5ded2] shadow-[0_14px_32px_rgba(96,60,36,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(96,60,36,0.13)] active:scale-[0.99]"
          >
            <img
              src={image}
              alt={`Destaque dos noivos ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
