import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/features/auth/auth-context';
import { api } from '@/lib/api';

interface EventQrPanelProps {
  eventId: string;
  publicUrl: string;
}

export function EventQrPanel({ eventId, publicUrl }: EventQrPanelProps) {
  const { token } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicLink = new URL(publicUrl, window.location.origin).toString();

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function loadQr() {
      if (!token) {
        setError('Sessão expirada');
        setBusy(false);
        return;
      }

      try {
        const blob = await api.fetchEventQrCode(token, eventId);
        objectUrl = URL.createObjectURL(blob);

        if (active) {
          setPreviewUrl(objectUrl);
        }
      } catch (exception) {
        if (active) {
          setError(
              exception instanceof Error
                  ? exception.message
                  : 'Não foi possível gerar o QR Code',
          );
        }
      } finally {
        if (active) {
          setBusy(false);
        }
      }
    }

    void loadQr();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [eventId, token]);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(publicLink);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
      <Card className="relative overflow-hidden border-[#f0d8ca] bg-white/72">
        <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#f4a1aa]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-44 rounded-full bg-[#d8a84f]/18 blur-3xl" />

        <div className="relative space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b9852f]">
              QR Code
            </p>

            <h3 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-ink-900">
              Compartilhar evento
            </h3>

            <p className="mt-3 text-sm leading-7 text-ink-800/70">
              Este QR Code abre a página pública do evento para que os convidados enviem
              fotos em poucos segundos, sem login e sem instalar aplicativo.
            </p>
          </div>

          {busy ? (
              <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
                <div className="aspect-square w-full max-w-[220px] animate-pulse rounded-[2rem] bg-white/55" />

                <div className="space-y-4">
                  <div className="h-24 animate-pulse rounded-[2rem] bg-white/55" />
                  <div className="h-12 animate-pulse rounded-2xl bg-white/55" />
                </div>
              </div>
          ) : error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
                {error}
              </div>
          ) : previewUrl ? (
              <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-start">
                <div className="rounded-[2rem] border border-[#ead1c4] bg-[#fffaf7] p-4 shadow-[0_18px_48px_rgba(96,60,36,0.09)]">
                  <img
                      src={previewUrl}
                      alt="QR Code do evento"
                      className="w-full rounded-[1.5rem] bg-white p-3"
                  />

                  <p className="mt-4 text-center font-display text-xl italic text-[#b9852f]">
                    Compartilhe suas fotos
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.7rem] border border-[#f0d8ca] bg-[#fffaf7] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b9852f]">
                      URL pública
                    </p>

                    <p className="mt-3 break-all font-mono text-xs font-semibold leading-6 text-ink-900">
                      {publicLink}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                        className="inline-flex items-center justify-center rounded-2xl bg-[#ef7885] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
                        href={previewUrl}
                        download="memora-qrcode.png"
                    >
                      Baixar QR
                    </a>

                    <Button variant="secondary" onClick={handleCopyLink}>
                      {copied ? 'Link copiado' : 'Copiar link'}
                    </Button>
                  </div>

                  <div className="rounded-[1.7rem] bg-ink-900 p-5 text-white shadow-[0_18px_48px_rgba(24,24,27,0.14)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
                      Dica de uso
                    </p>

                    <p className="mt-3 text-sm leading-7 text-white/76">
                      Imprima esse QR Code e coloque nas mesas, na entrada do evento ou em
                      um display próximo à pista de dança.
                    </p>
                  </div>
                </div>
              </div>
          ) : null}
        </div>
      </Card>
  );
}