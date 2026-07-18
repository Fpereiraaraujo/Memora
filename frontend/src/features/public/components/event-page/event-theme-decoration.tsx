import { cn } from '@/lib/cn';
import type { EventDecorationStyle } from '@/types/customization';

interface EventThemeDecorationProps {
  style: EventDecorationStyle;
  className?: string;
}

export function getEventDecorationMark(style: EventDecorationStyle) {
  if (style === 'CLOUDS_STARS') return '✦';
  if (style === 'FLORAL') return '⌁';
  if (style === 'CONFETTI') return '⋰';
  return '♡';
}

export function EventThemeDecoration({
  style,
  className,
}: EventThemeDecorationProps) {
  const containerClassName = cn(
    'pointer-events-none absolute inset-0 overflow-hidden',
    className,
  );

  if (style === 'CLOUDS_STARS') {
    return (
      <div aria-hidden="true" className={containerClassName}>
        <span className="absolute right-[8%] top-[9%] text-2xl text-[var(--event-accent-color)]">✦</span>
        <span className="absolute left-[7%] top-[42%] text-sm text-[var(--event-accent-color)]">✦</span>
        <span className="absolute right-[22%] top-[19%] size-2 rounded-full bg-[var(--event-primary-color)] opacity-50" />
        <span className="absolute -right-5 bottom-[12%] h-16 w-36 rounded-full bg-white/70 before:absolute before:-top-7 before:left-6 before:size-16 before:rounded-full before:bg-white/70 after:absolute after:-top-4 after:right-5 after:size-12 after:rounded-full after:bg-white/70" />
      </div>
    );
  }

  if (style === 'FLORAL') {
    return (
      <div aria-hidden="true" className={containerClassName}>
        <span className="absolute -left-12 -top-8 h-44 w-24 rotate-[34deg] rounded-[50%] border-r-2 border-[var(--event-accent-color)] opacity-55" />
        <span className="absolute left-5 top-16 h-14 w-7 rotate-[-24deg] rounded-[50%] bg-[var(--event-primary-color)] opacity-35" />
        <span className="absolute bottom-8 right-5 h-16 w-8 rotate-[28deg] rounded-[50%] bg-[var(--event-primary-color)] opacity-30" />
        <span className="absolute -bottom-10 -right-10 h-44 w-24 rotate-[34deg] rounded-[50%] border-l-2 border-[var(--event-accent-color)] opacity-55" />
      </div>
    );
  }

  if (style === 'CONFETTI') {
    return (
      <div aria-hidden="true" className={containerClassName}>
        {[
          'left-[6%] top-[11%] rotate-12',
          'left-[18%] top-[35%] -rotate-12',
          'right-[9%] top-[16%] rotate-45',
          'right-[18%] bottom-[12%] -rotate-12',
          'left-[9%] bottom-[8%] rotate-[65deg]',
        ].map((position, index) => (
          <span
            key={position}
            className={cn(
              'absolute h-2.5 w-6 rounded-full',
              position,
              index % 2 === 0
                ? 'bg-[var(--event-primary-color)]'
                : 'bg-[var(--event-accent-color)]',
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={containerClassName}>
      <span className="absolute right-[8%] top-[9%] font-display text-4xl text-[var(--event-primary-color)] opacity-40">♡</span>
      <span className="absolute bottom-[9%] left-[7%] font-display text-3xl text-[var(--event-accent-color)] opacity-45">♡</span>
    </div>
  );
}
