import type { EventType } from '@/types/event';

export type QrArtVisualStyle = 'DELICATE' | 'FUN' | 'ELEGANT' | 'MINIMAL' | 'KIDS';
export type QrArtTemplateCode =
  | 'KIDS_BLUE'
  | 'ELEGANT_FLORAL'
  | 'PARTY_FUN'
  | 'MINIMAL_CHIC'
  | 'BABY_REVEAL';
export type QrArtFormat = 'A5_VERTICAL' | 'A4_VERTICAL' | 'SQUARE' | 'STORY';

export interface EventQrArtCustomization {
  eventType: EventType;
  eventDate: string | null;
  eventLocation: string | null;
  title: string;
  subtitle: string | null;
  callToAction: string;
  message: string | null;
  themeName: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  visualStyle: QrArtVisualStyle;
  templateCode: QrArtTemplateCode;
  format: QrArtFormat;
  showMemoraBranding: boolean;
  showEventDate: boolean;
  showEventLocation: boolean;
  updatedAt: string | null;
}

export type EventQrArtCustomizationUpdateRequest = Omit<
  EventQrArtCustomization,
  'eventType' | 'eventDate' | 'eventLocation' | 'updatedAt'
>;
