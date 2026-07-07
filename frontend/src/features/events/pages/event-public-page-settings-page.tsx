import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { ExternalIcon, ImagesIcon } from '@/features/events/components/event-dashboard/event-icons';
import { formatEventDate } from '@/features/events/utils/event-dashboard-formatters';
import { buildEventOverviewPath } from '@/features/events/utils/event-routes';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import {
  buildDefaultPublicPageCustomization,
  savePublicPageCustomization,
  type PublicPageCustomization,
  resolvePublicPageCustomization,
} from '@/features/public/utils/public-page-customization';

const MAX_HIGHLIGHT_IMAGES = 6;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
    reader.readAsDataURL(file);
  });
}

function compactTitle(value: string) {
  return value.trim() || 'Página pública do evento';
}

export function EventPublicPageSettingsPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);

  const event = dashboard.event;
  const [customization, setCustomization] = useState<PublicPageCustomization | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!event) {
      return;
    }

    setCustomization(resolvePublicPageCustomization(event));
    setSaved(false);
    setError(null);
  }, [event]);

  const previewImages = useMemo(() => {
    if (!customization) {
      return [] as string[];
    }

    return [
      customization.coverImageUrl,
      ...customization.highlightImageUrls,
    ].filter((image): image is string => Boolean(image));
  }, [customization]);

  function updateCustomization(update: Partial<PublicPageCustomization>) {
    setCustomization((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...update,
        updatedAt: new Date().toISOString(),
      };
    });
    setSaved(false);
    setError(null);
  }

  async function handleCoverChange(eventChange: ChangeEvent<HTMLInputElement>) {
    const file = eventChange.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateCustomization({ coverImageUrl: dataUrl });
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível carregar a capa.');
    } finally {
      eventChange.target.value = '';
    }
  }

  async function handleHighlightsChange(eventChange: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(eventChange.target.files ?? []).slice(0, MAX_HIGHLIGHT_IMAGES);

    if (selectedFiles.length === 0) {
      return;
    }

    try {
      const images = await Promise.all(selectedFiles.map(readFileAsDataUrl));
      updateCustomization({
        highlightImageUrls: [
          ...(customization?.highlightImageUrls ?? []),
          ...images,
        ].slice(0, MAX_HIGHLIGHT_IMAGES),
      });
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível carregar as fotos.');
    } finally {
      eventChange.target.value = '';
    }
  }

  function removeHighlight(index: number) {
    updateCustomization({
      highlightImageUrls: (customization?.highlightImageUrls ?? []).filter((_, currentIndex) => currentIndex !== index),
    });
  }

  function handleReset() {
    if (!event) {
      return;
    }

    setCustomization(buildDefaultPublicPageCustomization(event));
    setSaved(false);
    setError(null);
  }

  function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();

    if (!event || !customization) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      savePublicPageCustomization(event.slug, {
        ...customization,
        title: compactTitle(customization.title),
        welcomeMessage: customization.welcomeMessage.trim(),
        updatedAt: new Date().toISOString(),
      });
      setSaved(true);
    } catch {
      setError('Não foi possível salvar a personalização neste navegador.');
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
      {event && customization ? (
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
                  Essa é a página que seus convidados acessam pelo link público. Por enquanto, as mudanças ficam salvas no frontend para você testar o fluxo; depois conectamos isso ao backend em <strong>event_customization</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
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
                  value={customization.title}
                  onChange={(inputEvent) => updateCustomization({ title: inputEvent.target.value })}
                  placeholder="Ex: Ana & Gabriel"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">Data do evento</span>
                <Input
                  type="date"
                  value={customization.eventDate ?? ''}
                  onChange={(inputEvent) => updateCustomization({ eventDate: inputEvent.target.value || null })}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-[#2c2927]/80">Mensagem para os convidados</span>
                <Textarea
                  value={customization.welcomeMessage}
                  onChange={(inputEvent) => updateCustomization({ welcomeMessage: inputEvent.target.value })}
                  placeholder="Escreva uma mensagem curta convidando as pessoas a enviarem fotos."
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block rounded-[18px] border border-dashed border-[#efb6bb] bg-[#fff7f7] p-4 transition hover:bg-white">
                  <span className="text-sm font-black text-[#161314]">Foto de capa</span>
                  <span className="mt-2 block text-xs leading-5 text-[#2c2927]/56">
                    Escolha uma imagem principal para o hero da página pública.
                  </span>
                  <input type="file" accept="image/*" className="mt-4 block w-full text-xs text-[#2c2927]/64" onChange={handleCoverChange} />
                </label>

                <label className="block rounded-[18px] border border-dashed border-[#efb6bb] bg-[#fff7f7] p-4 transition hover:bg-white">
                  <span className="text-sm font-black text-[#161314]">Fotos em destaque</span>
                  <span className="mt-2 block text-xs leading-5 text-[#2c2927]/56">
                    Selecione até {MAX_HIGHLIGHT_IMAGES} fotos para aparecerem no preview da página.
                  </span>
                  <input type="file" accept="image/*" multiple className="mt-4 block w-full text-xs text-[#2c2927]/64" onChange={handleHighlightsChange} />
                </label>
              </div>

              {customization.coverImageUrl ? (
                <div className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[#161314]">Capa selecionada</p>
                    <button
                      type="button"
                      onClick={() => updateCustomization({ coverImageUrl: null })}
                      className="rounded-[12px] border border-[#efb6bb] bg-white px-4 py-2 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
                    >
                      Remover
                    </button>
                  </div>
                  <img src={customization.coverImageUrl} alt="Capa selecionada" className="mt-4 h-48 w-full rounded-[16px] object-cover" />
                </div>
              ) : null}

              {customization.highlightImageUrls.length > 0 ? (
                <div className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
                  <p className="text-sm font-black text-[#161314]">Fotos em destaque</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {customization.highlightImageUrls.map((image, index) => (
                      <div key={`${image}-${index}`} className="group relative aspect-square overflow-hidden rounded-[14px] bg-[#f5ded2]">
                        <img src={image} alt={`Foto em destaque ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="absolute right-2 top-2 rounded-full bg-white/92 px-3 py-1 text-[11px] font-black text-[#ef7885] shadow-[0_8px_20px_rgba(24,24,27,0.12)]"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
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

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={saving} className="h-12 rounded-[14px]">
                  {saving ? 'Salvando...' : 'Salvar personalização'}
                </Button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#e8cfc1] bg-white px-6 text-sm font-bold text-[#201914] transition hover:bg-[#fff7f2]"
                >
                  Restaurar padrão
                </button>
              </div>
            </form>

            <section className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#ef7885]">Prévia dos convidados</p>
                  <h2 className="mt-2 text-xl font-black text-[#161314]">Como a página vai aparecer</h2>
                  <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">
                    Esta área simula a primeira dobra da página pública. A galeria completa continua carregando nas páginas próprias.
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-[16px] bg-[#fff1f2] text-[#ef7885]">
                  <ImagesIcon className="size-6" />
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[24px] border border-[#f1ddd1] bg-[#fff8f3] p-4">
                <div className="relative overflow-hidden rounded-[20px] bg-white p-5 shadow-[0_14px_38px_rgba(96,60,36,0.08)]">
                  <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                    <div>
                      <span className="inline-flex h-9 items-center rounded-full bg-[#fff3e6] px-4 text-xs font-bold text-[#c5922e]">
                        {formatEventDate(customization.eventDate)}
                      </span>
                      <h3 className="mt-4 font-display text-[44px] font-semibold leading-none tracking-[-0.05em] text-[#161314]">
                        {compactTitle(customization.title)}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[#2c2927]/68">
                        {customization.welcomeMessage || 'Mensagem de boas-vindas do evento.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {(previewImages.length > 0 ? previewImages.slice(0, 4) : [null, null, null, null]).map((image, index) => (
                        <div key={image ?? index} className="aspect-square overflow-hidden rounded-[16px] bg-[#f5ded2]">
                          {image ? (
                            <img src={image} alt="Prévia" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center px-3 text-center text-xs font-bold text-[#c5922e]/70">
                              Foto {index + 1}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
