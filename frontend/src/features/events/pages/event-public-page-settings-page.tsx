import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth/auth-context';
import {
  ExternalIcon,
  ImagesIcon,
} from '@/features/events/components/event-dashboard/event-icons';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import { buildEventOverviewPath } from '@/features/events/utils/event-routes';
import {
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_HIGHLIGHT_IMAGES,
  MAX_PUBLIC_MESSAGE_LENGTH,
  MAX_PUBLIC_TITLE_LENGTH,
  validateCustomizationInput,
} from '@/features/shared/utils/upload-validation';
import {
  mergePublicPageCustomization,
} from '@/features/public/utils/public-page-customization';
import { api } from '@/lib/api';
import type { PublicPageCustomization } from '@/types/customization';

interface SettingsFormState {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
  coverImageUrl: string | null;
  highlightImageUrls: string[];
}

function createLocalPreviewUrls(files: File[]) {
  return files.map((file) => URL.createObjectURL(file));
}

export function EventPublicPageSettingsPage() {
  const { eventId } = useParams();
  const { token } = useAuth();
  const dashboard = useEventDashboard(eventId);
  const event = dashboard.event;

  const [form, setForm] = useState<SettingsFormState | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [highlightFiles, setHighlightFiles] = useState<File[]>([]);
  const [loadingCustomization, setLoadingCustomization] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coverPreviewUrl = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : null),
    [coverFile],
  );

  const highlightPreviewUrls = useMemo(
    () => createLocalPreviewUrls(highlightFiles),
    [highlightFiles],
  );

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  useEffect(() => {
    return () => {
      highlightPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [highlightPreviewUrls]);

  useEffect(() => {
    let active = true;

    async function loadCustomization() {
      if (!event) {
        return;
      }

      setLoadingCustomization(true);
      setError(null);

      const fallback = mergePublicPageCustomization(event, null);

      try {
        const backendCustomization = token
          ? await api.getEventPublicPageCustomization(token, event.id)
          : null;

        const resolved = mergePublicPageCustomization(event, backendCustomization as PublicPageCustomization | null);

        if (active) {
          setForm({
            title: resolved.title,
            eventDate: resolved.eventDate,
            welcomeMessage: resolved.welcomeMessage,
            coverImageUrl: resolved.coverImageUrl,
            highlightImageUrls: resolved.highlightImageUrls,
          });
        }
      } catch {
        if (active) {
          setForm({
            title: fallback.title,
            eventDate: fallback.eventDate,
            welcomeMessage: fallback.welcomeMessage,
            coverImageUrl: fallback.coverImageUrl,
            highlightImageUrls: fallback.highlightImageUrls,
          });
        }
      } finally {
        if (active) {
          setLoadingCustomization(false);
        }
      }
    }

    void loadCustomization();

    return () => {
      active = false;
    };
  }, [event, token]);

  function updateForm(partial: Partial<SettingsFormState>) {
    setForm((current) => (current ? { ...current, ...partial } : current));
    setSaved(false);
    setError(null);
  }

  function addHighlightFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    setHighlightFiles((current) => {
      const existingKeys = new Set(current.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const next = [...current];

      for (const file of files) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;

        if (!existingKeys.has(key) && next.length < MAX_HIGHLIGHT_IMAGES) {
          next.push(file);
          existingKeys.add(key);
        }
      }

      return next;
    });
    setSaved(false);
    setError(null);
  }

  function removeHighlightFile(index: number) {
    setHighlightFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setSaved(false);
  }

  async function handleSubmit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();

    if (!event || !token || !form) {
      setError('Não foi possível salvar. Faça login novamente e tente de novo.');
      return;
    }

    const validationErrors = validateCustomizationInput({
      title: form.title,
      welcomeMessage: form.welcomeMessage,
      coverFile,
      highlightFiles,
    });

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const updated = await api.updateEventPublicPageCustomization(token, event.id, {
        title: form.title.trim(),
        eventDate: form.eventDate,
        welcomeMessage: form.welcomeMessage.trim(),
      });

      let nextCoverImageUrl = updated.coverImageUrl ?? form.coverImageUrl;
      let nextHighlightImageUrls = updated.highlightImageUrls ?? form.highlightImageUrls;

      if (coverFile) {
        const coverData = new FormData();
        coverData.append('file', coverFile);
        const coverResponse = await api.uploadEventPublicPageCoverImage(token, event.id, coverData);
        nextCoverImageUrl = coverResponse.coverImageUrl ?? nextCoverImageUrl;
      }

      if (highlightFiles.length > 0) {
        const highlightData = new FormData();
        highlightFiles.forEach((file) => highlightData.append('files', file));
        const highlightResponse = await api.uploadEventPublicPageHighlightImages(token, event.id, highlightData);
        nextHighlightImageUrls = highlightResponse.highlightImageUrls ?? nextHighlightImageUrls;
      }

      setForm({
        title: updated.title,
        eventDate: updated.eventDate,
        welcomeMessage: updated.welcomeMessage,
        coverImageUrl: nextCoverImageUrl,
        highlightImageUrls: nextHighlightImageUrls,
      });
      setCoverFile(null);
      setHighlightFiles([]);
      setSaved(true);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível salvar a personalização. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Evento não encontrado"
      emptyDescription="Não foi possível abrir a personalização da página pública."
    >
      {event && form ? (
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[28px] border border-[#f1ddd1] bg-white/92 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#f4a1aa]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-[#d8a84f]/18 blur-3xl" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Link
                  to={buildEventOverviewPath(event.id)}
                  className="mb-5 inline-flex h-11 items-center justify-center rounded-[14px] border border-[#e8cfc1] bg-white px-5 text-sm font-bold text-[#201914] transition hover:bg-[#fff7f2]"
                >
                  ← Voltar ao hub
                </Link>

                <p className="text-[15px] font-bold text-[#ef7885]">
                  Personalização da página pública
                </p>

                <h1 className="mt-2 max-w-4xl font-display text-[44px] font-semibold leading-none tracking-[-0.045em] text-[#161314] md:text-[56px]">
                  Controle o que os convidados vão ver
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#2c2927]/66">
                  Edite as informações e escolha as imagens que vão abrir a experiência pública dos convidados.
                </p>
              </div>

              <Link
                to={`/e/${event.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#d6a45a] bg-white px-6 text-sm font-bold text-[#b57b26] shadow-[0_14px_34px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5 hover:bg-[#fff8ef]"
              >
                Ver prévia pública
                <ExternalIcon className="size-4" />
              </Link>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
              <div>
                <h2 className="text-xl font-black text-[#161314]">Informações principais</h2>
                <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">
                  Ajuste o título, a data e a mensagem de boas-vindas que aparecem para os convidados.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">Nome dos noivos ou título do evento</span>
                <Input
                  value={form.title}
                  maxLength={MAX_PUBLIC_TITLE_LENGTH}
                  onChange={(inputEvent) => updateForm({ title: inputEvent.target.value })}
                  placeholder="Ex: Ana & Gabriel"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">Data do evento</span>
                <Input
                  type="date"
                  value={form.eventDate ?? ''}
                  onChange={(inputEvent) => updateForm({ eventDate: inputEvent.target.value || null })}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">Mensagem para os convidados</span>
                <Textarea
                  value={form.welcomeMessage}
                  maxLength={MAX_PUBLIC_MESSAGE_LENGTH}
                  onChange={(inputEvent) => updateForm({ welcomeMessage: inputEvent.target.value })}
                  placeholder="Escreva uma mensagem curta convidando as pessoas a enviarem fotos."
                />
                <span className="block text-right text-xs font-semibold text-[#2c2927]/45">
                  {form.welcomeMessage.length}/{MAX_PUBLIC_MESSAGE_LENGTH}
                </span>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block rounded-[18px] border border-dashed border-[#efb6bb] bg-[#fff7f7] p-4 transition hover:bg-white">
                  <span className="text-sm font-black text-[#161314]">Foto de capa</span>
                  <span className="mt-2 block text-xs leading-5 text-[#2c2927]/56">
                    Será usada como imagem principal da página pública.
                  </span>
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT_ATTRIBUTE}
                    className="mt-4 block w-full text-xs text-[#2c2927]/64"
                    onChange={(inputEvent) => {
                      setCoverFile(inputEvent.target.files?.[0] ?? null);
                      setSaved(false);
                      setError(null);
                    }}
                  />
                </label>

                <label className="block rounded-[18px] border border-dashed border-[#efb6bb] bg-[#fff7f7] p-4 transition hover:bg-white">
                  <span className="text-sm font-black text-[#161314]">Fotos em destaque</span>
                  <span className="mt-2 block text-xs leading-5 text-[#2c2927]/56">
                    Selecione até {MAX_HIGHLIGHT_IMAGES} fotos para abrir a experiência pública.
                  </span>
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT_ATTRIBUTE}
                    multiple
                    className="mt-4 block w-full text-xs text-[#2c2927]/64"
                    onChange={(inputEvent) => {
                      addHighlightFiles(Array.from(inputEvent.target.files ?? []));
                      inputEvent.target.value = '';
                    }}
                  />
                </label>
              </div>

              {(coverPreviewUrl || form.coverImageUrl) ? (
                <div className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[#161314]">Capa {coverPreviewUrl ? 'selecionada' : 'atual'}</p>
                    {coverPreviewUrl ? (
                      <button
                        type="button"
                        onClick={() => setCoverFile(null)}
                        className="rounded-[12px] border border-[#efb6bb] bg-white px-4 py-2 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
                      >
                        Remover prévia
                      </button>
                    ) : null}
                  </div>
                  <img src={coverPreviewUrl ?? form.coverImageUrl ?? ''} alt="Capa selecionada" className="mt-4 h-48 w-full rounded-[16px] object-cover" />
                </div>
              ) : null}

              {(highlightPreviewUrls.length > 0 || form.highlightImageUrls.length > 0) ? (
                <div className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
                  <p className="text-sm font-black text-[#161314]">
                    {highlightPreviewUrls.length > 0 ? 'Fotos selecionadas' : 'Fotos atuais'}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {(highlightPreviewUrls.length > 0 ? highlightPreviewUrls : form.highlightImageUrls).map((image, index) => (
                      <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-[14px] bg-[#f5ded2]">
                        <img src={image} alt={`Foto em destaque ${index + 1}`} className="h-full w-full object-cover" />
                        {highlightPreviewUrls.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => removeHighlightFile(index)}
                            className="absolute right-2 top-2 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-[#ef7885] shadow-[0_8px_20px_rgba(24,24,27,0.12)]"
                          >
                            Remover
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {highlightPreviewUrls.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setHighlightFiles([])}
                      className="mt-4 rounded-[12px] border border-[#efb6bb] bg-white px-4 py-2 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
                    >
                      Limpar fotos selecionadas
                    </button>
                  ) : null}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-[16px] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
                  {error}
                </div>
              ) : null}

              {saved ? (
                <div className="rounded-[16px] border border-[#c8e6c9] bg-[#f1fbf2] px-4 py-3 text-sm font-semibold text-[#3f8b46]">
                  Personalização salva. Abra a prévia pública para visualizar.
                </div>
              ) : null}

              <Button type="submit" disabled={saving || loadingCustomization} className="h-12 rounded-[14px]">
                {saving ? 'Salvando...' : 'Salvar personalização'}
              </Button>
            </form>

            <section className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#ef7885]">Prévia dos convidados</p>
                  <h2 className="mt-2 text-xl font-black text-[#161314]">Como a página vai aparecer</h2>
                  <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">
                    Esta área simula a primeira dobra da página pública como os convidados irão ver.
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-[16px] bg-[#fff1f2] text-[#ef7885]">
                  <ImagesIcon className="size-6" />
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[22px] border border-[#f1ddd1] bg-[#fffaf7] p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">Evento especial</p>
                    <h3 className="mt-3 font-display text-[42px] font-semibold leading-none tracking-[-0.05em] text-[#161314]">
                      {form.title || event.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#2c2927]/65">
                      {form.welcomeMessage}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(coverPreviewUrl || form.coverImageUrl) ? (
                      <img src={coverPreviewUrl ?? form.coverImageUrl ?? ''} alt="Prévia da capa" className="col-span-2 h-40 w-full rounded-[18px] object-cover" />
                    ) : (
                      <div className="col-span-2 h-40 rounded-[18px] bg-[#f9d7dc]" />
                    )}
                    {(highlightPreviewUrls.length > 0 ? highlightPreviewUrls : form.highlightImageUrls).slice(0, 2).map((image, index) => (
                      <img key={`${image}-${index}`} src={image} alt={`Destaque ${index + 1}`} className="h-28 w-full rounded-[16px] object-cover" />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </EventPageLayout>
  );
}
