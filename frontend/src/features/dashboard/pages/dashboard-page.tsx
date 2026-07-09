import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/features/auth/auth-context';
import { EventForm } from '@/features/events/components/event-form';
import { buildEventOverviewPath } from '@/features/events/utils/event-routes';
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
    return 'Anfitriao';
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
          setError(exception instanceof Error ? exception.message : 'Nao foi possivel carregar seu evento.');
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
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel criar o evento.');
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

  if (existingEvent) {
    return <Navigate to={buildEventOverviewPath(existingEvent.id)} replace />;
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#f1ddd1] bg-white/88 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] sm:p-8">
          <p className="text-sm font-bold text-[#ef7885]">
            Ola, {formatFirstName(user?.name)}.
          </p>

          <h1 className="mt-3 font-display text-[46px] font-semibold leading-none tracking-[-0.055em] text-[#161314] sm:text-[58px]">
            Crie seu primeiro evento
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#2c2927]/68">
            Depois da criacao, voce vai direto para o painel do evento com QR Code, pagina publica, galeria e recados.
          </p>
        </section>

        {error ? (
          <div className="rounded-[18px] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[28px] bg-white/88">
            <p className="text-sm font-bold text-[#ef7885]">
              Novo evento
            </p>

            <h2 className="mt-2 font-display text-[38px] font-semibold leading-none tracking-[-0.045em] text-[#161314]">
              Dados principais
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#2c2927]/62">
              Preencha o basico para abrir seu painel.
            </p>

            <div className="mt-6">
              <EventForm value={form} onChange={setForm} onSubmit={handleCreateEvent} busy={busy} />
            </div>
          </Card>

          <Card className="rounded-[28px] bg-[linear-gradient(135deg,#fffaf7,#fff1f2_48%,#fff8ef)]">
            <EmptyState
              title="Seu evento fica pronto em seguida"
              description="Assim que criar, a Memora libera o painel com QR Code, pagina publica, upload dos convidados e galeria privada."
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Pagina publica', 'QR Code', 'Upload dos convidados', 'Galeria privada'].map((item) => (
                <div key={item} className="rounded-[18px] border border-[#f1ddd1] bg-white/76 p-4">
                  <p className="text-sm font-black text-[#161314]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
