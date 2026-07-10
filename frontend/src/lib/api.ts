import axios from 'axios';
import { API_BASE_URL } from '@/lib/env';
import type { PageResponse } from '@/types/api';
import type { EventCreateRequest, EventStatus, EventSummary, EventUpdateRequest } from '@/types/event';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth';
import type {
  EventCheckoutRequest,
  EventCheckoutResponse,
  EventCheckoutStatusResponse,
} from '@/types/payment';
import type {
  PublicPageCustomization,
  PublicPageCustomizationUpdateRequest,
  PublicPageImageUploadResponse,
} from '@/types/customization';
import type {
  GuestUploadResponse,
  Photo,
  PhotoFavoriteUpdateRequest,
  PhotoLikeUpdateRequest,
  PhotoStatusUpdateRequest,
} from '@/types/photo';

export interface AdminDashboardResponse {
  totalUsers: number;
  totalEvents: number;
  totalPhotos: number;
  totalApprovedPayments: number;
  totalPendingPayments: number;
  grossRevenueCents: number;
  totalActiveUsers: number;
  totalSuspendedUsers: number;
  totalDeletedUsers: number;
  totalActiveEvents: number;
  totalDraftEvents: number;
  totalPaymentOrders: number;
  usersCreatedToday: number;
  usersCreatedThisMonth: number;
  paymentsApprovedThisMonth: number;
  photosUploadedThisMonth: number;
  revenueByPlan: AdminPlanMetric[];
  eventsByPlan: AdminPlanMetric[];
}

export interface AdminPlanMetric { planCode: string; total: number; }
export interface AdminUser { id: string; name: string; email: string; role: string; status: string; createdAt: string; lastLoginAt: string | null; totalEvents: number; activePlanCode: string | null; totalPhotos: number; totalApprovedPayments: number; totalRevenueCents: number; }
export interface AdminEvent { eventId: string; title: string; slug: string; ownerName: string; ownerEmail: string; status: string; planCode: string | null; photoLimit: number | null; totalPhotos: number; paidAt: string | null; createdAt: string; }
export interface AdminPayment { paymentOrderId: string; userEmail: string; userName: string; eventTitle: string; planCode: string; provider: string; status: string; amountCents: number; paidAmountCents: number | null; paidAt: string | null; createdAt: string; }
export interface AdminAuditLog { id: string; createdAt: string; adminUserId: string; adminEmail: string; action: string; targetType: string; targetId: string | null; targetEmail: string | null; reason: string | null; ipAddress: string | null; }
export interface AdminActionResponse { message: string; }
export interface AdminUserEvent { eventId: string; title: string; slug: string; status: string; planCode: string | null; photoLimit: number | null; totalPhotos: number; }
export interface AdminUserDetails extends AdminUser { events: AdminUserEvent[]; payments: AdminPayment[]; }

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

  if (!error.response) {
    return 'Não foi possível se conectar agora. Verifique sua internet e tente novamente.';
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

  if ((error.response?.status ?? 0) >= 500) {
    return 'Estamos com uma instabilidade no momento. Tente novamente em instantes.';
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
  getAdminDashboard(token: string) {
    return request<AdminDashboardResponse>('/api/admin/dashboard', { method: 'GET', token });
  },
  listAdminUsers(token: string, page = 0, search = '') {
    return request<PageResponse<AdminUser>>(`/api/admin/users?page=${page}&size=20${search ? `&search=${encodeURIComponent(search)}` : ''}`, { method: 'GET', token });
  },
  getAdminUser(token: string, userId: string) {
    return request<AdminUserDetails>(`/api/admin/users/${userId}`, { method: 'GET', token });
  },
  listAdminEvents(token: string, page = 0) {
    return request<PageResponse<AdminEvent>>(`/api/admin/events?page=${page}&size=20`, { method: 'GET', token });
  },
  listAdminPayments(token: string, page = 0) {
    return request<PageResponse<AdminPayment>>(`/api/admin/payments?page=${page}&size=20`, { method: 'GET', token });
  },
  listAdminAuditLogs(token: string, page = 0) {
    return request<PageResponse<AdminAuditLog>>(`/api/admin/audit-logs?page=${page}&size=20`, { method: 'GET', token });
  },
  suspendAdminUser(token: string, userId: string, reason: string) {
    return request<AdminActionResponse>(`/api/admin/users/${userId}/suspend`, { method: 'PATCH', token, data: { reason } });
  },
  restoreAdminUser(token: string, userId: string, reason: string) {
    return request<AdminActionResponse>(`/api/admin/users/${userId}/restore`, { method: 'PATCH', token, data: { reason } });
  },
  deleteAdminUser(token: string, userId: string, confirmationEmail: string, reason: string) {
    return request<AdminActionResponse>(`/api/admin/users/${userId}`, { method: 'DELETE', token, data: { confirmationEmail, reason } });
  },
  grantAdminPlan(token: string, userId: string, eventId: string, planCode: 'ESSENTIAL' | 'EVENT' | 'PREMIUM', reason: string) {
    return request<AdminActionResponse>(`/api/admin/users/${userId}/plan`, { method: 'PATCH', token, data: { eventId, planCode, reason } });
  },
  listEvents(token: string) {
    return request<EventSummary[]>('/api/events', { method: 'GET', token });
  },
  createEvent(token: string, requestBody: EventCreateRequest) {
    return request<EventSummary>('/api/events', { method: 'POST', token, data: requestBody });
  },
  createEventCheckout(token: string, eventId: string, requestBody: EventCheckoutRequest) {
    return request<EventCheckoutResponse>(`/api/events/${eventId}/checkout`, {
      method: 'POST',
      token,
      data: requestBody,
    });
  },
  getEventCheckoutStatus(token: string, eventId: string) {
    return request<EventCheckoutStatusResponse>(`/api/events/${eventId}/checkout/status`, {
      method: 'GET',
      token,
    });
  },
  updateEvent(token: string, eventId: string, requestBody: EventUpdateRequest) {
    return request<EventSummary>(`/api/events/${eventId}`, { method: 'PATCH', token, data: requestBody });
  },
  updateEventStatus(token: string, eventId: string, status: EventStatus) {
    return request<EventSummary>(`/api/events/${eventId}/status`, {
      method: 'PATCH',
      token,
      data: { status },
    });
  },
  getEvent(token: string, eventId: string) {
    return request<EventSummary>(`/api/events/${eventId}`, { method: 'GET', token });
  },
  getEventPublicPageCustomization(token: string, eventId: string) {
    return request<PublicPageCustomization>(`/api/events/${eventId}/public-page`, { method: 'GET', token });
  },
  updateEventPublicPageCustomization(
    token: string,
    eventId: string,
    requestBody: PublicPageCustomizationUpdateRequest,
  ) {
    return request<PublicPageCustomization>(`/api/events/${eventId}/public-page`, {
      method: 'PUT',
      token,
      data: requestBody,
    });
  },
  uploadEventPublicPageCoverImage(token: string, eventId: string, formData: FormData) {
    return request<PublicPageImageUploadResponse>(`/api/events/${eventId}/public-page/cover-image`, {
      method: 'POST',
      token,
      data: formData,
    });
  },
  removeEventPublicPageCoverImage(token: string, eventId: string) {
    return request<PublicPageImageUploadResponse>(`/api/events/${eventId}/public-page/cover-image`, {
      method: 'DELETE',
      token,
    });
  },
  uploadEventPublicPageHighlightImages(token: string, eventId: string, formData: FormData) {
    return request<PublicPageImageUploadResponse>(`/api/events/${eventId}/public-page/highlight-images`, {
      method: 'POST',
      token,
      data: formData,
    });
  },
  removeEventPublicPageHighlightImages(token: string, eventId: string) {
    return request<PublicPageImageUploadResponse>(`/api/events/${eventId}/public-page/highlight-images`, {
      method: 'DELETE',
      token,
    });
  },
  async fetchEventQrCode(token: string, eventId: string) {
    try {
      const response = await http.get<Blob>(`/api/events/${eventId}/qrcode`, {
        headers: {
          ...authHeaders(token),
          Accept: 'image/png, application/octet-stream, */*',
        },
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
  getPublicEventCustomization(slug: string) {
    return request<PublicPageCustomization>(`/api/public/events/${slug}/public-page`, { method: 'GET' });
  },
  listPublicEventPhotos(slug: string) {
    return request<Photo[]>(`/api/public/events/${slug}/photos`, { method: 'GET' });
  },
  listPublicEventPhotosPage(slug: string, page: number, size: number) {
    return request<PageResponse<Photo>>(`/api/public/events/${slug}/photos/page?page=${page}&size=${size}`, {
      method: 'GET',
    });
  },
  listPublicTopLikedPhotos(slug: string) {
    return request<Photo[]>(`/api/public/events/${slug}/photos/top-liked`, { method: 'GET' });
  },
  updatePublicPhotoLike(slug: string, photoId: string, requestBody: PhotoLikeUpdateRequest) {
    return request<Photo>(`/api/public/events/${slug}/photos/${photoId}/like`, {
      method: 'PATCH',
      data: requestBody,
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
