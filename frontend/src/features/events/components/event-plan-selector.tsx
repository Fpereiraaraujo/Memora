import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EVENT_PLANS, type EventPlanPresentation } from '@/types/payment';
import type { EventPlanCode } from '@/types/event';

interface EventPlanSelectorProps {
  busy?: boolean;
  selectedPlanCode?: EventPlanCode | null;
  onSelectPlan: (planCode: EventPlanCode) => void;
}

function PlanCard({
  plan,
  busy,
  selectedPlanCode,
  onSelectPlan,
}: {
  plan: EventPlanPresentation;
  busy: boolean;
  selectedPlanCode?: EventPlanCode | null;
  onSelectPlan: (planCode: EventPlanCode) => void;
}) {
  const isSelected = selectedPlanCode === plan.code;

  return (
    <article
      className={[
        'relative overflow-hidden rounded-[1.9rem] border bg-white/92 p-6 shadow-[0_18px_44px_rgba(96,60,36,0.06)] transition',
        plan.highlighted ? 'border-[#e7c387] shadow-[0_24px_54px_rgba(210,160,73,0.12)]' : 'border-[#f0d8ca]',
        isSelected ? 'ring-4 ring-[#ef7885]/12' : '',
      ].join(' ')}
    >
      {plan.highlighted ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d2a049] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
          Mais escolhido
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-ink-900">
            {plan.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-800/66">{plan.description}</p>
        </div>

        <Badge tone={plan.highlighted ? 'premium' : 'accent'}>
          {plan.photoLimitLabel}
        </Badge>
      </div>

      <div className="mt-5 rounded-[1.4rem] border border-[#f3e3d8] bg-[#fffaf7] px-4 py-4">
        <p className="text-3xl font-black tracking-[-0.05em] text-[#eb7d87]">{plan.priceLabel}</p>
        <p className="mt-1 text-sm font-semibold text-ink-800/56">{plan.storageLabel} de armazenamento</p>
      </div>

      <ul className="mt-5 space-y-3">
        {plan.items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-ink-800/78">
            <span className="grid size-6 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        disabled={busy}
        onClick={() => onSelectPlan(plan.code)}
        className="mt-6 w-full py-4"
      >
        {busy && isSelected ? 'Abrindo checkout...' : `Escolher ${plan.name}`}
      </Button>
    </article>
  );
}

export function EventPlanSelector({
  busy = false,
  selectedPlanCode = null,
  onSelectPlan,
}: EventPlanSelectorProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {EVENT_PLANS.map((plan) => (
        <PlanCard
          key={plan.code}
          plan={plan}
          busy={busy}
          selectedPlanCode={selectedPlanCode}
          onSelectPlan={onSelectPlan}
        />
      ))}
    </div>
  );
}
