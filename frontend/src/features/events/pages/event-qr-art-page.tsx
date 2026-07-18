import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { EventPageHeader } from '@/features/events/components/event-dashboard/event-page-header';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { QrArtPageIdentityCard } from '@/features/events/components/qr-art/qr-art-page-identity-card';
import { QrArtEditor } from '@/features/events/components/qr-art/qr-art-editor';
import { QrArtPreview } from '@/features/events/components/qr-art/qr-art-preview';
import { useAuth } from '@/features/auth/auth-context';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import {
  buildDefaultQrArtCustomization,
  applyPublicPageIdentityToQrArt,
  isQrArtPrintFormat,
  QR_ART_FORMATS,
  toQrArtUpdateRequest,
} from '@/features/events/utils/qr-art-config';
import {
  downloadQrArtPdf,
  downloadQrArtPng,
} from '@/features/events/utils/qr-art-export';
import {
  resolveEventTheme,
  toEventThemeCssVariables,
} from '@/features/public/utils/event-theme';
import { api } from '@/lib/api';
import type { EventQrArtCustomization } from '@/types/qr-art';

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível preparar o QR Code.'));
    reader.readAsDataURL(blob);
  });
}

export function EventQrArtPage() {
  const { eventId } = useParams();
  const { token } = useAuth();
  const dashboard = useEventDashboard(eventId);
  const previewRef = useRef<SVGSVGElement>(null);
  const [customization, setCustomization] = useState<EventQrArtCustomization | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [loadingArt, setLoadingArt] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const pageTheme = resolveEventTheme(dashboard.publicPageCustomization);

  useEffect(() => {
    let active = true;

    async function loadArt() {
      if (!eventId || !token || !dashboard.event) return;

      setLoadingArt(true);
      setFeedback(null);

      try {
        const [artResult, qrResult] = await Promise.allSettled([
          api.getEventQrArtCustomization(token, eventId),
          api.fetchEventQrCode(token, eventId, 1024),
        ]);
        const baseArt = artResult.status === 'fulfilled'
          ? artResult.value
          : buildDefaultQrArtCustomization(dashboard.event);
        const hasPublicPageIdentity = Boolean(dashboard.publicPageCustomization.title.trim());
        const savedArt = baseArt.updatedAt === null && hasPublicPageIdentity
          ? applyPublicPageIdentityToQrArt(baseArt, dashboard.publicPageCustomization)
          : baseArt;
        const qrDataUrl = qrResult.status === 'fulfilled'
          ? await blobToDataUrl(qrResult.value)
          : dashboard.qrPreviewUrl;

        if (active) {
          setCustomization(savedArt);
          setQrCodeDataUrl(qrDataUrl);
          if (artResult.status === 'rejected' || qrResult.status === 'rejected') {
            setFeedback({
              tone: 'error',
              message: qrResult.status === 'rejected'
                ? 'A personalização foi carregada, mas o QR Code não ficou disponível. Tente novamente em instantes.'
                : 'Usamos os padrões do evento porque a personalização salva não ficou disponível.',
            });
          }
        }
      } catch (error) {
        if (active) {
          setCustomization(buildDefaultQrArtCustomization(dashboard.event));
          setFeedback({
            tone: 'error',
            message: error instanceof Error
              ? error.message
              : 'Não foi possível carregar a personalização salva.',
          });
        }
      } finally {
        if (active) setLoadingArt(false);
      }
    }

    void loadArt();
    return () => {
      active = false;
    };
  }, [dashboard.event, dashboard.publicPageCustomization, eventId, token]);

  async function saveCustomization() {
    if (!customization || !eventId || !token) return;
    if (!customization.title.trim() || !customization.callToAction.trim()) {
      setFeedback({ tone: 'error', message: 'Preencha o título e a chamada para ação.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const saved = await api.updateEventQrArtCustomization(
        token,
        eventId,
        toQrArtUpdateRequest(customization),
      );
      setCustomization(saved);
      setFeedback({ tone: 'success', message: 'Arte salva. Você pode continuar editando ou baixar o PNG.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível salvar a arte.',
      });
    } finally {
      setSaving(false);
    }
  }

  function restoreDefaults() {
    if (!dashboard.event) return;
    setCustomization(buildDefaultQrArtCustomization(dashboard.event));
    setFeedback({
      tone: 'success',
      message: 'Padrões restaurados na prévia. Clique em salvar para confirmar.',
    });
  }

  function applyPublicPageIdentity() {
    if (!customization || !dashboard.publicPageCustomization.title.trim()) return;

    setCustomization(
      applyPublicPageIdentityToQrArt(customization, dashboard.publicPageCustomization),
    );
    setFeedback({
      tone: 'success',
      message: 'Identidade da página aplicada na prévia. Clique em salvar para confirmar.',
    });
  }

  async function exportPng() {
    if (!customization || !previewRef.current || !qrCodeDataUrl) {
      setFeedback({ tone: 'error', message: 'Aguarde o QR Code carregar antes de baixar.' });
      return;
    }

    setExporting(true);
    setFeedback(null);

    try {
      await downloadQrArtPng(previewRef.current, customization.format, customization.title);
      setFeedback({ tone: 'success', message: 'PNG em alta resolução gerado com sucesso.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível gerar o PNG.',
      });
    } finally {
      setExporting(false);
    }
  }

  async function exportPdf() {
    if (!customization || !previewRef.current || !qrCodeDataUrl) {
      setFeedback({ tone: 'error', message: 'Aguarde o QR Code carregar antes de baixar.' });
      return;
    }

    setExportingPdf(true);
    setFeedback(null);

    try {
      await downloadQrArtPdf(
        previewRef.current,
        customization.format,
        customization.title,
        customization.secondaryColor,
      );
      setFeedback({
        tone: 'success',
        message: 'PDF para impressão gerado com sangria e marcas de corte.',
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível gerar o PDF.',
      });
    } finally {
      setExportingPdf(false);
    }
  }

  const selectedFormat = customization
    ? QR_ART_FORMATS.find((format) => format.value === customization.format)
    : null;
  const supportsPrintPdf = customization
    ? isQrArtPrintFormat(customization.format)
    : false;

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Evento não encontrado"
      emptyDescription="Não foi possível abrir o editor de arte deste evento."
    >
      {dashboard.event ? (
        <div className="space-y-6" style={toEventThemeCssVariables(pageTheme)}>
          <EventPageHeader
            eyebrow="Arte personalizada"
            title="Seu QR Code pronto para a festa"
            description="Escolha um modelo, personalize os textos e baixe uma arte em alta resolução para mesas, entrada ou redes sociais."
            badge="Prévia em tempo real"
          />

          {feedback ? (
            <div
              role="status"
              className={[
                'rounded-[18px] border px-5 py-4 text-sm font-semibold',
                feedback.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-700',
              ].join(' ')}
            >
              {feedback.message}
            </div>
          ) : null}

          {loadingArt || !customization ? (
            <section className="grid min-h-[420px] place-items-center rounded-[28px] border border-[#f1ddd1] bg-white/90 p-8">
              <div className="text-center">
                <span className="mx-auto block size-10 animate-spin rounded-full border-4 border-[#f4d9d2] border-t-[#ef7885]" />
                <p className="mt-4 text-sm font-bold text-[#514741]/70">Preparando seu editor...</p>
              </div>
            </section>
          ) : (
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
              <section className="order-2 rounded-[28px] border border-[#f1ddd1] bg-[#fffaf7]/94 p-5 shadow-[0_22px_60px_rgba(96,60,36,0.07)] sm:p-7 xl:order-1">
                {dashboard.publicPageCustomization.title.trim() ? (
                  <QrArtPageIdentityCard
                    art={customization}
                    publicPage={dashboard.publicPageCustomization}
                    onApply={applyPublicPageIdentity}
                  />
                ) : null}

                <QrArtEditor value={customization} onChange={setCustomization} />

                <div className="mt-8 flex flex-col gap-3 border-t border-[#f0ddd2] pt-6 sm:flex-row">
                  <Button type="button" variant="secondary" onClick={() => void saveCustomization()} loading={saving} className="sm:min-w-40">
                    Salvar arte
                  </Button>
                  <Button type="button" variant="outline" onClick={restoreDefaults}>
                    Restaurar padrão
                  </Button>
                </div>
              </section>

              <aside className="order-1 xl:order-2 xl:sticky xl:top-6">
                <section className="overflow-hidden rounded-[28px] border border-[#ead5ca] bg-[#211c19] p-4 shadow-[0_28px_80px_rgba(65,40,27,0.18)] sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3 text-white">
                    <div>
                      <p className="text-sm font-black">Prévia da arte</p>
                      <p className="mt-1 text-xs text-white/55">
                        {selectedFormat?.label} • {selectedFormat?.description}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]">
                      Alta resolução
                    </span>
                  </div>

                  <div className="grid max-h-[72vh] place-items-center overflow-auto rounded-[20px] bg-[#eee7e1] p-3 sm:p-5">
                    <QrArtPreview
                      ref={previewRef}
                      customization={customization}
                      qrCodeDataUrl={qrCodeDataUrl}
                      className="h-auto max-h-[68vh] w-full rounded-[8px] shadow-[0_20px_55px_rgba(0,0,0,0.24)]"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => void exportPng()}
                    loading={exporting}
                    disabled={!qrCodeDataUrl || exportingPdf}
                    className="mt-4 w-full"
                  >
                    Baixar arte em PNG
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void exportPdf()}
                    loading={exportingPdf}
                    disabled={!qrCodeDataUrl || exporting || !supportsPrintPdf}
                    className="mt-3 w-full"
                  >
                    Baixar PDF para impressão
                  </Button>
                  <p className="mt-3 text-center text-[11px] leading-5 text-white/48">
                    {supportsPrintPdf
                      ? 'PDF em 300 DPI com 3 mm de sangria, marcas de corte e área segura para o QR Code.'
                      : 'Escolha A5 ou A4 para gerar o PDF de gráfica. O PNG continua disponível neste formato.'}
                  </p>
                </section>
              </aside>
            </div>
          )}
        </div>
      ) : null}
    </EventPageLayout>
  );
}
