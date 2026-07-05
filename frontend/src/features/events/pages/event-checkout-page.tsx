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
            : 'Nao foi possivel carregar este evento.',
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
        throw new Error('A InfinityPay nao retornou um link de checkout para este evento.');
      }

      window.location.assign(checkout.checkoutUrl);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Nao foi possivel iniciar o checkout deste evento.',
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
        <section className="relative overflow-hidden rounded-[2.8rem] border border-[#f0d8ca] bg-white/72 p-6 shadow-[0_26px_86px_rgba(96,60,36,0.08)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[#f4a1aa]/18 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 size-72 rounded-full bg-[#f6d8b8]/30 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/88 px-4 py-2 text-xs font-semibold text-[#b87955] shadow-[0_12px_28px_rgba(96,60,36,0.06)]">
                <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
                  ♥
                </span>
                Ativacao do evento
              </div>

              <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-ink-900 md:text-6xl">
                Escolha o plano ideal para liberar o seu evento
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-800/72 md:text-base">
                Assim que o pagamento for aprovado, o evento fica ativo automaticamente e passa a liberar QR Code, pagina publica, uploads dos convidados, favoritas, downloads e recados.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={event ? buildEventOverviewPath(event.id) : '/app'}
                className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-6 py-3.5 text-sm font-bold text-ink-900 shadow-[0_18px_40px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5"
              >
                Voltar ao evento
              </Link>

              {event?.status === 'ACTIVE' ? (
                <Link
                  to={buildEventQrPath(event.id)}
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.28)] transition hover:-translate-y-0.5"
                >
                  Abrir QR Code
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {loading ? (
          <Card className="space-y-4 border-[#f0d8ca] bg-white/72">
            <div className="h-8 w-64 animate-pulse rounded-2xl bg-[#f7ece5]" />
            <div className="h-24 animate-pulse rounded-[2rem] bg-[#fff7f3]" />
            <div className="grid gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-[#fff7f3]" />
              ))}
            </div>
          </Card>
        ) : !event ? (
          <EmptyState
            title="Evento nao encontrado"
            description="Nao foi possivel localizar este evento para iniciar o checkout."
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
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
            <Card className="space-y-5 border-[#f0d8ca] bg-white/72">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">
                  Evento selecionado
                </p>

                <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-ink-900">
                  {event.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-ink-800/70">
                  {formatDate(event.eventDate)}
                  {event.location ? ` • ${event.location}` : ''}
                </p>
              </div>

              <div className="rounded-[1.7rem] border border-[#f0ddd0] bg-white/84 px-5 py-4 text-sm text-ink-800/72">
                <p>
                  <span className="font-bold text-ink-900">Slug publico:</span> {event.slug}
                </p>
                <p className="mt-2">
                  <span className="font-bold text-ink-900">Status atual:</span>{' '}
                  {event.status === 'ACTIVE' ? 'Ativo' : 'Rascunho'}
                </p>
              </div>

              {event.planCode ? (
                <div className="rounded-[1.7rem] border border-[#d9f0dc] bg-[#f5fff6] px-5 py-4 text-sm text-[#2f7a3e]">
                  Este evento ja possui um plano ativo. Se quiser, voce pode seguir para o painel ou abrir o QR Code.
                </div>
              ) : (
                <div className="rounded-[1.7rem] border border-[#f7dec7] bg-[#fff7ef] px-5 py-4 text-sm text-[#8f6228]">
                  O evento ainda esta em rascunho. Escolha um plano abaixo para liberar a pagina publica e o envio de fotos pelos convidados.
                </div>
              )}

              {error ? (
                <div className="rounded-[1.4rem] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
                  {error}
                </div>
              ) : null}
            </Card>

            <Card className="space-y-5 border-[#f0d8ca] bg-white/72">
              <div className="rounded-[1.7rem] border border-[#f0d8ca] bg-white px-5 py-4">
                <p className="text-sm font-bold text-ink-900">O que acontece depois do pagamento</p>
                <p className="mt-2 text-sm leading-7 text-ink-800/68">
                  A InfinityPay confirma o pagamento, o Memora ativa o evento automaticamente e o seu painel libera QR Code, link de upload, galeria privada e compartilhamento com convidados.
                </p>
              </div>

              {event.planCode ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={buildEventOverviewPath(event.id)}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-6 py-3.5 text-sm font-bold text-ink-900 shadow-[0_18px_40px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5"
                  >
                    Abrir painel do evento
                  </Link>

                  <Link
                    to={buildEventQrPath(event.id)}
                    className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.28)] transition hover:-translate-y-0.5"
                  >
                    Ver QR Code
                  </Link>
                </div>
              ) : (
                <EventPlanSelector
                  busy={busy}
                  selectedPlanCode={selectedPlanCode}
                  onSelectPlan={handleSelectPlan}
                />
              )}
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
