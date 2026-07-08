import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/auth-context';
import {
  buildMockEvent,
  buildMockPhotos,
  buildMockQrDataUrl,
} from '@/features/events/utils/event-dashboard-mock';
import {
  buildPublicEventUrl,
  buildPublicUploadUrl,
} from '@/features/events/utils/event-dashboard-formatters';
import { groupGuestMessages } from '@/features/events/utils/group-guest-messages';
import { api } from '@/lib/api';
import type { EventSummary } from '@/types/event';
import type { EventGuestMessage } from '@/types/message';
import type { Photo } from '@/types/photo';

export interface UseEventDashboardResult {
  event: EventSummary | null;
  photos: Photo[];
  mediaPhotos: Photo[];
  qrPreviewUrl: string | null;
  publicPageUrl: string;
  publicUploadUrl: string;
  loading: boolean;
  mockMode: boolean;
  copied: boolean;
  uploadLinkCopied: boolean;
  favorites: string[];
  guestCount: number;
  messages: EventGuestMessage[];
  favoritePhotos: Photo[];
  galleryPreview: Photo[];
  toggleFavorite: (photoId: string) => Promise<void>;
  copyPublicLink: () => Promise<void>;
  copyUploadLink: () => Promise<void>;
  shareEvent: () => Promise<void>;
  publicLinksEnabled: boolean;
}

export function useEventDashboard(eventId?: string): UseEventDashboardResult {
  const { token } = useAuth();

  const [event, setEvent] = useState<EventSummary | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [mockMode, setMockMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadLinkCopied, setUploadLinkCopied] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

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
          throw new Error('Sessao indisponivel');
        }

        const eventData = await api.getEvent(token, eventId);
        const normalizedEvent =
          eventData.status === 'DRAFT'
            ? await api.updateEventStatus(token, eventId, 'ACTIVE').catch(() => eventData)
            : eventData;
        const [photoResult, qrResult] = await Promise.allSettled([
          api.listEventPhotos(token, eventId),
          api.fetchEventQrCode(token, eventId),
        ]);

        const photoData = photoResult.status === 'fulfilled' ? photoResult.value : [];

        if (qrResult.status === 'fulfilled' && qrResult.value) {
          objectUrl = URL.createObjectURL(qrResult.value);
        }

        if (active) {
          setEvent(normalizedEvent);
          setPhotos(photoData);
          setFavorites(photoData.filter((photo) => photo.favorite).map((photo) => photo.id));
          setQrPreviewUrl(objectUrl);
          setMockMode(false);
        }
      } catch {
        if (active) {
          const mockPhotos = buildMockPhotos(eventId);
          setEvent(buildMockEvent(eventId));
          setPhotos(mockPhotos);
          setFavorites(mockPhotos.filter((photo) => photo.favorite).map((photo) => photo.id));
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

  const publicPageUrl = useMemo(() => {
    if (!event) {
      return '';
    }

    return buildPublicEventUrl(event.slug);
  }, [event]);

  const publicUploadUrl = useMemo(() => {
    if (!event) {
      return '';
    }

    return buildPublicUploadUrl(event.slug);
  }, [event]);

  const publicLinksEnabled = Boolean(event?.slug);

  const guestCount = useMemo(() => {
    const uniqueGuests = new Set(
      photos
        .map((photo) => photo.guestName?.trim())
        .filter((name): name is string => Boolean(name)),
    );

    return uniqueGuests.size;
  }, [photos]);

  const messages = useMemo(() => groupGuestMessages(photos), [photos]);

  const mediaPhotos = useMemo(
    () => photos.filter((photo) => Boolean(photo.downloadUrl)),
    [photos],
  );

  const favoritePhotos = useMemo(
    () => mediaPhotos.filter((photo) => favorites.includes(photo.id)),
    [favorites, mediaPhotos],
  );

  const galleryPreview = useMemo(() => mediaPhotos.slice(0, 6), [mediaPhotos]);

  async function toggleFavorite(photoId: string) {
    if (!eventId) {
      return;
    }

    const targetPhoto = photos.find((photo) => photo.id === photoId);
    if (!targetPhoto) {
      return;
    }

    const nextFavorite = !targetPhoto.favorite;

    if (mockMode || !token) {
      setPhotos((current) =>
        current.map((photo) =>
          photo.id === photoId ? { ...photo, favorite: nextFavorite } : photo,
        ),
      );
      setFavorites((current) =>
        nextFavorite ? [...current, photoId] : current.filter((id) => id !== photoId),
      );
      return;
    }

    const updatedPhoto = await api.updatePhotoFavorite(token, eventId, photoId, {
      favorite: nextFavorite,
    });

    setPhotos((current) =>
      current.map((photo) => (photo.id === photoId ? updatedPhoto : photo)),
    );
    setFavorites((current) =>
      updatedPhoto.favorite
        ? Array.from(new Set([...current, photoId]))
        : current.filter((id) => id !== photoId),
    );
  }

  async function copyPublicLink() {
    if (!publicPageUrl || !publicLinksEnabled) {
      return;
    }

    await navigator.clipboard.writeText(publicPageUrl);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  async function copyUploadLink() {
    if (!publicUploadUrl || !publicLinksEnabled) {
      return;
    }

    await navigator.clipboard.writeText(publicUploadUrl);
    setUploadLinkCopied(true);

    window.setTimeout(() => {
      setUploadLinkCopied(false);
    }, 1800);
  }

  async function shareEvent() {
    if (!publicPageUrl || !publicLinksEnabled) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: event?.title,
        text: 'Compartilhe fotos e recados deste evento pela Memora.',
        url: publicPageUrl,
      });

      return;
    }

    await copyPublicLink();
  }

  return {
    event,
    photos,
    mediaPhotos,
    qrPreviewUrl,
    publicPageUrl,
    publicUploadUrl,
    loading,
    mockMode,
    copied,
    uploadLinkCopied,
    favorites,
    guestCount,
    messages,
    favoritePhotos,
    galleryPreview,
    toggleFavorite,
    copyPublicLink,
    copyUploadLink,
    shareEvent,
    publicLinksEnabled,
  };
}
