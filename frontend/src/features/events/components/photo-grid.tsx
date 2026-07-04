import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { Photo } from '@/types/photo';
import { mediaUrl } from '@/lib/api';

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
}

export function PhotoGrid({ photos, loading = false, emptyTitle, emptyDescription }: PhotoGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="aspect-[4/3] rounded-2xl bg-white/8" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-2/3 rounded-full bg-white/8" />
              <div className="h-3 w-1/2 rounded-full bg-white/8" />
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
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden p-0">
          <a href={mediaUrl(photo.downloadUrl)} target="_blank" rel="noreferrer" className="block">
            <div className="aspect-[4/3] overflow-hidden bg-ink-800/60">
              <img
                src={mediaUrl(photo.downloadUrl)}
                alt={photo.originalFilename}
                className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
              />
            </div>
          </a>
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-sand-50">{photo.guestName || 'Convidado anônimo'}</p>
                <p className="mt-1 text-xs text-sand-100/55">{photo.originalFilename}</p>
              </div>
              <Badge tone={photo.status === 'AVAILABLE' ? 'success' : 'neutral'}>{photo.status}</Badge>
            </div>
            {photo.guestMessage ? <p className="text-sm leading-6 text-sand-100/72">{photo.guestMessage}</p> : null}
            <div className="flex items-center justify-between gap-3 text-xs text-sand-100/45">
              <span>{new Date(photo.createdAt).toLocaleString('pt-BR')}</span>
              <a className="font-semibold text-sand-100 underline underline-offset-4" href={mediaUrl(photo.downloadUrl)} download>
                Baixar
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
