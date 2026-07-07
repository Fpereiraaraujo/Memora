export type PhotoStatus = 'UPLOAD_REQUESTED' | 'RECEIVED' | 'AVAILABLE' | 'HIDDEN' | 'REMOVED';

export interface Photo {
  id: string;
  originalFilename: string | null;
  objectKey: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  status: PhotoStatus;
  favorite: boolean;
  guestName: string | null;
  guestMessage: string | null;
  createdAt: string;
  downloadUrl: string | null;
}

export interface GuestUploadItemResponse {
  photoId: string;
  objectKey: string | null;
  status: PhotoStatus;
  originalFilename: string | null;
}

export interface GuestUploadResponse {
  uploadedCount: number;
  photos: GuestUploadItemResponse[];
  message: string;
}

export interface PhotoFavoriteUpdateRequest {
  favorite: boolean;
}

export interface PhotoStatusUpdateRequest {
  status: PhotoStatus;
}
