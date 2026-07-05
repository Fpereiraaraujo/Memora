interface IconProps {
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}

const defaultClassName = 'size-5';

export function DashboardIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="13" y="4" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="4" y="13" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="13" y="13" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function CalendarIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.4" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function QrIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="14" y="4" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="4" y="14" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M14 14h2.5v2.5H14V14ZM18.5 14H20v6h-6v-1.5h4.5V14Z" fill="currentColor" />
    </svg>
  );
}

export function ImagesIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2.4" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M8 14l2.2-2.2a1 1 0 0 1 1.4 0L14 14.2l1.2-1.2a1 1 0 0 1 1.4 0L20 16.4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function HeartIcon({ className = defaultClassName, strokeWidth = 1.9, filled = false }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 20.2S4.5 15.8 4.5 9.7c0-3 3.7-4.9 6-2.5.7.7 1.2 1.6 1.5 2.5.3-.9.8-1.8 1.5-2.5 2.3-2.4 6-.5 6 2.5 0 6.1-7.5 10.5-7.5 10.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DownloadIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 4v11M8 11l4 4 4-4M5 20h14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M9.5 14.5 14.5 9.5M10.5 7.5l1.2-1.2a4 4 0 0 1 5.7 5.7l-1.2 1.2M13.5 16.5l-1.2 1.2a4 4 0 0 1-5.7-5.7l1.2-1.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function ExternalIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M8 6h10v10M18 6 6 18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 16V4M8 8l4-4 4 4M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon({ className = defaultClassName, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3.8 19.5c.7-3.2 2.8-5.2 5.2-5.2s4.5 2 5.2 5.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16.2 11.2a3 3 0 1 0 0-5.8M15.5 14.2c2.2.4 3.8 2.2 4.4 5.1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
