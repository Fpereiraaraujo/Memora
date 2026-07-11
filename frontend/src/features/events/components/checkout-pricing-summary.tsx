import { Button } from '@/components/ui/button';
import { formatCentsToBrl } from '@/features/events/utils/format-cents-to-brl';
import { getEventPlanLabel, type EventPlanCode } from '@/types/event';
import type { EventCheckoutPreviewResponse } from '@/types/payment';

interface CheckoutPricingSummaryProps {
  preview: EventCheckoutPreviewResponse | null;
  selectedPlanCode: EventPlanCode | null;
  busy?: boolean;
  onContinue: () => void;
}

function SummaryRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={emphasized ? 'text-sm font-bold text-ink-950' : 'text-sm text-ink-800/64'}>
        {label}
      </span>
      <span className={emphasized ? 'text-lg font-black text-ink-950' : 'text-sm font-bold text-ink-950'}>
        {value}
      </span>
    </div>
  );
}

export function CheckoutPricingSummary({
  preview,
  selectedPlanCode,
  busy = false,
  onContinue,
}: CheckoutPricingSummaryProps) {
  return (
    <div className="rounded-[1.8rem] border border-[#f0d8ca] bg-white/82 p-5 shadow-[0_18px_42px_rgba(96,60,36,0.05)] sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d19a38]">
        Resumo do pagamento
      </p>

      <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-ink-950">
        {selectedPlanCode ? getEventPlanLabel(selectedPlanCode) : 'Selecione um plano'}
      </h3>

      <div className="mt-5 space-y-4 rounded-[1.5rem] border border-[#f1ddd1] bg-[#fffaf7] p-4">
        {preview ? (
          <>
            <SummaryRow label="Preço original" value={formatCentsToBrl(preview.originalAmountCents)} />
            <SummaryRow label="Desconto" value={`- ${formatCentsToBrl(preview.discountAmountCents)}`} />
            <SummaryRow label="Valor final" value={formatCentsToBrl(preview.finalAmountCents)} emphasized />

            {preview.couponApplied && preview.couponCode ? (
              <div className="rounded-[1.15rem] border border-[#f7dec7] bg-[#fff7ef] px-4 py-3 text-sm font-semibold text-[#8f6228]">
                Cupom {preview.couponCode} aplicado{preview.discountPercent ? ` com ${preview.discountPercent}% de desconto.` : '.'}
              </div>
            ) : (
              <div className="rounded-[1.15rem] border border-[#efe1d8] bg-white px-4 py-3 text-sm text-ink-800/60">
                Sem cupom aplicado no momento.
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[1.15rem] border border-dashed border-[#e7d5c9] bg-white px-4 py-6 text-sm text-ink-800/60">
            Escolha um plano para visualizar o valor final antes de seguir.
          </div>
        )}
      </div>

      <Button
        type="button"
        disabled={!preview || busy}
        onClick={onContinue}
        className="mt-5 h-12 w-full"
      >
        {busy ? 'Abrindo checkout...' : 'Ir para pagamento'}
      </Button>
    </div>
  );
}
