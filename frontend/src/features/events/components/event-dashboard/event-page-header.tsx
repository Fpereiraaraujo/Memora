import type { ReactNode } from 'react';

interface EventPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
}

export function EventPageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
}: EventPageHeaderProps) {
  return (
    <section className="rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[15px] font-bold text-[#ef7885]">{eyebrow}</p>

          <h1 className="mt-2 font-display text-[42px] font-semibold leading-none tracking-[-0.045em] text-[#161314] md:text-[52px]">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#2c2927]/62">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          {badge ? (
            <span className="w-fit rounded-full bg-[#fff3e6] px-5 py-2.5 text-sm font-bold text-[#c5922e]">
              {badge}
            </span>
          ) : null}

          {actions}
        </div>
      </div>
    </section>
  );
}
