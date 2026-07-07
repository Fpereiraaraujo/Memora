import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { mediaUrl } from '@/lib/api';
import type { Photo } from '@/types/photo';

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
}

function formatBytes(sizeBytes: number) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatPhotoStatus(status: Photo['status']) {
  const map: Record<Photo['status'], string> = {
    UPLOAD_REQUESTED: 'Enviando',
    RECEIVED: 'Recebida',
    AVAILABLE: 'Disponível',
    HIDDEN: 'Oculta',
    REMOVED: 'Removida',
  };

  return map[status] ?? status;
}

function getPhotoTone(status: Photo['status']) {
  if (status === 'AVAILABLE') {
    return 'success';
  }

  if (status === 'UPLOAD_REQUESTED' || status === 'RECEIVED') {
    return 'warning';
  }

  return 'neutral';
}

export function PhotoGrid({
                            photos,
                            loading = false,
                            emptyTitle,
                            emptyDescription,
                          }: PhotoGridProps) {
  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
              <Card
                  key={index}
                  className="animate-pulse overflow-hidden border-[#f0d8ca] bg-white/68 p-0"
              >
                <div className="aspect-[4/3] bg-white/55" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 rounded-full bg-white/70" />
                  <div className="h-3 w-1/2 rounded-full bg-white/70" />
                  <div className="h-10 rounded-2xl bg-white/70" />
                </div>
              </Card>
          ))}
        </div>
    );
  }

  if (photos.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {photos.map((photo) => {
          const imageUrl = mediaUrl(photo.downloadUrl || '');

          return (
              <Card
                  key={photo.id}
                  className="group overflow-hidden border-[#f0d8ca] bg-white/72 p-0 transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-[4/3] overflow-hidden bg-[#e9d8cb]"
                >
                  <img
                      src={imageUrl}
                      alt={photo.originalFilename || 'Foto do evento'}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/48 via-transparent to-transparent opacity-80" />

                  <div className="absolute left-4 top-4">
                    <Badge tone={getPhotoTone(photo.status)}>
                      {formatPhotoStatus(photo.status)}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="truncate text-sm font-bold text-white">
                      {photo.guestName || 'Convidado anônimo'}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/72">
                      {photo.originalFilename || 'Foto enviada pelo convidado'}
                    </p>
                  </div>
                </a>

                <div className="space-y-4 p-5">
                  {photo.guestMessage ? (
                      <div className="rounded-[1.4rem] bg-[#fffaf7] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b9852f]">
                          Mensagem
                        </p>

                        <p className="mt-2 text-sm leading-7 text-ink-800/72">
                          {photo.guestMessage}
                        </p>
                      </div>
                  ) : (
                      <div className="rounded-[1.4rem] bg-[#fffaf7] p-4">
                        <p className="text-sm leading-7 text-ink-800/55">
                          Sem mensagem do convidado.
                        </p>
                      </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs text-ink-800/62">
                    <div className="rounded-2xl bg-[#fffaf7] px-4 py-3">
                      <p className="font-bold uppercase tracking-[0.18em] text-ink-800/42">
                        Tamanho
                      </p>

                      <p className="mt-1 font-semibold text-ink-900">
                        {formatBytes(photo.sizeBytes ?? 0)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fffaf7] px-4 py-3">
                      <p className="font-bold uppercase tracking-[0.18em] text-ink-800/42">
                        Data
                      </p>

                      <p className="mt-1 font-semibold text-ink-900">
                        {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <a
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#ef7885] px-4 py-3 text-xs font-bold text-white shadow-[0_14px_30px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
                        href={imageUrl}
                        download
                    >
                      Baixar foto
                    </a>

                    <a
                        className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white/72 px-4 py-3 text-xs font-bold text-ink-900 transition hover:-translate-y-0.5 hover:bg-white"
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                      Abrir
                    </a>
                  </div>
                </div>
              </Card>
          );
        })}
      </div>
  );
}
