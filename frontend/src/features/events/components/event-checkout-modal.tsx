import { Card } from '@/components/ui/card';
import { EventPlanSelector } from '@/features/events/components/event-plan-selector';
import type { EventSummary, EventPlanCode } from '@/types/event';

interface EventCheckoutModalProps {
  event: EventSummary | null;
  busy?: boolean;
  error?: string | null;
  selectedPlanCode?: EventPlanCode | null;
  onClose: () => void;
  onSelectPlan: (planCode: EventPlanCode) => void;
}

export function EventCheckoutModal({
  event,
  busy = false,
  error = null,
  selectedPlanCode = null,
  onClose,
  onSelectPlan,
}: EventCheckoutModalProps) {
  if (!event) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#201914]/45 px-4 py-8 backdrop-blur-sm">
      <Card className="max-h-[92vh] w-full max-w-6xl overflow-y-auto border-[#f0d8ca] bg-[#fffaf7] p-0 shadow-[0_36px_120px_rgba(32,25,20,0.18)]">
        <div className="sticky top-0 z-10 border-b border-[#f3e4da] bg-[#fffaf7]/96 px-6 py-5 backdrop-blur sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#d19a38]">
                Ativar evento
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-ink-900">
                Escolha o plano de {event.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-800/68">
                O evento foi criado como rascunho. Agora falta escolher um plano e concluir o pagamento na InfinityPay para liberar QR Code, pagina publica e uploads dos convidados.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#ead1c4] bg-white text-lg font-bold text-ink-800 shadow-[0_12px_28px_rgba(96,60,36,0.06)] transition hover:bg-[#fff5f0]"
              aria-label="Fechar selecao de plano"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
          {error ? (
            <div className="rounded-[1.4rem] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
              {error}
            </div>
          ) : null}

          <div className="rounded-[1.7rem] border border-[#f0d8ca] bg-white px-5 py-4">
            <p className="text-sm font-bold text-ink-900">O que acontece depois do pagamento</p>
            <p className="mt-2 text-sm leading-7 text-ink-800/68">
              Assim que a InfinityPay confirmar o pagamento, o evento fica ativo automaticamente e o seu painel passa a liberar o QR Code, a pagina publica e o envio de fotos pelos convidados.
            </p>
          </div>

          <EventPlanSelector
            busy={busy}
            selectedPlanCode={selectedPlanCode}
            onSelectPlan={onSelectPlan}
          />
        </div>
      </Card>
    </div>
  );
}
