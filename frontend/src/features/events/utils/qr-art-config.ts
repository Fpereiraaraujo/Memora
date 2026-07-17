import type { EventSummary, EventType } from '@/types/event';
import type {
  EventQrArtCustomization,
  QrArtFormat,
  QrArtTemplateCode,
  QrArtVisualStyle,
} from '@/types/qr-art';

export interface QrArtTemplate {
  code: QrArtTemplateCode;
  name: string;
  description: string;
  style: QrArtVisualStyle;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const QR_ART_TEMPLATES: QrArtTemplate[] = [
  {
    code: 'KIDS_BLUE',
    name: 'Infantil azul',
    description: 'Nuvens, estrelas e formas suaves.',
    style: 'KIDS',
    primaryColor: '#A9D9F5',
    secondaryColor: '#FFF9EE',
    accentColor: '#F4C95D',
  },
  {
    code: 'ELEGANT_FLORAL',
    name: 'Floral elegante',
    description: 'Ramos delicados e composição editorial.',
    style: 'ELEGANT',
    primaryColor: '#D99A9F',
    secondaryColor: '#FFF9F5',
    accentColor: '#B88A44',
  },
  {
    code: 'PARTY_FUN',
    name: 'Festa divertida',
    description: 'Balões, confetes e cores alegres.',
    style: 'FUN',
    primaryColor: '#F28E94',
    secondaryColor: '#FFF7E8',
    accentColor: '#5AA7A7',
  },
  {
    code: 'MINIMAL_CHIC',
    name: 'Minimal chic',
    description: 'Espaço em branco e detalhes refinados.',
    style: 'MINIMAL',
    primaryColor: '#244C5A',
    secondaryColor: '#F7F1E7',
    accentColor: '#C49A55',
  },
  {
    code: 'BABY_REVEAL',
    name: 'Doce expectativa',
    description: 'Azul, rosa e nuvens acolhedoras.',
    style: 'DELICATE',
    primaryColor: '#AFCFE8',
    secondaryColor: '#FFF8F2',
    accentColor: '#E8A7B2',
  },
];

export const QR_ART_FORMATS: Array<{
  value: QrArtFormat;
  label: string;
  description: string;
}> = [
  { value: 'A5_VERTICAL', label: 'A5 vertical', description: 'Ideal para mesas' },
  { value: 'A4_VERTICAL', label: 'A4 vertical', description: 'Placas e entrada' },
  { value: 'SQUARE', label: 'Quadrado', description: 'Redes sociais' },
  { value: 'STORY', label: 'Story', description: '1080 x 1920' },
];

export const QR_ART_EXPORT_SIZE: Record<QrArtFormat, { width: number; height: number }> = {
  A5_VERTICAL: { width: 1748, height: 2480 },
  A4_VERTICAL: { width: 2480, height: 3508 },
  SQUARE: { width: 1080, height: 1080 },
  STORY: { width: 1080, height: 1920 },
};

export const QR_ART_VIEWBOX: Record<QrArtFormat, { width: number; height: number }> = {
  A5_VERTICAL: { width: 700, height: 994 },
  A4_VERTICAL: { width: 700, height: 990 },
  SQUARE: { width: 700, height: 700 },
  STORY: { width: 700, height: 1244 },
};

const EVENT_LABELS: Record<EventType, string> = {
  WEDDING: 'Celebração de casamento',
  BIRTHDAY: 'Celebração de aniversário',
  GRADUATION: 'Celebração de formatura',
  BABY_SHOWER: 'Celebração de chá de bebê',
  BAPTISM: 'Celebração de batizado',
  CORPORATE: 'Evento especial',
  OTHER: 'Celebração especial',
};

function defaultTemplateFor(type: EventType) {
  if (type === 'WEDDING' || type === 'BAPTISM') return QR_ART_TEMPLATES[1];
  if (type === 'BABY_SHOWER') return QR_ART_TEMPLATES[4];
  if (type === 'CORPORATE' || type === 'GRADUATION') return QR_ART_TEMPLATES[3];
  return QR_ART_TEMPLATES[2];
}

export function buildDefaultQrArtCustomization(event: EventSummary): EventQrArtCustomization {
  const template = defaultTemplateFor(event.type);

  return {
    eventType: event.type,
    eventDate: event.eventDate,
    eventLocation: event.location,
    title: event.title,
    subtitle: EVENT_LABELS[event.type],
    callToAction: 'Escaneie e envie suas fotos',
    message: 'Ajude a guardar as memórias desse dia especial',
    themeName: null,
    primaryColor: template.primaryColor,
    secondaryColor: template.secondaryColor,
    accentColor: template.accentColor,
    visualStyle: template.style,
    templateCode: template.code,
    format: 'A5_VERTICAL',
    showMemoraBranding: true,
    showEventDate: false,
    showEventLocation: false,
    updatedAt: null,
  };
}

export function applyQrArtTemplate(
  customization: EventQrArtCustomization,
  template: QrArtTemplate,
): EventQrArtCustomization {
  return {
    ...customization,
    templateCode: template.code,
    visualStyle: template.style,
    primaryColor: template.primaryColor,
    secondaryColor: template.secondaryColor,
    accentColor: template.accentColor,
  };
}

export function toQrArtUpdateRequest(customization: EventQrArtCustomization) {
  const {
    eventType: _eventType,
    eventDate: _eventDate,
    eventLocation: _eventLocation,
    updatedAt: _updatedAt,
    ...request
  } = customization;

  return request;
}
