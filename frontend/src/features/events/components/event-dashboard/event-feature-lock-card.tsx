import { Link } from 'react-router-dom';

import { buildEventCheckoutPath } from '@/features/events/utils/event-routes';

interface EventFeatureLockCardProps {
  eventId: string;
  requiredPlanLabel: string;
  eyebrow: string;
  title: string;
  description: string;
}

export function EventFeatureLockCard({
  eventId,
  requiredPlanLabel,
  eyebrow,
  title,
  description,
}: EventFeatureLockCardProps) {
  return (
    <section className="rounded-[24px] border border-[#f1ddd1] bg-[linear-gradient(135deg,#fffaf7,#fff1f2_52%,#ffffff)] p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/84 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#c5922e] shadow-[0_10px_24px_rgba(96,60,36,0.06)]">
        <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
          ♥
        </span>
        {eyebrow}
      </div>

      <h2 className="mt-5 font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-[#161314]">
        {title}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#2c2927]/68">
        {description}
      </p>

      <div className="mt-5 inline-flex items-center rounded-full bg-[#fff7ef] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#b57b26]">
        Liberado a partir do plano {requiredPlanLabel}
      </div>

      <div className="mt-6">
        <Link
          to={buildEventCheckoutPath(eventId)}
          className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
        >
          Escolher plano
        </Link>
      </div>
    </section>
  );
}
