import axios from 'axios';
import { API_BASE_URL } from '@/lib/env';
import type { PageResponse } from '@/types/api';
import type { EventCreateRequest, EventSummary, EventUpdateRequest } from '@/types/event';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth';
import type {
  GuestUploadResponse,
  Photo,
  PhotoFavoriteUpdateRequest,
  PhotoStatusUpdateRequest,
} from '@/types/photo';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

function extractErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Ocorreu um erro inesperado';
  }

  const responseData = error.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === 'object' && 'error' in responseData) {
    const message = (responseData as { error?: unknown }).error;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return error.message || 'Ocorreu um erro inesperado';
}

async function extractBlobError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    throw error;
  }

  const responseData = error.response?.data;

  if (responseData instanceof Blob) {
    const text = await responseData.text().catch(() => '');

    try {
      const parsed = JSON.parse(text) as { error?: unknown };
      if (typeof parsed.error === 'string' && parsed.error.trim()) {
        throw new Error(parsed.error);
      }
    } catch {
      if (text.trim()) {
        throw new Error(text);
      }
    }
  }

  throw new Error(extractErrorMessage(error));
}

function authHeaders(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

async function request<T>(path: string, options: {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  token?: string | null;
  data?: unknown;
}): Promise<T> {
  try {
    const response = await http.request<T>({
      url: path,
      method: options.method,
      data: options.data,
      headers: authHeaders(options.token),
    });

    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export const api = {
  register(requestBody: RegisterRequest) {
    return request<User>('/api/auth/register', { method: 'POST', data: requestBody });
  },
  login(requestBody: LoginRequest) {
    return request<LoginResponse>('/api/auth/login', { method: 'POST', data: requestBody });
  },
  me(token: string) {
    return request<User>('/api/me', { method: 'GET', token });
  },
  listEvents(token: string) {
    return request<EventSummary[]>('/api/events', { method: 'GET', token });
  },
  createEvent(token: string, requestBody: EventCreateRequest) {
    return request<EventSummary>('/api/events', { method: 'POST', token, data: requestBody });
  },
  updateEvent(token: string, eventId: string, requestBody: EventUpdateRequest) {
    return request<EventSummary>(`/api/events/${eventId}`, { method: 'PATCH', token, data: requestBody });
  },
  getEvent(token: string, eventId: string) {
    return request<EventSummary>(`/api/events/${eventId}`, { method: 'GET', token });
  },
  async fetchEventQrCode(token: string, eventId: string) {
    try {
      const response = await http.get<Blob>(`/api/events/${eventId}/qrcode`, {
        headers: authHeaders(token),
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      await extractBlobError(error);
      throw error;
    }
  },
  listEventPhotos(token: string, eventId: string) {
    return request<Photo[]>(`/api/events/${eventId}/photos`, { method: 'GET', token });
  },
  listEventPhotosPage(token: string, eventId: string, page: number, size: number) {
    return request<PageResponse<Photo>>(`/api/events/${eventId}/photos/page?page=${page}&size=${size}`, {
      method: 'GET',
      token,
    });
  },
  updatePhotoFavorite(token: string, eventId: string, photoId: string, requestBody: PhotoFavoriteUpdateRequest) {
    return request<Photo>(`/api/events/${eventId}/photos/${photoId}/favorite`, {
      method: 'PATCH',
      token,
      data: requestBody,
    });
  },
  updatePhotoStatus(token: string, eventId: string, photoId: string, requestBody: PhotoStatusUpdateRequest) {
    return request<Photo>(`/api/events/${eventId}/photos/${photoId}/status`, {
      method: 'PATCH',
      token,
      data: requestBody,
    });
  },
  getPublicEvent(slug: string) {
    return request<EventSummary>(`/api/public/events/${slug}`, { method: 'GET' });
  },
  listPublicEventPhotos(slug: string) {
    return request<Photo[]>(`/api/public/events/${slug}/photos`, { method: 'GET' });
  },
  listPublicEventPhotosPage(slug: string, page: number, size: number) {
    return request<PageResponse<Photo>>(`/api/public/events/${slug}/photos/page?page=${page}&size=${size}`, {
      method: 'GET',
    });
  },
  uploadGuestPhoto(slug: string, formData: FormData) {
    return request<GuestUploadResponse>(`/api/public/events/${slug}/uploads`, { method: 'POST', data: formData });
  },
};

export function mediaUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
