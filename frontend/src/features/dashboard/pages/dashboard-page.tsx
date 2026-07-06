import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { useAuth } from '@/features/auth/auth-context';
import { EventCard } from '@/features/events/components/event-card';
import { EventForm } from '@/features/events/components/event-form';
import { buildEventOverviewPath } from '@/features/events/utils/event-routes';
import { buildMockEvents } from '@/features/events/utils/event-dashboard-mock';
import { api } from '@/lib/api';
import type { EventCreateRequest, EventSummary } from '@/types/event';

const defaultForm: EventCreateRequest = {
  type: 'WEDDING',
  title: '',
  eventDate: null,
  location: null,
};

const EVENTS_PER_PAGE = 4;

function formatFirstName(name?: string | null) {
  if (!name) {
    return 'Anfitrião';
  }

  return name.split(' ')[0] || name;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EventCreateRequest>(defaultForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [mockMode, setMockMode] = useState(false);

  const stats = useMemo(() => {
    const activeEvents = events.filter((event) => event.status === 'ACTIVE').length;
    const draftEvents = events.filter((event) => event.status === 'DRAFT').length;

    return [
      {
        label: 'Eventos',
        value: events.length,
        description: 'criados na sua conta',
        icon: '♡',
      },
      {
        label: 'Ativos',
        value: activeEvents,
        description: 'prontos para receber fotos',
        icon: '✦',
      },
      {
        label: 'Rascunhos',
        value: draftEvents,
        description: 'aguardando publicação',
        icon: '◌',
      },
    ];
  }, [events]);

  const totalPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE));

  const visibleEvents = useMemo(() => {
    const start = (currentPage - 1) * EVENTS_PER_PAGE;
    return events.slice(start, start + EVENTS_PER_PAGE);
  }, [currentPage, events]);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      if (!token) {
        return;
      }

      try {
        const data = await api.listEvents(token);

        if (active) {
          setEvents(data);
          setMockMode(false);
        }
      } catch {
        if (active) {
          setEvents(buildMockEvents());
          setMockMode(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      active = false;
    };
  }, [token]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const created = await api.createEvent(token, form);
      setEvents((current) => [created, ...current]);
      setForm(defaultForm);
      setMockMode(false);
      setCurrentPage(1);
      navigate(buildEventOverviewPath(created.id));
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível criar o evento',
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
        <section className="relative overflow-hidden rounded-[2.8rem] border border-[#f0d8ca] bg-white/62 p-6 shadow-[0_26px_86px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#f4a1aa]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-[#d8a84f]/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/75 px-4 py-2 text-xs font-semibold text-[#b87955] shadow-[0_12px_28px_rgba(96,60,36,0.06)] backdrop-blur">
                <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
                  ♥
                </span>
                Meus eventos
              </div>

              <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-ink-900 md:text-6xl">
                {formatFirstName(user?.name)}, vamos organizar as memórias do seu evento?
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-800/72 md:text-base">
                Crie seu evento e abra o hub principal para acompanhar QR Code, uploads, galeria, favoritas, downloads e recados em um só lugar.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#novo-evento"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#ef7885] px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
                >
                  Criar evento
                  <span aria-hidden="true">→</span>
                </a>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white/75 px-6 py-3.5 text-sm font-bold text-ink-900 shadow-[0_18px_40px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Ver site público
                </Link>
              </div>

              {mockMode ? (
                <p className="mt-4 text-sm font-semibold text-[#c5922e]">
              Exibindo dados demonstrativos. Links públicos e upload ficam liberados para teste pelo frontend.
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                'Cada evento recebe um painel próprio com visão geral e página pública.',
                'O QR Code pode ser baixado e compartilhado com convidados em segundos.',
                'Galeria, curtidas, downloads e recados ficam separados por área.',
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-[2rem] border border-[#f0d8ca] bg-white/72 p-5 shadow-[0_16px_46px_rgba(96,60,36,0.06)]"
                >
                  <div className="mb-4 grid size-10 place-items-center rounded-2xl bg-[#fff1f2] text-sm font-bold text-[#ef7885]">
                    0{index + 1}
                  </div>

                  <p className="text-sm leading-7 text-ink-800/72">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="relative overflow-hidden border-[#f0d8ca] bg-white/72"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-[#f4a1aa]/16 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9852f]">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-ink-900">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-ink-800/62">{stat.description}</p>
                </div>

                <div className="grid size-12 place-items-center rounded-2xl bg-[#fff1f2] text-xl text-[#ef7885]">
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card id="novo-evento" className="space-y-5 border-[#f0d8ca] bg-white/72">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b9852f]">
                Novo evento
              </p>

              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-ink-900">
                Crie um novo espaço para memórias
              </h2>

              <p className="mt-3 text-sm leading-7 text-ink-800/70">
                Comece com nome, data e local. Depois disso, você abre o hub do evento para revisar o QR Code, link público, galeria, favoritas, downloads e recados.
              </p>
            </div>

            <EventForm
              value={form}
              onChange={setForm}
              onSubmit={handleCreate}
              busy={busy}
            />

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
                {error}
              </div>
            ) : null}
          </Card>

          <Card className="space-y-5 border-[#f0d8ca] bg-white/72">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b9852f]">
                  Eventos criados
                </p>

                <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-ink-900">
                  Seus eventos
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-ink-800/70">
                  Abra um evento para visualizar o painel, QR Code, galeria completa, favoritas, downloads e todos os recados enviados.
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#fff3e6] px-4 py-2 text-xs font-bold text-[#c5922e]">
                Página {currentPage} de {totalPages}
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-44 animate-pulse rounded-[2rem] bg-white/55"
                  />
                ))}
              </div>
            ) : events.length === 0 ? (
              <EmptyState
                title="Nenhum evento ainda"
                description="Assim que você criar o primeiro evento, ele aparece aqui com QR Code, página pública e painel privado."
              />
            ) : (
              <>
                <div className="grid gap-4">
                  {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} publicLinksEnabled />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
