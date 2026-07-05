import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { MemoraLogo } from '@/components/brand/memora-logo';
import { EmptyState } from '@/components/ui/empty-state';
import { EventUploadHeader } from '@/features/public/components/upload/event-upload-header';
import { GuestUploadCard } from '@/features/public/components/upload/guest-upload-card';
import { api } from '@/lib/api';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

function PublicUploadNotFoundState() {
  return (
    <div className="min-h-screen bg-[#fff8f3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <EmptyState
          title="Evento nao encontrado"
          description="Nao foi possivel encontrar a pagina de upload deste evento."
        />
      </div>
    </div>
  );
}

function PublicUploadLoadingState() {
  return (
    <div className="min-h-screen bg-[#fff8f3] px-4 py-6 text-[#201914] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <div className="h-12 w-44 animate-pulse rounded-2xl bg-white/80" />
        <div className="h-[420px] animate-pulse rounded-[28px] border border-[#f1ddd1] bg-white/70 shadow-[0_24px_70px_rgba(96,60,36,0.06)]" />
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="h-[620px] animate-pulse rounded-[24px] border border-[#f1ddd1] bg-white/70" />
          <div className="h-[620px] animate-pulse rounded-[24px] border border-[#f1ddd1] bg-white/70" />
        </div>
      </div>
    </div>
  );
}

export function PublicUploadPage() {
  const { slug } = useParams();

  const [event, setEvent] = useState<EventSummary | null>(null);
  const [previewPhotos, setPreviewPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    let active = true;

    async function loadEvent() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const [eventData, photoPage] = await Promise.all([
          api.getPublicEvent(slug),
          api.listPublicEventPhotosPage(slug, 0, 3),
        ]);

        if (active) {
          setEvent(eventData);
          setPreviewPhotos(photoPage.content);
        }
      } catch {
        if (active) {
          setEvent(null);
          setPreviewPhotos([]);
        }
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
  }, [slug]);

  function handleClearFile() {
    setFile(null);
    setInputKey((current) => current + 1);
  }

  async function handleSubmit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();

    if (!slug) {
      setError('Evento nao encontrado.');
      return;
    }

    if (!file) {
      setError('Selecione uma foto antes de enviar.');
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('guestName', guestName.trim());
      formData.append('guestMessage', guestMessage.trim());

      await api.uploadGuestPhoto(slug, formData);

      setGuestName('');
      setGuestMessage('');
      setFile(null);
      setInputKey((current) => current + 1);
      setSuccess(true);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel enviar a foto.');
    } finally {
      setBusy(false);
    }
  }

  if (!slug) return <PublicUploadNotFoundState />;
  if (loading) return <PublicUploadLoadingState />;
  if (!event) return <PublicUploadNotFoundState />;

  return (
    <div className="min-h-screen bg-[#fff8f3] px-4 py-6 text-[#201914] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <header className="flex items-center justify-between gap-4">
          <MemoraLogo />

          <Link
            to={`/e/${event.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#e8cfc1] bg-white px-5 text-sm font-bold text-[#201914] shadow-[0_12px_28px_rgba(96,60,36,0.06)] transition hover:bg-[#fff7f2]"
          >
            Ver galeria
          </Link>
        </header>

        <EventUploadHeader event={event} previewPhotos={previewPhotos} />

        <GuestUploadCard
          guestName={guestName}
          guestMessage={guestMessage}
          file={file}
          previewUrl={previewUrl}
          busy={busy}
          success={success}
          error={error}
          inputKey={inputKey}
          onGuestNameChange={(value) => {
            setGuestName(value);
            setSuccess(false);
          }}
          onGuestMessageChange={(value) => {
            setGuestMessage(value);
            setSuccess(false);
          }}
          onFileChange={(selectedFile) => {
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
          }}
          onClearFile={handleClearFile}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
