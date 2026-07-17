import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/features/auth/auth-context';
import { CheckoutCouponPanel } from '@/features/events/components/checkout-coupon-panel';
import { CheckoutPricingSummary } from '@/features/events/components/checkout-pricing-summary';
import { EventPlanSelector } from '@/features/events/components/event-plan-selector';
import { useCheckoutPreview } from '@/features/events/hooks/use-checkout-preview';
import {
  buildEventOverviewPath,
  buildEventQrPath,
} from '@/features/events/utils/event-routes';
import { api } from '@/lib/api';
import type { EventPlanCode, EventSummary } from '@/types/event';
import type { EventCheckoutStatusResponse } from '@/types/payment';

function formatDate(date: string | null) {
  if (!date) {
    return 'Data a confirmar';
  }

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function getPlanLabel(planCode?: string | null) {
  const labels: Record<string, string> = {
    ESSENTIAL: 'Essencial',
    EVENT: 'Evento',
    PREMIUM: 'Premium',
  };

  if (!planCode) {
    return 'Aguardando escolha';
  }

  return labels[planCode] ?? planCode;
}

function CheckoutHeader({
  event,
  onBackHref,
}: {
  event: EventSummary | null;
  onBackHref: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#f0d8ca] bg-white/86 p-5 shadow-[0_22px_70px_rgba(96,60,36,0.08)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#f4a1aa]/14 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-[#d8a84f]/14 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/88 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b87955] shadow-[0_12px_28px_rgba(96,60,36,0.06)]">
            <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
              ♥
            </span>
            Ativação do evento
          </div>

          <h1 className="font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.06em] text-ink-950 sm:text-5xl lg:text-6xl">
            Escolha o plano ideal para liberar sua galeria
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-800/68 sm:text-base sm:leading-8">
            Agora você pode validar um cupom antes de seguir. O valor final mostrado aqui
            sempre vem do backend e o pagamento só libera o evento após confirmação.
          </p>
        </div>

        <Link
          to={onBackHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-6 text-sm font-bold text-ink-900 shadow-[0_18px_40px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5 hover:bg-[#fff7f2] active:scale-[0.98] sm:w-fit"
        >
          Voltar
        </Link>
      </div>

      {event ? (
        <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.35rem] border border-[#f1ddd1] bg-white/78 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c5922e]">
              Evento
            </p>
            <p className="mt-2 line-clamp-2 text-lg font-black leading-6 text-ink-950">
              {event.title}
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-[#f1ddd1] bg-white/78 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c5922e]">
              Data
            </p>
            <p className="mt-2 text-lg font-black text-ink-950">
              {formatDate(event.eventDate)}
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-[#f1ddd1] bg-white/78 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c5922e]">
              Plano atual
            </p>
            <p className="mt-2 text-lg font-black text-ink-950">
              {getPlanLabel(event.planCode)}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function CheckoutSummaryCard({ event }: { event: EventSummary }) {
  return (
    <Card className="rounded-[2rem] border-[#f0d8ca] bg-white/78 p-0">
      <div className="overflow-hidden rounded-[2rem]">
        <div className="bg-[linear-gradient(135deg,#fff1f2,#fff8ef)] p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">
            Resumo do evento
          </p>

          <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-0.05em] text-ink-950">
            {event.title}
          </h2>

          <div className="mt-5 space-y-3 text-sm text-ink-800/70">
            <div className="flex items-start gap-3 rounded-[1.2rem] border border-[#f1ddd1] bg-white/74 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff1f2] text-[#ef7885]">
                ○
              </span>

              <div>
                <p className="font-black text-ink-950">Quando acontece</p>
                <p className="mt-1">{formatDate(event.eventDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-[1.2rem] border border-[#f1ddd1] bg-white/74 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff8ef] text-[#d19a38]">
                ⌂
              </span>

              <div>
                <p className="font-black text-ink-950">Local</p>
                <p className="mt-1">{event.location || 'Local a confirmar'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 sm:p-7">
          <div className="rounded-[1.5rem] border border-[#f1ddd1] bg-[#fffaf7] p-5">
            <p className="text-sm font-black text-ink-950">O que será liberado</p>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-800/68">
              <li className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#fff1f2] text-[10px] font-black text-[#ef7885]">
                  ✓
                </span>
                Página pública para os convidados enviarem fotos.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#fff1f2] text-[10px] font-black text-[#ef7885]">
                  ✓
                </span>
                QR Code compartilhável para usar no evento.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#fff1f2] text-[10px] font-black text-[#ef7885]">
                  ✓
                </span>
                Galeria privada para organizar, favoritar e baixar memórias.
              </li>
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-[#f7dec7] bg-[#fff7ef] p-5 text-sm leading-7 text-[#8f6228]">
            O preview não cria cobrança nem reserva cupom. O cálculo será refeito novamente no checkout real.
          </div>
        </div>
      </div>
    </Card>
  );
}

function ActivePlanCard({ event }: { event: EventSummary }) {
  return (
    <Card className="rounded-[2rem] border-[#cfead4] bg-[#f6fff7] p-6 shadow-[0_22px_60px_rgba(47,122,62,0.08)] sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#2f7a3e] shadow-[0_12px_28px_rgba(47,122,62,0.08)]">
            <span className="grid size-5 place-items-center rounded-full bg-[#e4f8e8] text-[#2f7a3e]">
              ✓
            </span>
            Plano ativo
          </div>

          <h2 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.05em] text-[#1d3d25]">
            Seu evento já está liberado
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#2f7a3e]/80">
            O plano {getPlanLabel(event.planCode)} já está ativo para este evento.
            Agora você pode abrir o painel ou acessar o QR Code para compartilhar com os convidados.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-fit lg:flex-col xl:flex-row">
          <Link
            to={buildEventOverviewPath(event.id)}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#bfe4c5] bg-white px-6 text-sm font-bold text-[#1d3d25] shadow-[0_18px_40px_rgba(47,122,62,0.08)] transition hover:-translate-y-0.5 hover:bg-[#fbfffb] active:scale-[0.98]"
          >
            Abrir painel
          </Link>

          <Link
            to={buildEventQrPath(event.id)}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f7a3e] px-6 text-sm font-bold text-white shadow-[0_18px_40px_rgba(47,122,62,0.18)] transition hover:-translate-y-0.5 hover:bg-[#276934] active:scale-[0.98]"
          >
            Ver QR Code
          </Link>
        </div>
      </div>
    </Card>
  );
}

function PendingPaymentCard({
  event,
  checkoutStatus,
  onRefresh,
  refreshing,
}: {
  event: EventSummary;
  checkoutStatus: EventCheckoutStatusResponse;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <Card className="rounded-[2rem] border-[#f7dec7] bg-[#fffaf4] p-6 shadow-[0_22px_60px_rgba(209,154,56,0.10)] sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#b87955] shadow-[0_12px_28px_rgba(96,60,36,0.08)]">
            <span className="grid size-5 place-items-center rounded-full bg-[#fff4ef] text-[#d19a38]">
              ○
            </span>
            Pagamento em análise
          </div>

          <h2 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.05em] text-ink-950">
            Estamos aguardando a confirmação
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-800/72">
            Assim que o pagamento do plano {getPlanLabel(checkoutStatus.planCode)} for confirmado,
            o evento {event.title} será liberado automaticamente.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-fit">
          {checkoutStatus.checkoutUrl ? (
            <a
              href={checkoutStatus.checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-6 text-sm font-bold text-ink-900 shadow-[0_18px_40px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5 hover:bg-[#fff7f2] active:scale-[0.98]"
            >
              Abrir checkout
            </a>
          ) : null}

          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-6 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {refreshing ? 'Atualizando...' : 'Atualizar status'}
          </button>
        </div>
      </div>
    </Card>
  );
}

const CHECKOUT_STATUS_POLL_INTERVAL_MS = 60_000;
const MAX_CHECKOUT_STATUS_POLLS = 10;

function FailedPaymentCard({
  status,
}: {
  status: NonNullable<EventCheckoutStatusResponse['status']>;
}) {
  const messageMap: Record<string, string> = {
    FAILED: 'Não foi possível confirmar o pagamento desta tentativa.',
    MANUAL_REVIEW: 'Encontramos uma divergência nesta cobrança e o pagamento foi enviado para revisão manual.',
    REJECTED: 'O pagamento foi recusado. Você pode escolher o plano novamente.',
    CANCELLED: 'O checkout foi cancelado. Se quiser, escolha um plano novamente.',
    EXPIRED: 'O checkout expirou. Gere uma nova tentativa para seguir.',
  };

  return (
    <div className="mb-5 rounded-[1.4rem] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
      {messageMap[status] ?? 'Não foi possível concluir este pagamento.'}
    </div>
  );
}

function CheckoutWorkspace({
  busy,
  error,
  selectedPlanCode,
  couponCode,
  appliedCouponCode,
  preview,
  previewing,
  applyingCoupon,
  couponFeedback,
  couponError,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  onSelectPlan,
  onContinue,
}: {
  busy: boolean;
  error: string | null;
  selectedPlanCode: EventPlanCode | null;
  couponCode: string;
  appliedCouponCode: string | null;
  preview: import('@/types/payment').EventCheckoutPreviewResponse | null;
  previewing: boolean;
  applyingCoupon: boolean;
  couponFeedback: string | null;
  couponError: string | null;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onSelectPlan: (planCode: EventPlanCode) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-[1.4rem] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
          {error}
        </div>
      ) : null}

      <Card className="rounded-[2rem] border-[#f0d8ca] bg-white/78 p-5 shadow-[0_22px_70px_rgba(96,60,36,0.08)] sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">
            Escolha seu plano
          </p>

          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-ink-950">
            Revise o valor antes de pagar
          </h2>

          <p className="mt-3 text-sm leading-7 text-ink-800/64">
            Primeiro escolha o plano, depois valide um cupom se quiser. O valor final sempre será recalculado pelo backend no checkout real.
          </p>
        </div>

        <EventPlanSelector
          busy={busy || previewing}
          selectedPlanCode={selectedPlanCode}
          onSelectPlan={onSelectPlan}
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <CheckoutCouponPanel
            couponCode={couponCode}
            disabled={!selectedPlanCode}
            applying={applyingCoupon}
            appliedCouponCode={appliedCouponCode}
            feedback={couponFeedback}
            error={couponError}
            onCouponCodeChange={onCouponCodeChange}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
          />

          <CheckoutPricingSummary
            preview={preview}
            selectedPlanCode={selectedPlanCode}
            busy={busy}
            onContinue={onContinue}
          />
        </div>
      </Card>
    </div>
  );
}

function CheckoutHelpCard() {
  return (
    <div className="rounded-[2rem] border border-[#f1ddd1] bg-white/78 p-6 shadow-[0_18px_44px_rgba(96,60,36,0.05)] sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#d19a38]">
        Como funciona
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ['1', 'Escolha do plano', 'Escolha a opção que combina com o seu evento.'],
          ['2', 'Validação do cupom', 'Veja o desconto antes de seguir, sem criar cobrança.'],
          ['3', 'Pagamento seguro', 'O valor final é recalculado no checkout e o evento só ativa após confirmação.'],
        ].map(([step, title, description]) => (
          <div
            key={step}
            className="rounded-[1.4rem] border border-[#f1ddd1] bg-[#fffaf7] p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_34px_rgba(96,60,36,0.08)] active:scale-[0.99]"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#fff1f2] text-sm font-black text-[#ef7885]">
              {step}
            </span>

            <p className="mt-4 text-sm font-black text-ink-950">{title}</p>
            <p className="mt-2 text-sm leading-6 text-ink-800/62">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventCheckoutPage() {
  const { token } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventSummary | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<EventCheckoutStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollAttemptsRef = useRef(0);

  const {
    selectedPlanCode,
    couponCode,
    appliedCouponCode,
    activeReferralCode,
    preview,
    previewing,
    applyingCoupon,
    couponFeedback,
    couponError,
    setCouponCode,
    selectPlan,
    applyCoupon,
    removeCoupon,
  } = useCheckoutPreview({
    token,
    eventId,
  });

  const hasActivePlan = useMemo(
    () => Boolean(event?.planCode && event?.status === 'ACTIVE'),
    [event],
  );

  useEffect(() => {
    let active = true;

    async function loadCheckoutContext(showLoader = true) {
      if (!token || !eventId) {
        if (showLoader) {
          setLoading(false);
        }
        return;
      }

      if (showLoader) {
        setLoading(true);
      }

      try {
        const [eventResponse, checkoutResponse] = await Promise.all([
          api.getEvent(token, eventId),
          api.getEventCheckoutStatus(token, eventId),
        ]);

        if (!active) {
          return;
        }

        setEvent(eventResponse);
        setCheckoutStatus(checkoutResponse);
        setError(null);
      } catch (exception) {
        if (!active) {
          return;
        }

        setError(
          exception instanceof Error
            ? exception.message
            : 'Não foi possível carregar este evento.',
        );
      } finally {
        if (active && showLoader) {
          setLoading(false);
        }
      }
    }

    void loadCheckoutContext(true);

    return () => {
      active = false;
    };
  }, [eventId, token]);

  useEffect(() => {
    if (!token || !eventId || checkoutStatus?.status !== 'PENDING' || hasActivePlan) {
      return;
    }

    pollAttemptsRef.current = 0;
    const intervalId = window.setInterval(() => {
      pollAttemptsRef.current += 1;
      if (pollAttemptsRef.current > MAX_CHECKOUT_STATUS_POLLS) {
        window.clearInterval(intervalId);
        return;
      }

      void api.getEventCheckoutStatus(token, eventId)
        .then((response) => {
          setCheckoutStatus(response);
          if (response.eventStatus === 'ACTIVE') {
            return api.getEvent(token, eventId).then(setEvent);
          }

          return undefined;
        })
        .catch(() => undefined);
    }, CHECKOUT_STATUS_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [checkoutStatus?.status, eventId, hasActivePlan, token]);

  async function handleRefreshStatus() {
    if (!token || !eventId) {
      return;
    }

    setBusy(true);
    try {
      const [eventResponse, checkoutResponse] = await Promise.all([
        api.getEvent(token, eventId),
        api.getEventCheckoutStatus(token, eventId),
      ]);

      setEvent(eventResponse);
      setCheckoutStatus(checkoutResponse);
      setError(null);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível atualizar o status do pagamento.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSelectPlan(planCode: EventPlanCode) {
    setError(null);

    try {
      await selectPlan(planCode);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível calcular o valor deste plano.',
      );
    }
  }

  async function handleApplyCoupon() {
    setError(null);
    await applyCoupon();
  }

  async function handleRemoveCoupon() {
    setError(null);
    await removeCoupon();
  }

  async function handleContinueToCheckout() {
    if (!token || !event || !selectedPlanCode) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const checkout = await api.createEventCheckout(token, event.id, {
        planCode: selectedPlanCode,
        couponCode: appliedCouponCode ?? undefined,
        referralCode: activeReferralCode ?? undefined,
      });

      setCheckoutStatus({
        paymentOrderId: checkout.paymentOrderId,
        status: checkout.status,
        planCode: checkout.planCode,
        eventStatus: event.status,
        paidAt: event.paidAt,
        checkoutUrl: checkout.checkoutUrl,
      });

      if (!checkout.checkoutUrl) {
        throw new Error('Não foi possível iniciar o checkout.');
      }

      window.location.assign(checkout.checkoutUrl);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível iniciar o checkout deste evento.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <CheckoutHeader
          event={event}
          onBackHref={event ? buildEventOverviewPath(event.id) : '/app'}
        />

        {loading ? (
          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <Card className="h-[520px] animate-pulse rounded-[2rem] border-[#f0d8ca] bg-white/72" />
            <Card className="h-[520px] animate-pulse rounded-[2rem] border-[#f0d8ca] bg-white/72" />
          </div>
        ) : !event ? (
          <EmptyState
            title="Evento não encontrado"
            description="Não foi possível localizar este evento para iniciar o checkout."
            action={(
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5"
              >
                Voltar para painel
              </button>
            )}
          />
        ) : hasActivePlan ? (
          <div className="space-y-6">
            <ActivePlanCard event={event} />
            <CheckoutHelpCard />
          </div>
        ) : checkoutStatus?.status === 'PENDING' ? (
          <div className="space-y-6">
            <PendingPaymentCard
              event={event}
              checkoutStatus={checkoutStatus}
              onRefresh={handleRefreshStatus}
              refreshing={busy}
            />

            <CheckoutWorkspace
              busy={busy}
              error={error}
              selectedPlanCode={selectedPlanCode}
              couponCode={couponCode}
              appliedCouponCode={appliedCouponCode}
              preview={preview}
              previewing={previewing}
              applyingCoupon={applyingCoupon}
              couponFeedback={couponFeedback}
              couponError={couponError}
              onCouponCodeChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onSelectPlan={handleSelectPlan}
              onContinue={handleContinueToCheckout}
            />

            <CheckoutHelpCard />
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-6">
              <CheckoutSummaryCard event={event} />
              <CheckoutHelpCard />
            </div>

            <div className="space-y-6">
              {checkoutStatus?.status && checkoutStatus.status !== 'APPROVED' ? (
                <FailedPaymentCard status={checkoutStatus.status} />
              ) : null}

              <CheckoutWorkspace
                busy={busy}
                error={error}
                selectedPlanCode={selectedPlanCode}
                couponCode={couponCode}
                appliedCouponCode={appliedCouponCode}
                preview={preview}
                previewing={previewing}
                applyingCoupon={applyingCoupon}
                couponFeedback={couponFeedback}
                couponError={couponError}
                onCouponCodeChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onSelectPlan={handleSelectPlan}
                onContinue={handleContinueToCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
