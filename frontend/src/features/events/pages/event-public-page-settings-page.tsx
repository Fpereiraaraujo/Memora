import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth/auth-context';
import { ExternalIcon } from '@/features/events/components/event-dashboard/event-icons';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { EventDecorativeImageEditor } from '@/features/events/components/public-page/event-decorative-image-editor';
import { EventThemeEditor } from '@/features/events/components/public-page/event-theme-editor';
import { EventThemePreview } from '@/features/events/components/public-page/event-theme-preview';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import { buildEventOverviewPath } from '@/features/events/utils/event-routes';
import { mergePublicPageCustomization } from '@/features/public/utils/public-page-customization';
import {
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_HIGHLIGHT_IMAGES,
  MAX_PUBLIC_MESSAGE_LENGTH,
  MAX_PUBLIC_TITLE_LENGTH,
  validateCustomizationInput,
} from '@/features/shared/utils/upload-validation';
import { api } from '@/lib/api';
import type { PublicPageCustomization } from '@/types/customization';

type SettingsFormState = PublicPageCustomization;

function createLocalPreviewUrls(files: File[]) {
  return files.map((file) => URL.createObjectURL(file));
}

function toSettingsForm(customization: PublicPageCustomization): SettingsFormState {
  return {
    ...customization,
    highlightImageUrls: customization.highlightImageUrls.slice(0, MAX_HIGHLIGHT_IMAGES),
  };
}

export function EventPublicPageSettingsPage() {
  const { eventId } = useParams();
  const { token } = useAuth();
  const dashboard = useEventDashboard(eventId);
  const event = dashboard.event;

  const [form, setForm] = useState<SettingsFormState | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [highlightFiles, setHighlightFiles] = useState<File[]>([]);
  const [decorativeFile, setDecorativeFile] = useState<File | null>(null);
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

  const decorativePreviewUrl = useMemo(
    () => (decorativeFile ? URL.createObjectURL(decorativeFile) : null),
    [decorativeFile],
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
    return () => {
      if (decorativePreviewUrl) {
        URL.revokeObjectURL(decorativePreviewUrl);
      }
    };
  }, [decorativePreviewUrl]);

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
        const savedCustomization = token
          ? await api.getEventPublicPageCustomization(token, event.id)
          : null;

        const resolved = mergePublicPageCustomization(
          event,
          savedCustomization as PublicPageCustomization | null,
        );

        if (active) {
          setForm(toSettingsForm(resolved));
        }
      } catch {
        if (active) {
          setForm(toSettingsForm(fallback));
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
      const existingKeys = new Set(
        current.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
      );
      const next = [...current];

      for (const file of files) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;

        if (!existingKeys.has(key) && next.length < MAX_HIGHLIGHT_IMAGES) {
          next.push(file);
          existingKeys.add(key);
        }
      }

      return next.slice(0, MAX_HIGHLIGHT_IMAGES);
    });
    setSaved(false);
    setError(null);
  }

  function removeHighlightFile(index: number) {
    setHighlightFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setSaved(false);
  }

  async function handleRemoveCurrentCover() {
    if (!event || !token || !form) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      await api.removeEventPublicPageCoverImage(token, event.id);
      setCoverFile(null);
      setForm({
        ...form,
        coverImageUrl: null,
      });
      setSaved(true);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível remover a capa agora. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveCurrentHighlights() {
    if (!event || !token || !form) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      await api.removeEventPublicPageHighlightImages(token, event.id);
      setHighlightFiles([]);
      setForm({
        ...form,
        highlightImageUrls: [],
      });
      setSaved(true);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível remover os destaques agora. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveCurrentDecorativeImage() {
    if (!event || !token || !form) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      await api.removeEventPublicPageDecorativeImage(token, event.id);
      setDecorativeFile(null);
      setForm({
        ...form,
        decorativeImageUrl: null,
      });
      setSaved(true);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : 'Não foi possível remover a imagem decorativa agora. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
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
      decorativeFile,
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
        publicGalleryEnabled: form.publicGalleryEnabled,
        templateCode: form.templateCode,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        accentColor: form.accentColor,
        decorationStyle: form.decorationStyle,
        decorativeImagePosition: form.decorativeImagePosition,
      });

      let nextCoverImageUrl = updated.coverImageUrl ?? form.coverImageUrl;
      let nextHighlightImageUrls = updated.highlightImageUrls ?? form.highlightImageUrls;
      let nextDecorativeImageUrl = updated.decorativeImageUrl ?? form.decorativeImageUrl;

      if (coverFile) {
        const coverData = new FormData();
        coverData.append('file', coverFile);
        const coverResponse = await api.uploadEventPublicPageCoverImage(
          token,
          event.id,
          coverData,
        );
        nextCoverImageUrl = coverResponse.coverImageUrl ?? nextCoverImageUrl;
      }

      if (highlightFiles.length > 0) {
        const highlightData = new FormData();
        highlightFiles.forEach((file) => highlightData.append('files', file));
        const highlightResponse = await api.uploadEventPublicPageHighlightImages(
          token,
          event.id,
          highlightData,
        );
        nextHighlightImageUrls = highlightResponse.highlightImageUrls ?? nextHighlightImageUrls;
      }

      if (decorativeFile) {
        const decorativeData = new FormData();
        decorativeData.append('file', decorativeFile);
        const decorativeResponse = await api.uploadEventPublicPageDecorativeImage(
          token,
          event.id,
          decorativeData,
        );
        nextDecorativeImageUrl =
          decorativeResponse.decorativeImageUrl ?? nextDecorativeImageUrl;
      }

      setForm(toSettingsForm({
        ...updated,
        coverImageUrl: nextCoverImageUrl,
        highlightImageUrls: nextHighlightImageUrls,
        decorativeImageUrl: nextDecorativeImageUrl,
      }));
      setCoverFile(null);
      setHighlightFiles([]);
      setDecorativeFile(null);
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
                  Voltar ao painel
                </Link>

                <p className="text-[15px] font-bold text-[#ef7885]">
                  Personalização da página pública
                </p>

                <h1 className="mt-2 max-w-4xl font-display text-[44px] font-semibold leading-none tracking-[-0.045em] text-[#161314] md:text-[56px]">
                  Controle o que os convidados vão ver
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#2c2927]/66">
                  Edite título, mensagem, foto de capa e destaques da experiência pública.
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
            <form
              onSubmit={handleSubmit}
              className="min-w-0 space-y-6 rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
            >
              <EventThemeEditor
                value={form}
                onChange={(value) => updateForm(value)}
                mobilePreview={(
                  <div className="-mx-5 sm:mx-0">
                    <EventThemePreview
                      event={event}
                      customization={form}
                      coverImageUrl={coverPreviewUrl ?? form.coverImageUrl}
                      highlightImageUrls={
                        highlightPreviewUrls.length > 0
                          ? highlightPreviewUrls
                          : form.highlightImageUrls
                      }
                      decorativeImageUrl={
                        decorativePreviewUrl ?? form.decorativeImageUrl
                      }
                    />
                  </div>
                )}
              />

              <div>
                <h2 className="text-xl font-black text-[#161314]">
                  Informações principais
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">
                  Ajuste o título, a data e a mensagem principal dos convidados.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">
                  Título do evento
                </span>
                <Input
                  value={form.title}
                  maxLength={MAX_PUBLIC_TITLE_LENGTH}
                  onChange={(inputEvent) => updateForm({ title: inputEvent.target.value })}
                  placeholder="Ex: Aniversário da Marina"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">Data do evento</span>
                <Input
                  type="date"
                  value={form.eventDate ?? ''}
                  onChange={(inputEvent) =>
                    updateForm({ eventDate: inputEvent.target.value || null })
                  }
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">
                  Mensagem para os convidados
                </span>
                <Textarea
                  value={form.welcomeMessage}
                  maxLength={MAX_PUBLIC_MESSAGE_LENGTH}
                  onChange={(inputEvent) =>
                    updateForm({ welcomeMessage: inputEvent.target.value })
                  }
                  placeholder="Escreva uma mensagem curta convidando as pessoas a enviarem fotos."
                />
                <span className="block text-right text-xs font-semibold text-[#2c2927]/45">
                  {form.welcomeMessage.length}/{MAX_PUBLIC_MESSAGE_LENGTH}
                </span>
              </label>

              <div className="rounded-[20px] border border-[#f1ddd1] bg-[#fffaf7] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-xl">
                    <p className="text-sm font-black text-[#161314]">
                      Galeria visível para convidados
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#2c2927]/62">
                      Quando desativada, os convidados ainda enviam fotos e recados, mas somente os anfitriões podem ver as imagens no painel.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.publicGalleryEnabled}
                    onClick={() =>
                      updateForm({ publicGalleryEnabled: !form.publicGalleryEnabled })
                    }
                    className={`relative h-12 w-[92px] shrink-0 rounded-full border p-1 transition ${
                      form.publicGalleryEnabled
                        ? 'border-[#ef7885] bg-[#ef7885]'
                        : 'border-[#dccbc1] bg-[#eee7e2]'
                    }`}
                  >
                    <span
                      className={`grid size-9 place-items-center rounded-full bg-white text-[10px] font-black shadow transition ${
                        form.publicGalleryEnabled
                          ? 'translate-x-10 text-[#ef7885]'
                          : 'translate-x-0 text-[#7b6d65]'
                      }`}
                    >
                      {form.publicGalleryEnabled ? 'SIM' : 'NÃO'}
                    </span>
                  </button>
                </div>

                <p className={`mt-4 rounded-[14px] px-4 py-3 text-xs font-bold ${
                  form.publicGalleryEnabled
                    ? 'bg-[#eefbf1] text-[#3f8b46]'
                    : 'bg-[#fff1f2] text-[#b75c68]'
                }`}>
                  {form.publicGalleryEnabled
                    ? 'Galeria pública: convidados podem ver e curtir as fotos.'
                    : 'Galeria privada: fotos visíveis somente para os anfitriões.'}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block rounded-[18px] border border-dashed border-[#efb6bb] bg-[#fff7f7] p-4 transition hover:bg-white">
                  <span className="text-sm font-black text-[#161314]">Foto de capa</span>
                  <span className="mt-2 block text-xs leading-5 text-[#2c2927]/56">
                    Apenas uma imagem principal para abrir a página pública.
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
                  <span className="text-sm font-black text-[#161314]">
                    Fotos em destaque
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-[#2c2927]/56">
                    Escolha até {MAX_HIGHLIGHT_IMAGES} fotos para complementar a capa.
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

              <EventDecorativeImageEditor
                currentImageUrl={form.decorativeImageUrl}
                previewImageUrl={decorativePreviewUrl}
                position={form.decorativeImagePosition}
                busy={saving}
                onFileChange={(file) => {
                  setDecorativeFile(file);
                  setSaved(false);
                  setError(null);
                }}
                onPositionChange={(decorativeImagePosition) =>
                  updateForm({ decorativeImagePosition })
                }
                onRemoveCurrent={() => void handleRemoveCurrentDecorativeImage()}
              />

              {(coverPreviewUrl || form.coverImageUrl) ? (
                <div className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[#161314]">
                      Capa {coverPreviewUrl ? 'selecionada' : 'atual'}
                    </p>
                    <button
                      type="button"
                      onClick={
                        coverPreviewUrl
                          ? () => setCoverFile(null)
                          : () => void handleRemoveCurrentCover()
                      }
                      className="rounded-[12px] border border-[#efb6bb] bg-white px-4 py-2 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
                    >
                      {coverPreviewUrl ? 'Remover prévia' : 'Remover capa atual'}
                    </button>
                  </div>
                  <img
                    src={coverPreviewUrl ?? form.coverImageUrl ?? ''}
                    alt="Capa selecionada"
                    loading="lazy"
                    className="mt-4 h-48 w-full rounded-[16px] object-cover"
                  />
                </div>
              ) : null}

              {(highlightPreviewUrls.length > 0 || form.highlightImageUrls.length > 0) ? (
                <div className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
                  <p className="text-sm font-black text-[#161314]">
                    {highlightPreviewUrls.length > 0 ? 'Fotos selecionadas' : 'Fotos atuais'}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {(highlightPreviewUrls.length > 0
                      ? highlightPreviewUrls
                      : form.highlightImageUrls
                    )
                      .slice(0, MAX_HIGHLIGHT_IMAGES)
                      .map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="relative aspect-square overflow-hidden rounded-[14px] bg-[#f5ded2]"
                        >
                          <img
                            src={image}
                            alt={`Foto em destaque ${index + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
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
                  <button
                    type="button"
                    onClick={
                      highlightPreviewUrls.length > 0
                        ? () => setHighlightFiles([])
                        : () => void handleRemoveCurrentHighlights()
                    }
                    className="mt-4 rounded-[12px] border border-[#efb6bb] bg-white px-4 py-2 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
                  >
                    {highlightPreviewUrls.length > 0
                      ? 'Limpar fotos selecionadas'
                      : 'Remover fotos atuais'}
                  </button>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-[16px] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
                  {error}
                </div>
              ) : null}

              {saved ? (
                <div className="rounded-[16px] border border-[#c8e6c9] bg-[#f1fbf2] px-4 py-3 text-sm font-semibold text-[#3f8b46]">
                  Personalização visual salva com sucesso.
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={saving || loadingCustomization}
                className="h-12 rounded-[14px]"
              >
                {saving ? 'Salvando...' : 'Salvar personalização'}
              </Button>
            </form>

            <div className="hidden xl:block">
              <EventThemePreview
                event={event}
                customization={form}
                coverImageUrl={coverPreviewUrl ?? form.coverImageUrl}
                highlightImageUrls={
                  highlightPreviewUrls.length > 0
                    ? highlightPreviewUrls
                    : form.highlightImageUrls
                }
                decorativeImageUrl={
                  decorativePreviewUrl ?? form.decorativeImageUrl
                }
              />
            </div>
          </div>
        </div>
      ) : null}
    </EventPageLayout>
  );
}
