export type EventType =
  | 'WEDDING'
  | 'BIRTHDAY'
  | 'GRADUATION'
  | 'BABY_SHOWER'
  | 'BAPTISM'
  | 'CORPORATE'
  | 'OTHER';

export type EventStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';
export type EventPlanCode = 'ESSENTIAL' | 'EVENT' | 'PREMIUM';

export interface EventSummary {
  id: string;
  type: EventType;
  title: string;
  slug: string;
  eventDate: string | null;
  location: string | null;
  status: EventStatus;
  planCode: EventPlanCode | null;
  photoLimit: number | null;
  storageExpiresAt: string | null;
  paidAt: string | null;
}

export interface EventCreateRequest {
  type: EventType;
  title: string;
  eventDate?: string | null;
  location?: string | null;
}

export interface EventUpdateRequest {
  type?: EventType | null;
  title?: string | null;
  eventDate?: string | null;
  location?: string | null;
}

export const EVENT_TYPES: EventType[] = [
  'WEDDING',
  'BIRTHDAY',
  'GRADUATION',
  'BABY_SHOWER',
  'BAPTISM',
  'CORPORATE',
  'OTHER',
];

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: 'Rascunho',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  EXPIRED: 'Expirado',
};
