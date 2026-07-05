import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b88763]">{eyebrow}</p> : null}
        <h2 className="font-display text-4xl text-ink-900 md:text-5xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-7 text-ink-800/72 md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
