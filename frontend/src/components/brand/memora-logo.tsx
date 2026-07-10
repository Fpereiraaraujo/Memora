import { Link } from 'react-router-dom';

import { cn } from '@/lib/cn';

interface MemoraLogoProps {
  to?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function MemoraLogo({
  to = '/',
  className,
  iconClassName,
  textClassName,
  showText = true,
}: MemoraLogoProps) {
  const imageClassName = cn(
    showText
      ? 'h-9 w-auto max-w-[180px] object-contain sm:h-10 sm:max-w-[205px]'
      : 'h-10 w-auto object-contain',
    iconClassName,
    textClassName,
  );

  return (
    <Link
      to={to}
      aria-label="Ir para a página inicial da Memora"
      className={cn('inline-flex min-w-0 items-center', className)}
    >
      <img src="/brand/memora-logo.png" alt="Memora" className={imageClassName} />
    </Link>
  );
}
