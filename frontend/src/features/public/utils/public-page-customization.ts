import type { PublicPageCustomization } from '@/types/customization';
import type { EventSummary } from '@/types/event';

function safeString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

export function normalizePublicPageCustomization(value: unknown): PublicPageCustomization | null {
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
    updatedAt: typeof data.updatedAt === 'string' && data.updatedAt.trim() ? data.updatedAt : null,
  };
}

export function buildDefaultPublicPageCustomization(event: EventSummary): PublicPageCustomization {
  return {
    title: event.title,
    eventDate: event.eventDate,
    welcomeMessage: getDefaultWelcomeMessage(event),
    coverImageUrl: null,
    highlightImageUrls: [],
    updatedAt: null,
  };
}

export function mergePublicPageCustomization(
  event: EventSummary,
  customization?: PublicPageCustomization | null,
): PublicPageCustomization {
  const fallback = buildDefaultPublicPageCustomization(event);

  if (!customization) {
    return fallback;
  }

  return {
    ...fallback,
    ...customization,
    title: customization.title.trim() || fallback.title,
    welcomeMessage: customization.welcomeMessage.trim() || fallback.welcomeMessage,
    eventDate: customization.eventDate ?? fallback.eventDate,
    coverImageUrl: customization.coverImageUrl ?? fallback.coverImageUrl,
    highlightImageUrls: customization.highlightImageUrls ?? [],
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
