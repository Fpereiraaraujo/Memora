export type EventThemeTemplateCode =
  | 'MEMORA_CLASSIC'
  | 'KIDS_SKY'
  | 'KIDS_BLUSH'
  | 'FLORAL_ELEGANT'
  | 'PARTY_BOLD';

export type EventDecorationStyle =
  | 'HEARTS'
  | 'CLOUDS_STARS'
  | 'FLORAL'
  | 'CONFETTI';

export type EventDecorativeImagePosition =
  | 'HERO_RIGHT'
  | 'HERO_BOTTOM'
  | 'PAGE_TOP_RIGHT'
  | 'PAGE_BOTTOM_LEFT';

export interface PublicPageCustomization {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
  coverImageUrl: string | null;
  highlightImageUrls: string[];
  decorativeImageUrl: string | null;
  decorativeImagePosition: EventDecorativeImagePosition;
  publicGalleryEnabled: boolean;
  templateCode: EventThemeTemplateCode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  decorationStyle: EventDecorationStyle;
  updatedAt: string | null;
}

export const EMPTY_PUBLIC_PAGE_CUSTOMIZATION: PublicPageCustomization = {
  title: '',
  eventDate: null,
  welcomeMessage: '',
  coverImageUrl: null,
  highlightImageUrls: [],
  decorativeImageUrl: null,
  decorativeImagePosition: 'HERO_RIGHT',
  publicGalleryEnabled: true,
  templateCode: 'MEMORA_CLASSIC',
  primaryColor: '#EF7885',
  secondaryColor: '#FFF3E6',
  accentColor: '#C5922E',
  decorationStyle: 'HEARTS',
  updatedAt: null,
};

export interface PublicPageCustomizationUpdateRequest {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
  publicGalleryEnabled: boolean;
  templateCode: EventThemeTemplateCode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  decorationStyle: EventDecorationStyle;
  decorativeImagePosition: EventDecorativeImagePosition;
}

export interface PublicPageImageUploadResponse {
  coverImageUrl?: string | null;
  highlightImageUrls?: string[];
}

export interface PublicPageDecorativeImageUploadResponse {
  decorativeImageUrl: string | null;
}
