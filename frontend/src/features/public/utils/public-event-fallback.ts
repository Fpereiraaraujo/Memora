import type { EventSummary, EventType } from '@/types/event';

const UUID_SUFFIX_PATTERN = /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EVENT_PREFIXES: Record<string, { type: EventType; label: string }> = {
  casamento: { type: 'WEDDING', label: 'Casamento' },
  wedding: { type: 'WEDDING', label: 'Casamento' },
  aniversario: { type: 'BIRTHDAY', label: 'Aniversário' },
  birthday: { type: 'BIRTHDAY', label: 'Aniversário' },
  formatura: { type: 'GRADUATION', label: 'Formatura' },
  graduation: { type: 'GRADUATION', label: 'Formatura' },
  cha: { type: 'BABY_SHOWER', label: 'Chá de bebê' },
  batizado: { type: 'BAPTISM', label: 'Batizado' },
  corporativo: { type: 'CORPORATE', label: 'Evento corporativo' },
  corporate: { type: 'CORPORATE', label: 'Evento corporativo' },
};

function titleCase(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function buildFallbackPublicEvent(slug: string): EventSummary {
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const cleanSlug = normalizedSlug.replace(UUID_SUFFIX_PATTERN, '');
  const parts = cleanSlug.split('-').filter(Boolean);

  const prefix = parts[0] ?? '';
  const eventInfo = EVENT_PREFIXES[prefix] ?? { type: 'OTHER' as EventType, label: 'Evento Memora' };

  const nameParts = EVENT_PREFIXES[prefix] ? parts.slice(1) : parts;
  const title = nameParts.length > 0 ? titleCase(nameParts.join('-')) : eventInfo.label;

  return {
    id: slug,
    type: eventInfo.type,
    title,
    slug,
    eventDate: null,
    location: null,
    status: 'ACTIVE',
    planCode: null,
    photoLimit: null,
    storageExpiresAt: null,
    paidAt: null,
  };
}
