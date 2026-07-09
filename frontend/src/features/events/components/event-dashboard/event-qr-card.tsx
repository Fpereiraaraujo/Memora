import { DownloadIcon, LinkIcon, QrIcon } from '@/features/events/components/event-dashboard/event-icons';
import type { EventStatus } from '@/types/event';

interface EventQrCardProps {
  qrPreviewUrl: string | null;
  copied: boolean;
  eventStatus?: EventStatus;
  onCopyUploadLink: () => void;
}

function QrPlaceholder({ eventStatus }: { eventStatus?: EventStatus }) {
  const isDraft = eventStatus === 'DRAFT';

  return (
    <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-[16px] bg-[linear-gradient(180deg,#fff8f3,#fff1f2)] px-4 text-center">
      <div className="grid size-16 place-items-center rounded-[18px] bg-white text-[#ef7885] shadow-[0_12px_28px_rgba(96,60,36,0.08)]">
        <QrIcon className="size-8" />
      </div>

      <p className="mt-5 text-sm font-black text-[#161314]">
        {isDraft ? 'QR Code ainda não gerado' : 'QR Code indisponível'}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#2c2927]/56">
        {isDraft
          ? 'O preview aparece aqui. O QR final fica disponível quando o evento for ativado.'
          : 'Você ainda pode copiar o link de upload para testar o fluxo.'}
      </p>
    </div>
  );
}

export function EventQrCard({ qrPreviewUrl, copied, eventStatus, onCopyUploadLink }: EventQrCardProps) {
  return (
    <section
      id="qr-code"
      className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
    >
      <div>
        <h2 className="text-xl font-black text-[#161314]">QR Code do evento</h2>

        <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">
          Use o QR Code ou o link direto para levar os convidados à página de upload do evento.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[170px_1fr] xl:grid-cols-1">
        <div className="mx-auto w-full max-w-[190px] rounded-[20px] border border-[#edc990] bg-[#fffdfb] p-3 shadow-[0_18px_44px_rgba(96,60,36,0.08)]">
          {qrPreviewUrl ? (
            <img src={qrPreviewUrl} alt="QR Code do evento" loading="lazy" className="w-full rounded-[16px] bg-white" />
          ) : (
            <QrPlaceholder eventStatus={eventStatus} />
          )}
        </div>

        <div className="flex flex-col justify-center gap-3">
          {qrPreviewUrl ? (
            <a
              href={qrPreviewUrl}
              download="memora-qrcode.png"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
            >
              <DownloadIcon className="size-4" />
              Baixar QR Code
            </a>
          ) : (
            <div className="rounded-[16px] border border-[#f1ddd1] bg-[#fffaf7] px-4 py-3 text-sm leading-6 text-[#2c2927]/62">
              O QR final será exibido quando a API retornar a imagem. O link de upload já pode ser copiado para teste.
            </div>
          )}

          <button
            type="button"
            onClick={onCopyUploadLink}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#efb6bb] bg-white px-5 text-sm font-bold text-[#201914] transition hover:-translate-y-0.5 hover:bg-[#fff7f7]"
          >
            <LinkIcon className="size-4" />
            {copied ? 'Link copiado' : 'Copiar link de upload'}
          </button>
        </div>
      </div>
    </section>
  );
}
