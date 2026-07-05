import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/auth-context';
import {
  buildMockEvent,
  buildMockPhotos,
  buildMockQrDataUrl,
} from '@/features/events/utils/event-dashboard-mock';
import {
  readStoredFavoriteIds,
  writeStoredFavoriteIds,
} from '@/features/events/utils/event-dashboard-storage';
import { buildPublicEventUrl } from '@/features/events/utils/event-dashboard-formatters';
import { api } from '@/lib/api';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

interface UseEventDashboardResult {
  event: EventSummary | null;
  photos: Photo[];
  qrPreviewUrl: string | null;
  publicUrl: string;
  loading: boolean;
  mockMode: boolean;
  copied: boolean;
  favorites: string[];
  guestCount: number;
  messagePhotos: Photo[];
  favoritePhotos: Photo[];
  galleryPreview: Photo[];
  toggleFavorite: (photoId: string) => void;
  copyPublicLink: () => Promise<void>;
  shareEvent: () => Promise<void>;
}

export function useEventDashboard(eventId?: string): UseEventDashboardResult {
  const { token } = useAuth();

  const [event, setEvent] = useState<EventSummary | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [mockMode, setMockMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const favoriteStorageKey = eventId ? `memora.favorites.${eventId}` : null;

  useEffect(() => {
    if (!favoriteStorageKey) {
      return;
    }

    setFavorites(readStoredFavoriteIds(favoriteStorageKey));
  }, [favoriteStorageKey]);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function load() {
      if (!eventId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        if (!token) {
          throw new Error('Sessão indisponível');
        }

        const [eventData, photoData, qrBlob] = await Promise.all([
          api.getEvent(token, eventId),
          api.listEventPhotos(token, eventId),
          api.fetchEventQrCode(token, eventId),
        ]);

        objectUrl = URL.createObjectURL(qrBlob);

        if (active) {
          setEvent(eventData);
          setPhotos(photoData);
          setQrPreviewUrl(objectUrl);
          setMockMode(false);
        }
      } catch {
        if (active) {
          setEvent(buildMockEvent(eventId));
          setPhotos(buildMockPhotos(eventId));
          setQrPreviewUrl(buildMockQrDataUrl());
          setMockMode(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [eventId, token]);

  const publicUrl = useMemo(() => {
    if (!event) {
      return '';
    }

    return buildPublicEventUrl(event.slug);
  }, [event]);

  const guestCount = useMemo(() => {
    const uniqueGuests = new Set(
      photos
        .map((photo) => photo.guestName?.trim())
        .filter((name): name is string => Boolean(name)),
    );

    return uniqueGuests.size;
  }, [photos]);

  const messagePhotos = useMemo(
    () =>
      photos
        .filter((photo) => photo.guestMessage?.trim())
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [photos],
  );

  const favoritePhotos = useMemo(
    () => photos.filter((photo) => favorites.includes(photo.id)),
    [favorites, photos],
  );

  const galleryPreview = useMemo(() => photos.slice(0, 6), [photos]);

  function toggleFavorite(photoId: string) {
    if (!favoriteStorageKey) {
      return;
    }

    setFavorites((current) => {
      const next = current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId];

      writeStoredFavoriteIds(favoriteStorageKey, next);

      return next;
    });
  }

  async function copyPublicLink() {
    if (!publicUrl) {
      return;
    }

    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  async function shareEvent() {
    if (!publicUrl) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: event?.title,
        text: 'Compartilhe fotos e recados deste evento pela Memora.',
        url: publicUrl,
      });

      return;
    }

    await copyPublicLink();
  }

  return {
    event,
    photos,
    qrPreviewUrl,
    publicUrl,
    loading,
    mockMode,
    copied,
    favorites,
    guestCount,
    messagePhotos,
    favoritePhotos,
    galleryPreview,
    toggleFavorite,
    copyPublicLink,
    shareEvent,
  };
}
