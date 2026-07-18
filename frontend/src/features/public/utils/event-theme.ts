import type { CSSProperties } from 'react';

import type {
  EventDecorationStyle,
  EventThemeTemplateCode,
  PublicPageCustomization,
} from '@/types/customization';

export interface EventThemeTemplate {
  code: EventThemeTemplateCode;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  decorationStyle: EventDecorationStyle;
}

export interface ResolvedEventTheme {
  templateCode: EventThemeTemplateCode;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  foreground: string;
  mutedForeground: string;
  onPrimary: string;
  primaryHover: string;
  primaryInk: string;
  accentInk: string;
  primarySoft: string;
  accentSoft: string;
  border: string;
  primaryShadow: string;
  primaryMist: string;
  accentMist: string;
  decorationStyle: EventDecorationStyle;
}

export type EventThemeCssVariables = CSSProperties & {
  '--event-primary-color': string;
  '--event-secondary-color': string;
  '--event-accent-color': string;
  '--event-surface-color': string;
  '--event-foreground-color': string;
  '--event-muted-foreground-color': string;
  '--event-on-primary-color': string;
  '--event-primary-hover-color': string;
  '--event-primary-ink-color': string;
  '--event-accent-ink-color': string;
  '--event-primary-soft-color': string;
  '--event-accent-soft-color': string;
  '--event-border-color': string;
  '--event-primary-shadow-color': string;
  '--event-primary-mist-color': string;
  '--event-accent-mist-color': string;
};

export const EVENT_THEME_TEMPLATES: readonly EventThemeTemplate[] = [
  {
    code: 'MEMORA_CLASSIC',
    name: 'Memora clássico',
    description: 'Rosa suave, creme e detalhes dourados.',
    primaryColor: '#EF7885',
    secondaryColor: '#FFF3E6',
    accentColor: '#C5922E',
    decorationStyle: 'HEARTS',
  },
  {
    code: 'KIDS_SKY',
    name: 'Céu infantil',
    description: 'Azul bebê, nuvens e estrelas delicadas.',
    primaryColor: '#6AAEE8',
    secondaryColor: '#D9EFFF',
    accentColor: '#FFD66B',
    decorationStyle: 'CLOUDS_STARS',
  },
  {
    code: 'KIDS_BLUSH',
    name: 'Doce infância',
    description: 'Rosa leve, formas macias e clima acolhedor.',
    primaryColor: '#E8A7B2',
    secondaryColor: '#FBE8EE',
    accentColor: '#D9A441',
    decorationStyle: 'CLOUDS_STARS',
  },
  {
    code: 'FLORAL_ELEGANT',
    name: 'Floral elegante',
    description: 'Composição editorial com ramos sutis.',
    primaryColor: '#D99A9F',
    secondaryColor: '#FFF9F5',
    accentColor: '#B88A44',
    decorationStyle: 'FLORAL',
  },
  {
    code: 'PARTY_BOLD',
    name: 'Festa vibrante',
    description: 'Confetes, contraste alegre e energia de celebração.',
    primaryColor: '#F28E94',
    secondaryColor: '#FFF7E8',
    accentColor: '#5AA7A7',
    decorationStyle: 'CONFETTI',
  },
] as const;

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const DEFAULT_TEMPLATE = EVENT_THEME_TEMPLATES[0];
const DARK_TEXT = '#211C19';
const MUTED_TEXT = '#62564F';
const WHITE = '#FFFFFF';

export function isEventThemeTemplateCode(value: unknown): value is EventThemeTemplateCode {
  return EVENT_THEME_TEMPLATES.some((template) => template.code === value);
}

export function isEventDecorationStyle(value: unknown): value is EventDecorationStyle {
  return ['HEARTS', 'CLOUDS_STARS', 'FLORAL', 'CONFETTI'].includes(String(value));
}

export function getEventThemeTemplate(code: unknown): EventThemeTemplate {
  return EVENT_THEME_TEMPLATES.find((template) => template.code === code) ?? DEFAULT_TEMPLATE;
}

export function normalizeThemeColor(value: unknown, fallback: string) {
  return typeof value === 'string' && HEX_COLOR.test(value)
    ? value.toUpperCase()
    : fallback;
}

export function resolveEventTheme(
  customization?: Partial<PublicPageCustomization> | null,
): ResolvedEventTheme {
  const template = getEventThemeTemplate(customization?.templateCode);
  const primary = normalizeThemeColor(customization?.primaryColor, template.primaryColor);
  const secondary = normalizeThemeColor(customization?.secondaryColor, template.secondaryColor);
  const accent = normalizeThemeColor(customization?.accentColor, template.accentColor);

  return {
    templateCode: template.code,
    primary,
    secondary,
    accent,
    surface: WHITE,
    foreground: DARK_TEXT,
    mutedForeground: MUTED_TEXT,
    onPrimary: getReadableTextColor(primary),
    primaryHover: mixWithBlack(primary, 0.08),
    primaryInk: getReadableColorOnWhite(primary),
    accentInk: getReadableColorOnWhite(accent),
    primarySoft: mixWithWhite(primary, 0.84),
    accentSoft: mixWithWhite(accent, 0.86),
    border: mixWithWhite(primary, 0.68),
    primaryShadow: toRgba(primary, 0.24),
    primaryMist: toRgba(primary, 0.16),
    accentMist: toRgba(accent, 0.13),
    decorationStyle: isEventDecorationStyle(customization?.decorationStyle)
      ? customization.decorationStyle
      : template.decorationStyle,
  };
}

export function applyEventThemeTemplate(
  customization: PublicPageCustomization,
  templateCode: EventThemeTemplateCode,
): PublicPageCustomization {
  const template = getEventThemeTemplate(templateCode);

  return {
    ...customization,
    templateCode: template.code,
    primaryColor: template.primaryColor,
    secondaryColor: template.secondaryColor,
    accentColor: template.accentColor,
    decorationStyle: template.decorationStyle,
  };
}

export function toEventThemeCssVariables(theme: ResolvedEventTheme): EventThemeCssVariables {
  return {
    '--event-primary-color': theme.primary,
    '--event-secondary-color': theme.secondary,
    '--event-accent-color': theme.accent,
    '--event-surface-color': theme.surface,
    '--event-foreground-color': theme.foreground,
    '--event-muted-foreground-color': theme.mutedForeground,
    '--event-on-primary-color': theme.onPrimary,
    '--event-primary-hover-color': theme.primaryHover,
    '--event-primary-ink-color': theme.primaryInk,
    '--event-accent-ink-color': theme.accentInk,
    '--event-primary-soft-color': theme.primarySoft,
    '--event-accent-soft-color': theme.accentSoft,
    '--event-border-color': theme.border,
    '--event-primary-shadow-color': theme.primaryShadow,
    '--event-primary-mist-color': theme.primaryMist,
    '--event-accent-mist-color': theme.accentMist,
  };
}

function getReadableTextColor(background: string) {
  const backgroundLuminance = getRelativeLuminance(background);
  const whiteContrast = getContrastRatio(backgroundLuminance, 1);
  const darkContrast = getContrastRatio(backgroundLuminance, getRelativeLuminance(DARK_TEXT));
  return whiteContrast >= darkContrast ? WHITE : DARK_TEXT;
}

function getContrastRatio(first: number, second: number) {
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableColorOnWhite(color: string) {
  let candidate = color;

  for (let step = 0; step < 8; step += 1) {
    if (getContrastRatio(getRelativeLuminance(candidate), 1) >= 4.5) {
      return candidate;
    }
    candidate = mixWithBlack(candidate, 0.12);
  }

  return DARK_TEXT;
}

function getRelativeLuminance(color: string) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function mixWithWhite(color: string, whiteRatio: number) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16));
  const mixed = channels.map((channel) =>
    Math.round(channel * (1 - whiteRatio) + 255 * whiteRatio)
      .toString(16)
      .padStart(2, '0'),
  );
  return `#${mixed.join('')}`.toUpperCase();
}

function mixWithBlack(color: string, blackRatio: number) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16));
  const mixed = channels.map((channel) =>
    Math.round(channel * (1 - blackRatio))
      .toString(16)
      .padStart(2, '0'),
  );
  return `#${mixed.join('')}`.toUpperCase();
}

function toRgba(color: string, alpha: number) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16));
  return `rgba(${channels.join(', ')}, ${alpha})`;
}
