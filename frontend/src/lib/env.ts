function normalizeBaseUrl(value?: string) {
  if (!value) {
    return '';
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function browserOrigin() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.origin;
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || browserOrigin();
export const PUBLIC_APP_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_PUBLIC_APP_URL) || browserOrigin();
export const MARKETING_ASSET_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_MARKETING_ASSET_BASE_URL)
  || 'https://memora-photos-278157447183-us-east-1.s3.amazonaws.com/marketing';

export function apiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function publicAppUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${PUBLIC_APP_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function marketingAssetUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${MARKETING_ASSET_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
