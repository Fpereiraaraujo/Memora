import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { EventForm } from '@/features/events/components/event-form';
import { EventCard } from '@/features/events/components/event-card';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import type { EventCreateRequest, EventSummary } from '@/types/event';

const defaultForm: EventCreateRequest = {
  type: 'WEDDING',
  title: '',
  eventDate: null,
  location: null,
};

export function DashboardPage() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EventCreateRequest>(defaultForm);

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
        }
      } catch (exception) {
        if (active) {
          setError(exception instanceof Error ? exception.message : 'Não foi possível carregar eventos');
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
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível criar o evento');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Painel do anfitrião"
          title={`Olá, ${user?.name ?? 'anfitrião'}. Vamos organizar a próxima memória?`}
          description="Crie eventos, pegue o QR code para impressão e acompanhe as fotos enviadas pelos convidados."
          action={
            <Link
              to="/app"
              className="inline-flex items-center justify-center rounded-2xl bg-white/8 px-4 py-2.5 text-sm font-semibold text-sand-50 transition hover:bg-white/12"
            >
              Atualizar
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">Novo evento</p>
              <h3 className="font-display text-2xl text-sand-50">Criar evento</h3>
            </div>
            <EventForm value={form} onChange={setForm} onSubmit={handleCreate} busy={busy} />
            {error ? <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
          </Card>

          <Card className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">Eventos</p>
              <h3 className="font-display text-2xl text-sand-50">Seus eventos</h3>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-[28px] bg-white/8" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <EmptyState
                title="Nenhum evento ainda"
                description="Assim que você criar o primeiro evento, ele aparece aqui com acesso ao QR code e à galeria privada."
              />
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
