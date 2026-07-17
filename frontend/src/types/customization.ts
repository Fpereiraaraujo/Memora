export interface PublicPageCustomization {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
  coverImageUrl: string | null;
  highlightImageUrls: string[];
  publicGalleryEnabled: boolean;
  updatedAt: string | null;
}

export const EMPTY_PUBLIC_PAGE_CUSTOMIZATION: PublicPageCustomization = {
  title: '',
  eventDate: null,
  welcomeMessage: '',
  coverImageUrl: null,
  highlightImageUrls: [],
  publicGalleryEnabled: true,
  updatedAt: null,
};

export interface PublicPageCustomizationUpdateRequest {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
  publicGalleryEnabled: boolean;
}

export interface PublicPageImageUploadResponse {
  coverImageUrl?: string | null;
  highlightImageUrls?: string[];
}
