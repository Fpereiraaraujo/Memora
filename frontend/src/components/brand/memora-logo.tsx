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
    const content = (
        <span className={cn('inline-flex items-center gap-3', className)}>
      <span
          className={cn(
              'relative grid size-10 place-items-center rounded-2xl',
              iconClassName,
          )}
      >
        <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="size-7 text-[#c89331]"
            fill="none"
        >
          <path
              d="M31.8 50.4S12.6 39.7 9.2 25.9C6.8 16.1 18.4 9.6 26.1 16.6c2.4 2.1 4.2 5.3 5.7 9.2 1.5-3.9 3.3-7.1 5.7-9.2 7.7-7 19.3-.5 16.9 9.3-3.4 13.8-22.6 24.5-22.6 24.5Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
          />
          <path
              d="M31.8 25.8c-3.5 7.8-3.5 15.8 0 24.6 3.5-8.8 3.5-16.8 0-24.6Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".7"
          />
        </svg>
      </span>

            {showText && (
                <span
                    className={cn(
                        'font-display text-3xl font-semibold leading-none tracking-[-0.045em] text-[#273042]',
                        textClassName,
                    )}
                >
          Memora
        </span>
            )}
    </span>
    );

    return (
        <Link to={to} aria-label="Ir para a página inicial da Memora">
            {content}
        </Link>
    );
}
