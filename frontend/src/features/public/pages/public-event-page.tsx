import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PublicShell } from '@/components/layout/public-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { CoupleHighlightsSection } from '@/features/public/components/event-page/couple-highlights-section';
import { PublicEventHero } from '@/features/public/components/event-page/public-event-hero';
import { PublicGallerySection } from '@/features/public/components/event-page/public-gallery-section';
import { GuestUploadCard } from '@/features/public/components/upload/guest-upload-card';
import { buildFallbackPublicEvent } from '@/features/public/utils/public-event-fallback';
import { mergePublicPageCustomization } from '@/features/public/utils/public-page-customization';
import { validateGuestUploadInput } from '@/features/shared/utils/upload-validation';
import { api } from '@/lib/api';
import type { PageResponse } from '@/types/api';
import type { PublicPageCustomization } from '@/types/customization';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

const PUBLIC_GALLERY_PAGE_SIZE = 12;

function emptyPhotoPage(page: number): PageResponse<Photo> {
  return {
    content: [],
    page,
    size: PUBLIC_GALLERY_PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
    last: true,
  };
}

function PublicEventNotFoundState() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-20">
        <EmptyState
          title="Evento não encontrado"
          description="Não foi possível encontrar a página pública deste evento."
        />
      </div>
    </PublicShell>
  );
}

function PublicEventLoadingState() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="h-[520px] animate-pulse rounded-[28px] border border-[#f1ddd1] bg-white/70 shadow-[0_24px_70px_rgba(96,60,36,0.06)]" />
          <div className="h-[280px] animate-pulse rounded-[28px] border border-[#f1ddd1] bg-white/70" />
          <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="h-[520px] animate-pulse rounded-[24px] border border-[#f1ddd1] bg-white/70" />
            <div className="h-[520px] animate-pulse rounded-[24px] border border-[#f1ddd1] bg-white/70" />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

export function PublicEventPage() {
  const { slug } = useParams();

  const [event, setEvent] = useState<EventSummary | null>(null);
  const [backendCustomization, setBackendCustomization] = useState<PublicPageCustomization | null>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const customization = useMemo(
    () => (event ? mergePublicPageCustomization(event, backendCustomization) : null),
    [backendCustomization, event],
  );

  const previewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  const guestCount = useMemo(() => {
    const guests = new Set(
      photos
        .map((photo) => photo.guestName?.trim())
        .filter((name): name is string => Boolean(name)),
    );

    return guests.size;
  }, [photos]);

  const highlightImages = useMemo(() => {
    if (!customization) {
      return [] as string[];
    }

    return customization.highlightImageUrls.filter(Boolean).slice(0, 5);
  }, [customization]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const eventData = await api.getPublicEvent(slug).catch(() => buildFallbackPublicEvent(slug));

        const [customizationData, photoPage] = await Promise.all([
          api.getPublicEventCustomization(slug).catch(() => null),
          api.listPublicEventPhotosPage(slug, currentPage - 1, PUBLIC_GALLERY_PAGE_SIZE).catch(() =>
            emptyPhotoPage(currentPage - 1),
          ),
        ]);

        if (active) {
          setEvent(eventData);
          setBackendCustomization(customizationData);
          setPhotos(photoPage.content);
          setTotalElements(photoPage.totalElements);
          setTotalPages(Math.max(1, photoPage.totalPages));
        }
      } catch {
        if (active) {
          setEvent(buildFallbackPublicEvent(slug));
          setBackendCustomization(null);
          setPhotos([]);
          setTotalElements(0);
          setTotalPages(1);
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
  }, [currentPage, slug]);

  async function refreshFirstGalleryPage(currentSlug: string) {
    const photoPage = await api
      .listPublicEventPhotosPage(currentSlug, 0, PUBLIC_GALLERY_PAGE_SIZE)
      .catch(() => emptyPhotoPage(0));

    setCurrentPage(1);
    setPhotos(photoPage.content);
    setTotalElements(photoPage.totalElements);
    setTotalPages(Math.max(1, photoPage.totalPages));
  }

  function handleClearFiles() {
    setFiles([]);
    setInputKey((current) => current + 1);
  }

  function handleRemoveFile(index: number) {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleFilesChange(selectedFiles: File[]) {
    setFiles((current) => [...current, ...selectedFiles]);
    setError(null);
    setSuccess(false);
    setSuccessMessage(null);
  }

  async function handleSubmit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();

    if (!slug) {
      setError('Evento não encontrado.');
      return;
    }

    if (!confirmed) {
      setError('Confirme que o conteúdo enviado é relacionado a este evento.');
      return;
    }

    const validationErrors = validateGuestUploadInput({ files, guestName, guestMessage });

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(false);
    setSuccessMessage(null);

    try {
      const trimmedName = guestName.trim();
      const trimmedMessage = guestMessage.trim();

      const formData = new FormData();

      files.forEach((file) => {
        formData.append('files', file);
      });

      if (files.length === 1) {
        formData.append('file', files[0]);
      }

      if (trimmedName) {
        formData.append('guestName', trimmedName);
      }

      if (trimmedMessage) {
        formData.append('guestMessage', trimmedMessage);
      }

      const response = await api.uploadGuestPhoto(slug, formData);
      const uploadedCount = response?.uploadedCount ?? files.length;

      setGuestName('');
      setGuestMessage('');
      setFiles([]);
      setInputKey((current) => current + 1);
      setConfirmed(false);
      setSuccess(true);
      setSuccessMessage(
        files.length === 0
          ? 'Recado enviado com sucesso. Obrigado por deixar sua mensagem para os anfitriões!'
          : uploadedCount > 1
            ? `${uploadedCount} fotos enviadas com sucesso. Obrigado por compartilhar esse momento!`
            : 'Foto enviada com sucesso. Obrigado por compartilhar esse momento!',
      );

      await refreshFirstGalleryPage(slug);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível enviar o conteúdo.');
    } finally {
      setBusy(false);
    }
  }

  if (!slug) {
    return <PublicEventNotFoundState />;
  }

  if (loading) {
    return <PublicEventLoadingState />;
  }

  if (!event || !customization) {
    return <PublicEventNotFoundState />;
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <PublicEventHero
            event={event}
            customization={customization}
            totalPhotos={totalElements}
            guestCount={guestCount}
          />

          <CoupleHighlightsSection images={highlightImages} />

          <GuestUploadCard
            guestName={guestName}
            guestMessage={guestMessage}
            files={files}
            previewUrls={previewUrls}
            busy={busy}
            success={success}
            successMessage={successMessage}
            error={error}
            inputKey={inputKey}
            confirmed={confirmed}
            onGuestNameChange={(value) => {
              setGuestName(value);
              setSuccess(false);
              setSuccessMessage(null);
              setError(null);
            }}
            onGuestMessageChange={(value) => {
              setGuestMessage(value);
              setSuccess(false);
              setSuccessMessage(null);
              setError(null);
            }}
            onFilesChange={handleFilesChange}
            onRemoveFile={handleRemoveFile}
            onClearFiles={handleClearFiles}
            onConfirmedChange={(value) => {
              setConfirmed(value);
              setError(null);
            }}
            onSubmit={handleSubmit}
          />

          <PublicGallerySection
            photos={photos}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </PublicShell>
  );
}