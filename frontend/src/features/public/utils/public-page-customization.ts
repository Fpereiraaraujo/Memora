import type {
  EventDecorativeImagePosition,
  PublicPageCustomization,
} from '@/types/customization';
import type { EventSummary } from '@/types/event';
import {
  isEventDecorationStyle,
  isEventThemeTemplateCode,
  resolveEventTheme,
} from '@/features/public/utils/event-theme';

function safeString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

const DECORATIVE_IMAGE_POSITIONS: EventDecorativeImagePosition[] = [
  'HERO_RIGHT',
  'HERO_BOTTOM',
  'PAGE_TOP_RIGHT',
  'PAGE_BOTTOM_LEFT',
];

function normalizeDecorativeImagePosition(value: unknown): EventDecorativeImagePosition {
  return DECORATIVE_IMAGE_POSITIONS.includes(value as EventDecorativeImagePosition)
    ? value as EventDecorativeImagePosition
    : 'HERO_RIGHT';
}

export function normalizePublicPageCustomization(value: unknown): PublicPageCustomization | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const data = value as Partial<PublicPageCustomization>;
  const theme = resolveEventTheme(data);

  return {
    title: safeString(data.title),
    eventDate: typeof data.eventDate === 'string' && data.eventDate.trim() ? data.eventDate : null,
    welcomeMessage: safeString(data.welcomeMessage),
    coverImageUrl: typeof data.coverImageUrl === 'string' && data.coverImageUrl.trim() ? data.coverImageUrl : null,
    highlightImageUrls: Array.isArray(data.highlightImageUrls)
      ? data.highlightImageUrls.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [],
    decorativeImageUrl:
      typeof data.decorativeImageUrl === 'string' && data.decorativeImageUrl.trim()
        ? data.decorativeImageUrl
        : null,
    decorativeImagePosition: normalizeDecorativeImagePosition(data.decorativeImagePosition),
    publicGalleryEnabled: data.publicGalleryEnabled !== false,
    templateCode: isEventThemeTemplateCode(data.templateCode)
      ? data.templateCode
      : theme.templateCode,
    primaryColor: theme.primary,
    secondaryColor: theme.secondary,
    accentColor: theme.accent,
    decorationStyle: isEventDecorationStyle(data.decorationStyle)
      ? data.decorationStyle
      : theme.decorationStyle,
    updatedAt: typeof data.updatedAt === 'string' && data.updatedAt.trim() ? data.updatedAt : null,
  };
}

export function buildDefaultPublicPageCustomization(event: EventSummary): PublicPageCustomization {
  const theme = resolveEventTheme();

  return {
    title: event.title,
    eventDate: event.eventDate,
    welcomeMessage: getDefaultWelcomeMessage(event),
    coverImageUrl: null,
    highlightImageUrls: [],
    decorativeImageUrl: null,
    decorativeImagePosition: 'HERO_RIGHT',
    publicGalleryEnabled: true,
    templateCode: theme.templateCode,
    primaryColor: theme.primary,
    secondaryColor: theme.secondary,
    accentColor: theme.accent,
    decorationStyle: theme.decorationStyle,
    updatedAt: null,
  };
}

export function mergePublicPageCustomization(
  event: EventSummary,
  customization?: PublicPageCustomization | null,
): PublicPageCustomization {
  const fallback = buildDefaultPublicPageCustomization(event);
  const normalized = normalizePublicPageCustomization(customization);

  if (!normalized) {
    return fallback;
  }

  return {
    ...fallback,
    ...normalized,
    title: normalized.title.trim() || fallback.title,
    welcomeMessage: normalized.welcomeMessage.trim() || fallback.welcomeMessage,
    eventDate: normalized.eventDate ?? fallback.eventDate,
    coverImageUrl: normalized.coverImageUrl ?? fallback.coverImageUrl,
    highlightImageUrls: normalized.highlightImageUrls,
    decorativeImageUrl: normalized.decorativeImageUrl,
  };
}

export function getDefaultWelcomeMessage(event: EventSummary) {
  if (event.type === 'WEDDING') {
    return 'Ajude os anfitriões a guardar cada detalhe desse dia especial. Compartilhe suas fotos, seus bastidores e seu recado com carinho.';
  }

  if (event.type === 'BIRTHDAY') {
    return 'Compartilhe os melhores momentos dessa celebração e ajude a montar uma lembrança coletiva.';
  }

  if (event.type === 'GRADUATION') {
    return 'Registre os momentos mais marcantes dessa conquista e compartilhe com todos que fizeram parte.';
  }

  return 'Compartilhe suas fotos e ajude a montar uma lembrança coletiva deste evento.';
}
