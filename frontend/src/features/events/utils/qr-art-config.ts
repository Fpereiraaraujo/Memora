import type { EventSummary, EventType } from '@/types/event';
import { getEventThemeTemplate, resolveEventTheme } from '@/features/public/utils/event-theme';
import type { EventThemeTemplateCode, PublicPageCustomization } from '@/types/customization';
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
    code: 'MEMORA_CLASSIC',
    name: 'Memora clássico',
    description: 'Corações delicados, creme e toque dourado.',
    style: 'DELICATE',
    primaryColor: '#EF7885',
    secondaryColor: '#FFF3E6',
    accentColor: '#C5922E',
  },
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

const QR_TEMPLATE_BY_EVENT_THEME: Record<EventThemeTemplateCode, QrArtTemplateCode> = {
  MEMORA_CLASSIC: 'MEMORA_CLASSIC',
  KIDS_SKY: 'KIDS_BLUE',
  KIDS_BLUSH: 'BABY_REVEAL',
  FLORAL_ELEGANT: 'ELEGANT_FLORAL',
  PARTY_BOLD: 'PARTY_FUN',
};

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

export type QrArtPrintFormat = Extract<QrArtFormat, 'A5_VERTICAL' | 'A4_VERTICAL'>;

export const QR_ART_PRINT_BLEED_MM = 3;

export const QR_ART_PRINT_SIZE: Record<
  QrArtPrintFormat,
  { widthMm: number; heightMm: number }
> = {
  A5_VERTICAL: { widthMm: 148, heightMm: 210 },
  A4_VERTICAL: { widthMm: 210, heightMm: 297 },
};

export function isQrArtPrintFormat(format: QrArtFormat): format is QrArtPrintFormat {
  return format === 'A5_VERTICAL' || format === 'A4_VERTICAL';
}

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

export function applyPublicPageIdentityToQrArt(
  customization: EventQrArtCustomization,
  publicPage: PublicPageCustomization,
): EventQrArtCustomization {
  const theme = resolveEventTheme(publicPage);
  const templateCode = QR_TEMPLATE_BY_EVENT_THEME[theme.templateCode];
  const template = QR_ART_TEMPLATES.find((candidate) => candidate.code === templateCode)
    ?? QR_ART_TEMPLATES[0];
  const publicTemplate = getEventThemeTemplate(theme.templateCode);

  return {
    ...customization,
    title: publicPage.title.trim() || customization.title,
    themeName: publicTemplate.name,
    primaryColor: theme.primary,
    secondaryColor: theme.secondary,
    accentColor: theme.accent,
    visualStyle: template.style,
    templateCode: template.code,
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
