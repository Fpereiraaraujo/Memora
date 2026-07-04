import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';

interface EventQrPanelProps {
  eventId: string;
  publicUrl: string;
}

export function EventQrPanel({ eventId, publicUrl }: EventQrPanelProps) {
  const { token } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
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
          setError(exception instanceof Error ? exception.message : 'Não foi possível gerar o QR code');
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

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">QR code</p>
        <h3 className="font-display text-2xl text-sand-50">Compartilhar o evento</h3>
        <p className="text-sm leading-6 text-sand-100/70">
          Os convidados podem abrir a página pública direto pelo QR. Use para colocar em mesa, convites ou telão.
        </p>
      </div>

      {busy ? (
        <div className="aspect-square w-full max-w-sm rounded-[28px] bg-white/8 animate-pulse" />
      ) : error ? (
        <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : previewUrl ? (
        <div className="grid gap-4 md:grid-cols-[240px_1fr] md:items-start">
          <img src={previewUrl} alt="QR code do evento" className="w-full max-w-[240px] rounded-[28px] bg-white p-4" />
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-sand-100/75">
              <p className="text-xs uppercase tracking-[0.24em] text-sand-100/45">URL pública</p>
              <p className="mt-2 break-all font-mono text-xs text-sand-50">{publicLink}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center justify-center rounded-2xl bg-white/8 px-4 py-2.5 text-sm font-semibold text-sand-50 transition hover:bg-white/12"
                href={previewUrl}
                download="event-qrcode.png"
              >
                Baixar QR code
              </a>
              <Button
                variant="ghost"
                onClick={async () => {
                  await navigator.clipboard.writeText(publicLink);
                }}
              >
                Copiar link
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
