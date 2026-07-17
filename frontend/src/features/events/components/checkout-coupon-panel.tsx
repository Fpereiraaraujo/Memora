import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CheckoutCouponPanelProps {
  couponCode: string;
  disabled?: boolean;
  applying?: boolean;
  appliedCouponCode?: string | null;
  feedback?: string | null;
  error?: string | null;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

export function CheckoutCouponPanel({
  couponCode,
  disabled = false,
  applying = false,
  appliedCouponCode = null,
  feedback = null,
  error = null,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
}: CheckoutCouponPanelProps) {
  const hasAppliedCoupon = Boolean(appliedCouponCode);

  return (
    <div className="rounded-[1.8rem] border border-[#f0d8ca] bg-[linear-gradient(135deg,#fffaf7,#fff3ef)] p-5 shadow-[0_18px_42px_rgba(96,60,36,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d19a38]">
            Cupom
          </p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-ink-950">
            Tem um desconto?
          </h3>
          <p className="mt-2 text-sm leading-7 text-ink-800/64">
            Digite o cupom e valide antes de seguir para o pagamento.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Input
              value={couponCode}
              onChange={(event) => onCouponCodeChange(event.target.value)}
              placeholder="Ex.: FESTA10"
              maxLength={80}
              disabled={disabled || applying}
              className="h-12 bg-white"
            />

            <Button
              type="button"
              loading={applying}
              disabled={disabled || applying}
              onClick={onApplyCoupon}
              className="h-12 px-6"
            >
              Aplicar cupom
            </Button>

            {hasAppliedCoupon ? (
              <Button
                type="button"
                variant="outline"
                disabled={disabled || applying}
                onClick={onRemoveCoupon}
                className="h-12 px-6"
              >
                Remover
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {feedback ? (
        <div className="mt-4 rounded-[1.2rem] border border-[#d8eacc] bg-[#f6fff2] px-4 py-3 text-sm font-semibold text-[#2f7a3e]">
          {feedback}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-[1.2rem] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
          {error}
        </div>
      ) : null}
    </div>
  );
}
