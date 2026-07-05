export type PhotoStatus = 'UPLOAD_REQUESTED' | 'RECEIVED' | 'AVAILABLE' | 'HIDDEN' | 'REMOVED';

export interface Photo {
  id: string;
  originalFilename: string;
  objectKey: string;
  contentType: string;
  sizeBytes: number;
  status: PhotoStatus;
  favorite: boolean;
  guestName: string | null;
  guestMessage: string | null;
  createdAt: string;
  downloadUrl: string;
}

export interface GuestUploadItemResponse {
  photoId: string;
  objectKey: string;
  status: PhotoStatus;
  originalFilename: string;
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
