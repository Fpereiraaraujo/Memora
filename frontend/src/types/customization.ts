export interface PublicPageCustomization {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
  coverImageUrl: string | null;
  highlightImageUrls: string[];
  updatedAt: string | null;
}

export interface PublicPageCustomizationUpdateRequest {
  title: string;
  eventDate: string | null;
  welcomeMessage: string;
}

export interface PublicPageImageUploadResponse {
  coverImageUrl?: string | null;
  highlightImageUrls?: string[];
}
