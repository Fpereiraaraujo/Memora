import type { CSSProperties, ReactNode } from 'react';

import type { InvitationTheme } from '@/types/invitation';

interface InvitationLetterFrameProps {
  theme: InvitationTheme;
  children: ReactNode;
}

const paletteByTheme: Record<InvitationTheme, CSSProperties> = {
  ROMANCE: {
    '--invite-accent': '#ee8e98',
    '--invite-accent-soft': '#f5b8b5',
    '--invite-gold': '#d5a44e',
    '--invite-green': '#9ca98a',
  } as CSSProperties,

  GARDEN: {
    '--invite-accent': '#d28e88',
    '--invite-accent-soft': '#e9b9ac',
    '--invite-gold': '#c59c4d',
    '--invite-green': '#879a7e',
  } as CSSProperties,

  MODERN: {
    '--invite-accent': '#df858f',
    '--invite-accent-soft': '#ebb1af',
    '--invite-gold': '#c99a4b',
    '--invite-green': '#9aa58e',
  } as CSSProperties,
};

export function InvitationLetterFrame({
  theme,
  children,
}: InvitationLetterFrameProps) {
  return (
    <article
      className="memora-invite-phone"
      style={paletteByTheme[theme]}
    >
      <div className="memora-invite-phone__hardware">
        <span className="memora-invite-phone__speaker" />
        <span className="memora-invite-phone__camera" />
      </div>

      <div className="memora-invite-phone__status">
        <span>9:41</span>

        <div className="memora-invite-phone__system-icons">
          <svg
            viewBox="0 0 18 12"
            aria-hidden="true"
          >
            <path d="M1 10h2V8H1v2Zm4 0h2V6H5v4Zm4 0h2V4H9v6Zm4 0h2V1h-2v9Z" />
          </svg>

          <svg
            viewBox="0 0 18 12"
            aria-hidden="true"
          >
            <path
              d="M1.5 4.4a10.8 10.8 0 0 1 15 0M4 7a7.3 7.3 0 0 1 10 0M7 9.5a3.1 3.1 0 0 1 4 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>

          <span className="memora-invite-phone__battery">
            <span />
          </span>
        </div>
      </div>

      <div className="memora-invite-phone__screen">
        {children}
      </div>
    </article>
  );
}