import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/features/auth/auth-context';
import { EventPlanSelector } from '@/features/events/components/event-plan-selector';
import {
  buildEventOverviewPath,
  buildEventQrPath,
} from '@/features/events/utils/event-routes';
import { api } from '@/lib/api';
import type { EventPlanCode, EventSummary } from '@/types/event';

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
            Após o pagamento aprovado, o QR Code e a página pública ficam prontos para receber fotos dos convidados.
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
                ◌
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
            <p className="text-sm font-black text-ink-950">
              O que será liberado
            </p>

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
            Você paga uma vez por evento. O plano define o limite de fotos e o tempo de armazenamento.
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
            O plano {getPlanLabel(event.planCode)} já está ativo para este evento. Você pode abrir o painel ou acessar o QR Code para compartilhar com os convidados.
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

function CheckoutHelpCard() {
  return (
    <div className="rounded-[2rem] border border-[#f1ddd1] bg-white/78 p-6 shadow-[0_18px_44px_rgba(96,60,36,0.05)] sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#d19a38]">
        Depois do checkout
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ['1', 'Pagamento aprovado', 'O provedor confirma o pagamento com segurança.'],
          ['2', 'Evento liberado', 'O plano é aplicado e o QR Code fica disponível.'],
          ['3', 'Convidados enviam fotos', 'A página pública começa a receber memórias.'],
        ].map(([step, title, description]) => (
          <div
            key={step}
            className="rounded-[1.4rem] border border-[#f1ddd1] bg-[#fffaf7] p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_34px_rgba(96,60,36,0.08)] active:scale-[0.99]"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#fff1f2] text-sm font-black text-[#ef7885]">
              {step}
            </span>

            <p className="mt-4 text-sm font-black text-ink-950">
              {title}
            </p>

            <p className="mt-2 text-sm leading-6 text-ink-800/62">
              {description}
            </p>
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
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState<EventPlanCode | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEvent() {
      if (!token || !eventId) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getEvent(token, eventId);

        if (!active) {
          return;
        }

        setEvent(data);
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
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      active = false;
    };
  }, [eventId, token]);

  async function handleSelectPlan(planCode: EventPlanCode) {
    if (!token || !event) {
      return;
    }

    setBusy(true);
    setError(null);
    setSelectedPlanCode(planCode);

    try {
      const checkout = await api.createEventCheckout(token, event.id, { planCode });

      if (!checkout.checkoutUrl) {
        throw new Error('A InfinitePay não retornou um link de checkout para este evento.');
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
        ) : event.planCode ? (
          <div className="space-y-6">
            <ActivePlanCard event={event} />
            <CheckoutHelpCard />
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-6">
              <CheckoutSummaryCard event={event} />
              <CheckoutHelpCard />
            </div>

            <Card className="rounded-[2rem] border-[#f0d8ca] bg-white/78 p-5 shadow-[0_22px_70px_rgba(96,60,36,0.08)] sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">
                  Escolha seu plano
                </p>

                <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-ink-950">
                  Libere seu evento
                </h2>

                <p className="mt-3 text-sm leading-7 text-ink-800/64">
                  Selecione uma opção abaixo para seguir para o checkout seguro.
                </p>
              </div>

              {error ? (
                <div className="mb-5 rounded-[1.4rem] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
                  {error}
                </div>
              ) : null}

              <EventPlanSelector
                busy={busy}
                selectedPlanCode={selectedPlanCode}
                onSelectPlan={handleSelectPlan}
              />
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}