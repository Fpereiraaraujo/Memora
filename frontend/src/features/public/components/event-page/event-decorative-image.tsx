import { cn } from '@/lib/cn';
import type { EventDecorativeImagePosition } from '@/types/customization';

interface EventDecorativeImageProps {
  imageUrl: string | null;
  position: EventDecorativeImagePosition;
  scope: 'hero' | 'page';
  className?: string;
}

const HERO_POSITIONS: EventDecorativeImagePosition[] = ['HERO_RIGHT', 'HERO_BOTTOM'];
const PAGE_POSITIONS: EventDecorativeImagePosition[] = ['PAGE_TOP_RIGHT', 'PAGE_BOTTOM_LEFT'];

export function EventDecorativeImage({
  imageUrl,
  position,
  scope,
  className,
}: EventDecorativeImageProps) {
  const supported = scope === 'hero'
    ? HERO_POSITIONS.includes(position)
    : PAGE_POSITIONS.includes(position);

  if (!imageUrl || !supported) {
    return null;
  }

  return (
    <img
      src={imageUrl}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        'pointer-events-none absolute select-none object-contain',
        position === 'HERO_RIGHT'
          && 'bottom-0 right-0 z-10 max-h-[66%] w-[48%] object-bottom drop-shadow-[0_14px_24px_rgba(33,28,25,0.18)]',
        position === 'HERO_BOTTOM'
          && 'inset-x-[8%] bottom-0 z-10 h-[38%] w-[84%] object-bottom drop-shadow-[0_14px_24px_rgba(33,28,25,0.16)]',
        position === 'PAGE_TOP_RIGHT'
          && 'right-[-2.5rem] top-24 z-0 w-36 opacity-55 drop-shadow-[0_18px_34px_rgba(33,28,25,0.12)] sm:right-0 sm:w-52 lg:w-64',
        position === 'PAGE_BOTTOM_LEFT'
          && 'bottom-12 left-[-2.5rem] z-0 w-36 opacity-55 drop-shadow-[0_18px_34px_rgba(33,28,25,0.12)] sm:left-0 sm:w-52 lg:w-64',
        className,
      )}
    />
  );
}
