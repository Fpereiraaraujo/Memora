import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/features/auth/auth-context';
import { EventForm } from '@/features/events/components/event-form';
import {
  buildEventGalleryPath,
  buildEventOverviewPath,
  buildEventPublicPageSettingsPath,
  buildEventQrPath,
} from '@/features/events/utils/event-routes';
import { api } from '@/lib/api';
import type { EventCreateRequest, EventSummary } from '@/types/event';

const defaultForm: EventCreateRequest = {
  type: 'WEDDING',
  title: '',
  eventDate: null,
  location: null,
};

function formatFirstName(name?: string | null) {
  if (!name) {
    return 'Anfitrião';
  }

  return name.split(' ')[0] || name;
}

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

function EventStatusBadge({ event }: { event: EventSummary }) {
  const labels: Record<string, string> = {
    DRAFT: 'Rascunho',
    ACTIVE: 'Ativo',
    PAUSED: 'Pausado',
    EXPIRED: 'Expirado',
  };

  return (
    <span className="inline-flex h-9 items-center rounded-full bg-[#fff3e6] px-4 text-xs font-bold text-[#c5922e]">
      {labels[event.status] ?? event.status}
    </span>
  );
}

function ExistingEventHub({ event }: { event: EventSummary }) {
  const actions = [
    {
      title: 'Abrir painel',
      description: 'Veja o resumo do evento, QR Code, recados e atalhos principais.',
      href: buildEventOverviewPath(event.id),
      primary: true,
    },
    {
      title: 'Personalizar página',
      description: 'Ajuste título, mensagem, capa e destaques que os convidados verão.',
      href: buildEventPublicPageSettingsPath(event.id),
    },
    {
      title: 'Ver QR Code',
      description: 'Baixe ou copie o link que será compartilhado no evento.',
      href: buildEventQrPath(event.id),
    },
    {
      title: 'Gerenciar fotos',
      description: 'Abra a galeria completa para visualizar, favoritar e organizar.',
      href: buildEventGalleryPath(event.id),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[28px] bg-white/88 p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-bold text-[#ef7885]">
                Seu evento principal
              </p>

              <EventStatusBadge event={event} />
            </div>

            <h1 className="mt-4 font-display text-[46px] font-semibold leading-none tracking-[-0.055em] text-[#161314] sm:text-[58px]">
              {event.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#2c2927]/62">
              <span>{formatDate(event.eventDate)}</span>

              {event.location ? (
                <>
                  <span>•</span>
                  <span>{event.location}</span>
                </>
              ) : null}
            </div>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#2c2927]/68">
              Como a Memora trabalha com um evento por conta, esta é sua central principal. Use os atalhos abaixo para personalizar a página, compartilhar o QR Code e acompanhar as fotos recebidas.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={buildEventOverviewPath(event.id)}
                className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#ef7885] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b] active:scale-[0.98]"
              >
                Abrir hub do evento
              </Link>

              <Link
                to={buildEventPublicPageSettingsPath(event.id)}
                className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#e8cfc1] bg-white px-6 text-sm font-bold text-[#201914] shadow-[0_12px_28px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5 hover:bg-[#fff7f2] active:scale-[0.98]"
              >
                Personalizar página
              </Link>
            </div>
          </div>

          <div className="bg-[linear-gradient(135deg,#fff1f2,#fff8ef)] p-6 sm:p-8">
            <div className="rounded-[24px] border border-[#f1ddd1] bg-white/84 p-5 shadow-[0_18px_44px_rgba(96,60,36,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c5922e]">
                Plano
              </p>

              <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#161314]">
                {event.planCode ?? 'Não ativado'}
              </p>

              <p className="mt-3 text-sm leading-7 text-[#2c2927]/62">
                {event.photoLimit
                  ? `Limite contratado: ${event.photoLimit} fotos.`
                  : 'Escolha um plano para liberar o evento completo.'}
              </p>

              <Link
                to={`/app/events/${event.id}/checkout`}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white transition hover:bg-[#e86d7b]"
              >
                Escolher plano
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className={[
              'rounded-[24px] border border-[#f1ddd1] bg-white/88 p-5 shadow-[0_16px_38px_rgba(96,60,36,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(96,60,36,0.12)] active:scale-[0.99]',
              action.primary ? 'ring-4 ring-[#ef7885]/8' : '',
            ].join(' ')}
          >
            <p className="text-lg font-black text-[#161314]">
              {action.title}
            </p>

            <p className="mt-3 text-sm leading-7 text-[#2c2927]/62">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EventCreateRequest>(defaultForm);

  const existingEvent = useMemo(() => events[0] ?? null, [events]);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.listEvents(token);

        if (active) {
          setEvents(data);
        }
      } catch (exception) {
        if (active) {
          setError(exception instanceof Error ? exception.message : 'Não foi possível carregar seu evento.');
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

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (existingEvent) {
      navigate(buildEventOverviewPath(existingEvent.id));
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const createdEvent = await api.createEvent(token, {
        ...form,
        type: 'WEDDING',
        title: form.title.trim(),
        location: form.location?.trim() || null,
      });

      setEvents([createdEvent]);
      navigate(buildEventOverviewPath(createdEvent.id));
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível criar o evento.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Card className="h-48 animate-pulse bg-white/60" />
          <Card className="h-96 animate-pulse bg-white/60" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#f1ddd1] bg-white/88 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] sm:p-8">
          <p className="text-sm font-bold text-[#ef7885]">
            Olá, {formatFirstName(user?.name)}.
          </p>

          <h1 className="mt-3 font-display text-[46px] font-semibold leading-none tracking-[-0.055em] text-[#161314] sm:text-[58px]">
            {existingEvent ? 'Gerencie seu evento' : 'Crie seu primeiro evento'}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#2c2927]/68">
            {existingEvent
              ? 'Acesse o hub principal para personalizar sua página pública, compartilhar o QR Code e acompanhar as fotos dos convidados.'
              : 'Crie o evento para liberar o hub da Memora. Depois você poderá personalizar a página, escolher o plano e compartilhar o QR Code.'}
          </p>
        </section>

        {error ? (
          <div className="rounded-[18px] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        ) : null}

        {existingEvent ? (
          <ExistingEventHub event={existingEvent} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[28px] bg-white/88">
              <p className="text-sm font-bold text-[#ef7885]">
                Novo evento
              </p>

              <h2 className="mt-2 font-display text-[38px] font-semibold leading-none tracking-[-0.045em] text-[#161314]">
                Dados principais
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#2c2927]/62">
                Por enquanto, cada conta Memora gerencia um único evento principal.
              </p>

              <div className="mt-6">
                <EventForm value={form} onChange={setForm} onSubmit={handleCreateEvent} busy={busy} />
              </div>
            </Card>

            <Card className="rounded-[28px] bg-[linear-gradient(135deg,#fffaf7,#fff1f2_48%,#fff8ef)]">
              <EmptyState
                title="Seu hub será criado em seguida"
                description="Depois de criar o evento, você será levado para a central principal com QR Code, página pública, galeria, recados e planos."
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Página pública', 'QR Code', 'Upload dos convidados', 'Galeria privada'].map((item) => (
                  <div key={item} className="rounded-[18px] border border-[#f1ddd1] bg-white/76 p-4">
                    <p className="text-sm font-black text-[#161314]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}