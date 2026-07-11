import type { EventPlanCode } from '@/types/event';
import { EVENT_PLANS } from '@/types/payment';

interface EventPlanSelectorProps {
  busy: boolean;
  selectedPlanCode: EventPlanCode | null;
  onSelectPlan: (planCode: EventPlanCode) => void;
}

function PlanFeature({ children }: { children: string }) {
  return (
    <li className="flex gap-3 text-sm leading-6 text-ink-800/70">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#fff1f2] text-[10px] font-black text-[#ef7885]">
        ✓
      </span>
      {children}
    </li>
  );
}

function PlanCard({
  plan,
  busy,
  selected,
  onSelectPlan,
}: {
  plan: (typeof EVENT_PLANS)[number];
  busy: boolean;
  selected: boolean;
  onSelectPlan: (planCode: EventPlanCode) => void;
}) {
  return (
    <article
      className={[
        'relative flex h-full flex-col rounded-[1.8rem] border bg-white p-5 shadow-[0_16px_38px_rgba(96,60,36,0.06)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_26px_58px_rgba(96,60,36,0.13)] active:scale-[0.99]',
        plan.highlighted
          ? 'border-[#d9a94a] ring-4 ring-[#d9a94a]/10'
          : 'border-[#f1ddd1]',
      ].join(' ')}
    >
      {plan.highlighted ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d2a049] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_10px_24px_rgba(210,160,73,0.25)]">
          Mais escolhido
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-[-0.04em] text-ink-950">
            {plan.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-ink-800/62">
            {plan.description}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black tracking-[-0.06em] text-[#eb7d87]">
            {plan.priceLabel}
          </p>

          <p className="text-xs font-bold text-ink-800/42">
            /evento
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[1.2rem] border border-[#f1ddd1] bg-[#fffaf7] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c5922e]">
            Fotos
          </p>

          <p className="mt-2 text-sm font-black text-ink-950">
            {plan.photoLimitLabel}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[#f1ddd1] bg-[#fffaf7] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c5922e]">
            Armazenamento
          </p>

          <p className="mt-2 text-sm font-black text-ink-950">
            {plan.storageLabel}
          </p>
        </div>
      </div>

      <ul className="mt-5 flex-1 space-y-3">
        {plan.items.map((feature) => (
          <PlanFeature key={feature}>
            {feature}
          </PlanFeature>
        ))}
      </ul>

      <button
        type="button"
        disabled={busy}
        onClick={() => onSelectPlan(plan.code)}
        className={[
          'mt-6 inline-flex h-12 w-full items-center justify-center rounded-[1rem] px-5 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65',
          plan.highlighted
            ? 'bg-[linear-gradient(135deg,#f28e94,#eb7d87)] text-white shadow-[0_18px_40px_rgba(239,120,133,0.24)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(239,120,133,0.3)]'
            : 'border border-[#ead1c4] bg-white text-ink-900 shadow-[0_14px_32px_rgba(96,60,36,0.06)] hover:-translate-y-0.5 hover:bg-[#fff7f2]',
        ].join(' ')}
      >
        {busy && selected ? 'Atualizando valor...' : selected ? `${plan.name} selecionado` : `Escolher ${plan.name}`}
      </button>
    </article>
  );
}

export function EventPlanSelector({
  busy,
  selectedPlanCode,
  onSelectPlan,
}: EventPlanSelectorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {EVENT_PLANS.map((plan) => (
        <PlanCard
          key={plan.code}
          plan={plan}
          busy={busy}
          selected={selectedPlanCode === plan.code}
          onSelectPlan={onSelectPlan}
        />
      ))}
    </div>
  );
}
