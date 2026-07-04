import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { EventQrPanel } from '@/features/events/components/event-qr-panel';
import { PhotoGrid } from '@/features/events/components/photo-grid';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

export function EventDetailPage() {
  const { eventId } = useParams();
  const { token } = useAuth();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!token || !eventId) {
        return;
      }

      try {
        const [eventData, photoData] = await Promise.all([api.getEvent(token, eventId), api.listEventPhotos(token, eventId)]);
        if (active) {
          setEvent(eventData);
          setPhotos(photoData);
        }
      } catch (exception) {
        if (active) {
          setError(exception instanceof Error ? exception.message : 'Não foi possível carregar o evento');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [eventId, token]);

  const publicUrl = useMemo(() => (event ? `/e/${event.slug}` : ''), [event]);

  if (!eventId) {
    return (
      <AppShell>
        <EmptyState title="Evento não encontrado" description="O identificador do evento não foi informado." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Detalhe do evento"
          title={event?.title ?? 'Carregando evento'}
          description="Aqui você enxerga a página pública, o QR code e a galeria privada dos convidados."
          action={
            <Link
              to="/app"
              className="inline-flex items-center justify-center rounded-2xl bg-white/8 px-4 py-2.5 text-sm font-semibold text-sand-50 transition hover:bg-white/12"
            >
              Voltar ao dashboard
            </Link>
          }
        />

        {error ? (
          <Card className="border-rose-300/20 bg-rose-400/10 text-rose-100">{error}</Card>
        ) : loading || !event ? (
          <Card className="h-32 animate-pulse bg-white/8" />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-sand-100/45">{event.type}</p>
                    <h3 className="font-display text-2xl text-sand-50">{event.title}</h3>
                  </div>
                  <Badge tone={event.status === 'ACTIVE' ? 'success' : 'warning'}>{event.status}</Badge>
                </div>

                <div className="space-y-2 text-sm text-sand-100/72">
                  <p>
                    <span className="text-sand-100/45">Slug:</span> {event.slug}
                  </p>
                  <p>
                    <span className="text-sand-100/45">Data:</span> {event.eventDate ?? 'Sem data'}
                  </p>
                  <p>
                    <span className="text-sand-100/45">Local:</span> {event.location ?? 'Sem local'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-sand-100/72">
                  <p className="text-xs uppercase tracking-[0.24em] text-sand-100/45">Página pública</p>
                  <p className="mt-2 break-all font-mono text-xs text-sand-50">{publicUrl}</p>
                </div>
              </Card>

              <EventQrPanel eventId={event.id} publicUrl={publicUrl} />
            </div>

            <Card className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">Galeria privada</p>
                <h3 className="font-display text-2xl text-sand-50">Fotos dos convidados</h3>
              </div>

              <PhotoGrid
                photos={photos}
                loading={loading}
                emptyTitle="Nenhuma foto por enquanto"
                emptyDescription="Quando os convidados enviarem imagens pela página pública, elas vão aparecer aqui para o host."
              />
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
