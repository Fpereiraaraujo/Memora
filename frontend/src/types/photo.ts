export type PhotoStatus = 'UPLOAD_REQUESTED' | 'RECEIVED' | 'AVAILABLE' | 'HIDDEN' | 'REMOVED';

export interface Photo {
  id: string;
  originalFilename: string;
  objectKey: string;
  contentType: string;
  sizeBytes: number;
  status: PhotoStatus;
  guestName: string | null;
  guestMessage: string | null;
  createdAt: string;
  downloadUrl: string;
}

export interface GuestUploadResponse {
  photoId: string;
  objectKey: string;
  status: PhotoStatus;
  message: string;
}
