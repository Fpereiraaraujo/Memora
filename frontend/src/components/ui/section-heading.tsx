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
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/60">{eyebrow}</p> : null}
        <h2 className="font-display text-3xl text-sand-50 md:text-4xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-sand-100/70">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
