import { DownloadIcon, LinkIcon } from '@/features/events/components/event-dashboard/event-icons';

interface EventQrCardProps {
  qrPreviewUrl: string | null;
  copied: boolean;
  onCopyUploadLink: () => void;
}

export function EventQrCard({ qrPreviewUrl, copied, onCopyUploadLink }: EventQrCardProps) {
  return (
    <section
      id="qr-code"
      className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
    >
      <div>
        <h2 className="text-xl font-black text-[#161314]">QR Code do evento</h2>

        <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">
          Seus convidados podem escanear o QR Code e enviar fotos diretamente para a galeria.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[170px_1fr] xl:grid-cols-1">
        <div className="mx-auto w-full max-w-[190px] rounded-[20px] border border-[#edc990] bg-[#fffdfb] p-3 shadow-[0_18px_44px_rgba(96,60,36,0.08)]">
          {qrPreviewUrl ? (
            <img src={qrPreviewUrl} alt="QR Code do evento" className="w-full rounded-[16px] bg-white" />
          ) : (
            <div className="aspect-[3/4] animate-pulse rounded-[16px] bg-[#fff5ef]" />
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
          ) : null}

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
