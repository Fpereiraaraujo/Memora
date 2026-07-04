import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicShell } from '@/components/layout/public-shell';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { PhotoGrid } from '@/features/events/components/photo-grid';
import { PublicUploadForm } from '@/features/public/components/public-upload-form';
import { api } from '@/lib/api';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

export function PublicEventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!slug) {
        return;
      }

      try {
        const [eventData, photoData] = await Promise.all([api.getPublicEvent(slug), api.listPublicEventPhotos(slug)]);
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
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!slug || !file) {
      setError('Selecione uma foto para enviar');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('guestName', guestName);
      formData.append('guestMessage', guestMessage);
      await api.uploadGuestPhoto(slug, formData);

      const updatedPhotos = await api.listPublicEventPhotos(slug);
      setPhotos(updatedPhotos);
      setGuestName('');
      setGuestMessage('');
      setFile(null);
      setInputKey((current) => current + 1);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível enviar a foto');
    } finally {
      setBusy(false);
    }
  }

  if (!slug) {
    return (
      <PublicShell>
        <EmptyState title="Evento não encontrado" description="A URL pública está incompleta." />
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Página pública"
          title={event?.title ?? 'Carregando evento'}
          description="Essa é a página que os convidados acessam pelo QR code para enviar e ver as fotos do evento."
        />

        {error ? <Card className="border-rose-300/20 bg-rose-400/10 text-rose-100">{error}</Card> : null}

        {loading || !event ? (
          <Card className="h-36 animate-pulse bg-white/8" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-sand-100/45">{event.type}</p>
                <h3 className="font-display text-3xl text-sand-50">{event.title}</h3>
                <p className="text-sm text-sand-100/70">{event.location ?? 'Local não informado'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-sand-100/72">
                <p className="text-xs uppercase tracking-[0.24em] text-sand-100/45">Slug</p>
                <p className="mt-2 font-mono text-xs text-sand-50">{event.slug}</p>
              </div>
              <PublicUploadForm
                guestName={guestName}
                guestMessage={guestMessage}
                file={file}
                busy={busy}
                error={null}
                inputKey={inputKey}
                onGuestNameChange={setGuestName}
                onGuestMessageChange={setGuestMessage}
                onFileChange={setFile}
                onSubmit={handleSubmit}
              />
            </Card>

            <Card className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">Fotos públicas</p>
                <h3 className="font-display text-2xl text-sand-50">Galeria do evento</h3>
              </div>
              <PhotoGrid
                photos={photos}
                loading={loading}
                emptyTitle="Ainda não há fotos"
                emptyDescription="Assim que o primeiro convidado enviar uma imagem, ela aparece aqui."
              />
            </Card>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
