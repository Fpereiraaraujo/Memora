import type { EventSummary } from '@/types/event';

export interface PublicPageCustomization {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
  coverImageUrl: string | null;
  highlightImageUrls: string[];
  updatedAt: string;
}

const STORAGE_PREFIX = 'memora.public-page-customization.';

function storageKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

function safeString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function normalizeCustomization(value: unknown): PublicPageCustomization | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const data = value as Partial<PublicPageCustomization>;

  return {
    title: safeString(data.title),
    eventDate: typeof data.eventDate === 'string' && data.eventDate.trim() ? data.eventDate : null,
    welcomeMessage: safeString(data.welcomeMessage),
    coverImageUrl: typeof data.coverImageUrl === 'string' && data.coverImageUrl.trim() ? data.coverImageUrl : null,
    highlightImageUrls: Array.isArray(data.highlightImageUrls)
      ? data.highlightImageUrls.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [],
    updatedAt: safeString(data.updatedAt) || new Date().toISOString(),
  };
}

export function getStoredPublicPageCustomization(slug: string): PublicPageCustomization | null {
  try {
    const value = window.localStorage.getItem(storageKey(slug));

    if (!value) {
      return null;
    }

    return normalizeCustomization(JSON.parse(value));
  } catch {
    return null;
  }
}

export function savePublicPageCustomization(slug: string, customization: PublicPageCustomization) {
  window.localStorage.setItem(storageKey(slug), JSON.stringify(customization));
}

export function removePublicPageCustomization(slug: string) {
  window.localStorage.removeItem(storageKey(slug));
}

export function buildDefaultPublicPageCustomization(event: EventSummary): PublicPageCustomization {
  return {
    title: event.title,
    eventDate: event.eventDate,
    welcomeMessage: getDefaultWelcomeMessage(event),
    coverImageUrl: null,
    highlightImageUrls: [],
    updatedAt: new Date().toISOString(),
  };
}

export function resolvePublicPageCustomization(event: EventSummary): PublicPageCustomization {
  const stored = getStoredPublicPageCustomization(event.slug);
  const fallback = buildDefaultPublicPageCustomization(event);

  if (!stored) {
    return fallback;
  }

  return {
    ...fallback,
    ...stored,
    title: stored.title.trim() || fallback.title,
    welcomeMessage: stored.welcomeMessage.trim() || fallback.welcomeMessage,
    eventDate: stored.eventDate ?? fallback.eventDate,
    coverImageUrl: stored.coverImageUrl ?? fallback.coverImageUrl,
    highlightImageUrls: stored.highlightImageUrls,
  };
}

export function getDefaultWelcomeMessage(event: EventSummary) {
  if (event.type === 'WEDDING') {
    return 'Ajude os noivos a guardar cada detalhe desse dia especial. Compartilhe suas fotos, seus bastidores e seu recado com carinho.';
  }

  if (event.type === 'BIRTHDAY') {
    return 'Compartilhe os melhores momentos dessa celebração e ajude a montar uma lembrança coletiva.';
  }

  if (event.type === 'GRADUATION') {
    return 'Registre os momentos mais marcantes dessa conquista e compartilhe com todos que fizeram parte.';
  }

  return 'Compartilhe suas fotos e ajude a montar uma lembrança coletiva deste evento.';
}
