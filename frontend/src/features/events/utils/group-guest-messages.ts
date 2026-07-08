import type { Photo } from '@/types/photo';
import type { EventGuestMessage } from '@/types/message';

function buildFallbackGroupKey(photo: Photo) {
  const createdAt = new Date(photo.createdAt);
  const minuteBucket = `${createdAt.getUTCFullYear()}-${createdAt.getUTCMonth()}-${createdAt.getUTCDate()}-${createdAt.getUTCHours()}-${createdAt.getUTCMinutes()}`;

  return [
    photo.guestName?.trim().toLowerCase() ?? 'anon',
    photo.guestMessage?.trim().toLowerCase() ?? '',
    minuteBucket,
  ].join('|');
}

export function groupGuestMessages(photos: Photo[]): EventGuestMessage[] {
  const groups = new Map<string, EventGuestMessage>();

  photos
    .filter((photo) => photo.guestMessage?.trim())
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .forEach((photo) => {
      const groupKey = photo.uploadGroupId ?? buildFallbackGroupKey(photo);
      const existing = groups.get(groupKey);

      if (existing) {
        groups.set(groupKey, {
          ...existing,
          photoCount: existing.photoCount + (photo.downloadUrl ? 1 : 0),
        });
        return;
      }

      groups.set(groupKey, {
        id: photo.uploadGroupId ?? photo.id,
        guestName: photo.guestName,
        guestMessage: photo.guestMessage?.trim() ?? '',
        createdAt: photo.createdAt,
        photoCount: photo.downloadUrl ? 1 : 0,
      });
    });

  return Array.from(groups.values()).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
