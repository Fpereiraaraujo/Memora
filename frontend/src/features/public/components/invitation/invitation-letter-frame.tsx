import type { CSSProperties, ReactNode } from 'react';

import type { InvitationTheme } from '@/types/invitation';

const paletteByTheme: Record<InvitationTheme, CSSProperties> = {
  ROMANCE: {
    '--letter-paper': '#fffdf9',
    '--letter-ink': '#3a2523',
    '--letter-accent': '#d97987',
    '--letter-accent-soft': '#fde8e6',
    '--letter-gold': '#bf8b35',
    '--letter-shadow': 'rgba(120, 67, 56, 0.18)',
  } as CSSProperties,
  GARDEN: {
    '--letter-paper': '#fefff9',
    '--letter-ink': '#294034',
    '--letter-accent': '#6f9678',
    '--letter-accent-soft': '#e7f0e1',
    '--letter-gold': '#af853d',
    '--letter-shadow': 'rgba(62, 94, 66, 0.18)',
  } as CSSProperties,
  MODERN: {
    '--letter-paper': '#fcfbfa',
    '--letter-ink': '#302c2a',
    '--letter-accent': '#7e6258',
    '--letter-accent-soft': '#eee8e3',
    '--letter-gold': '#a37b47',
    '--letter-shadow': 'rgba(77, 62, 53, 0.16)',
  } as CSSProperties,
};

interface InvitationLetterFrameProps {
  theme: InvitationTheme;
  children: ReactNode;
}

export function InvitationLetterFrame({ theme, children }: InvitationLetterFrameProps) {
  return (
    <article className={`invitation-letter invitation-letter--${theme.toLowerCase()} letter-arrive`} style={paletteByTheme[theme]}>
      <div className="invitation-letter__topline" aria-hidden="true" />
      <div className="invitation-letter__seal" aria-hidden="true"><span>♡</span></div>
      {children}
      <div className="invitation-letter__signature" aria-hidden="true">Memora</div>
    </article>
  );
}
