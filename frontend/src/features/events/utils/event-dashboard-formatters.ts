import { mediaUrl } from '@/lib/api';
import { publicAppUrl } from '@/lib/env';

export function formatEventDate(date: string | null) {
  if (!date) {
    return 'Data a confirmar';
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatRelativeTime(date: string) {
  const createdAt = new Date(date).getTime();
  const now = Date.now();
  const minutes = Math.max(1, Math.round((now - createdAt) / 60000));

  if (minutes < 60) {
    return `${minutes} min atrás`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `${hours} h atrás`;
  }

  const days = Math.round(hours / 24);

  return `${days} dia${days > 1 ? 's' : ''} atrás`;
}

export function getPhotoSrc(path: string) {
  if (
    path.startsWith('/wedding/') ||
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  return mediaUrl(path);
}

export function getInitials(name: string | null) {
  if (!name) {
    return 'C';
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('');

  return initials || 'C';
}

export function buildPublicEventUrl(slug: string) {
  return publicAppUrl(`/e/${slug}`);
}

export function buildPublicUploadUrl(slug: string) {
  return publicAppUrl(`/e/${slug}/upload`);
}
