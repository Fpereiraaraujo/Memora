import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';
import { marketingWeddingAssets } from '@/lib/public-assets';

export const eventDashboardMockImages = [
  ...marketingWeddingAssets.gallery,
  marketingWeddingAssets.gallery[0],
];

export const eventDashboardProfileImage = eventDashboardMockImages[0];

export function buildMockEvent(eventId: string): EventSummary {
  return {
    id: eventId,
    type: 'WEDDING',
    title: 'Isadora & Fernando',
    slug: 'isadora-fernando',
    eventDate: '2024-05-25',
    location: 'Espaco Jardim das Flores',
    status: 'ACTIVE',
    planCode: 'PREMIUM',
    photoLimit: 1500,
    storageExpiresAt: '2025-05-25T00:00:00Z',
    paidAt: '2024-05-20T12:00:00Z',
  };
}

export function buildMockEvents(): EventSummary[] {
  return [
    buildMockEvent('demo-event'),
    {
      id: 'festa-15-anos',
      type: 'BIRTHDAY',
      title: '15 anos da Isadora',
      slug: '15-anos-isadora',
      eventDate: '2024-02-14',
      location: 'Jardim das Camelias',
      status: 'ACTIVE',
      planCode: 'EVENT',
      photoLimit: 500,
      storageExpiresAt: '2024-08-14T00:00:00Z',
      paidAt: '2024-02-10T12:00:00Z',
    },
    {
      id: 'cha-bar',
      type: 'OTHER',
      title: 'Cha Bar Isadora & Fernando',
      slug: 'cha-bar-isadora-fernando',
      eventDate: '2024-04-07',
      location: 'Espaco Villa Aurora',
      status: 'DRAFT',
      planCode: null,
      photoLimit: null,
      storageExpiresAt: null,
      paidAt: null,
    },
    {
      id: 'civil',
      type: 'WEDDING',
      title: 'Cerimonia Civil',
      slug: 'cerimonia-civil-isadora-fernando',
      eventDate: '2024-05-10',
      location: 'Cartorio Central',
      status: 'ACTIVE',
      planCode: 'ESSENTIAL',
      photoLimit: 150,
      storageExpiresAt: '2024-08-10T00:00:00Z',
      paidAt: '2024-05-08T12:00:00Z',
    },
    {
      id: 'pos-wedding',
      type: 'OTHER',
      title: 'Brunch Pos Wedding',
      slug: 'brunch-pos-wedding',
      eventDate: '2024-05-26',
      location: 'Casa Familia Ferreira',
      status: 'PAUSED',
      planCode: 'EVENT',
      photoLimit: 500,
      storageExpiresAt: '2024-11-26T00:00:00Z',
      paidAt: '2024-05-22T12:00:00Z',
    },
  ];
}

export function buildMockPhotos(eventId: string): Photo[] {
  const now = Date.now();

  return [
    {
      id: `${eventId}-photo-1`,
      originalFilename: 'casamento-isadora-fernando-1.jpg',
      objectKey: 'mock/casamento-isadora-fernando-1.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1680000,
      status: 'AVAILABLE',
      favorite: true,
      likesCount: 14,
      guestName: 'Mariana Silva',
      guestMessage: 'Que dia inesquecivel! Desejo toda a felicidade do mundo!',
      uploadGroupId: `${eventId}-group-1`,
      createdAt: new Date(now - 8 * 60 * 1000).toISOString(),
      downloadUrl: eventDashboardMockImages[0],
    },
    {
      id: `${eventId}-photo-2`,
      originalFilename: 'casamento-isadora-fernando-2.jpg',
      objectKey: 'mock/casamento-isadora-fernando-2.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1840000,
      status: 'AVAILABLE',
      favorite: true,
      likesCount: 11,
      guestName: 'Carlos Eduardo',
      guestMessage: 'Parabens pelo casamento! Que Deus abencoe voces sempre!',
      uploadGroupId: `${eventId}-group-2`,
      createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
      downloadUrl: eventDashboardMockImages[1],
    },
    {
      id: `${eventId}-photo-3`,
      originalFilename: 'casamento-isadora-fernando-3.jpg',
      objectKey: 'mock/casamento-isadora-fernando-3.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1760000,
      status: 'AVAILABLE',
      favorite: false,
      likesCount: 9,
      guestName: 'Juliana Mendes',
      guestMessage: 'Foi tudo perfeito! Amo voces!',
      uploadGroupId: `${eventId}-group-3`,
      createdAt: new Date(now - 60 * 60 * 1000).toISOString(),
      downloadUrl: eventDashboardMockImages[2],
    },
    {
      id: `${eventId}-photo-4`,
      originalFilename: 'casamento-isadora-fernando-4.jpg',
      objectKey: 'mock/casamento-isadora-fernando-4.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1710000,
      status: 'AVAILABLE',
      favorite: false,
      likesCount: 6,
      guestName: 'Mariana Silva',
      guestMessage: 'A festa estava maravilhosa!',
      uploadGroupId: `${eventId}-group-4`,
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      downloadUrl: eventDashboardMockImages[3],
    },
    {
      id: `${eventId}-photo-5`,
      originalFilename: 'casamento-isadora-fernando-5.jpg',
      objectKey: 'mock/casamento-isadora-fernando-5.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1650000,
      status: 'AVAILABLE',
      favorite: false,
      likesCount: 4,
      guestName: 'Fernanda Rocha',
      guestMessage: null,
      uploadGroupId: `${eventId}-group-5`,
      createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      downloadUrl: eventDashboardMockImages[4],
    },
    {
      id: `${eventId}-photo-6`,
      originalFilename: 'casamento-isadora-fernando-6.jpg',
      objectKey: 'mock/casamento-isadora-fernando-6.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1880000,
      status: 'AVAILABLE',
      favorite: false,
      likesCount: 8,
      guestName: 'Rafael Lima',
      guestMessage: 'Momento lindo demais!',
      uploadGroupId: `${eventId}-group-6`,
      createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      downloadUrl: eventDashboardMockImages[5],
    },
  ];
}

export function buildMockQrDataUrl() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="560" viewBox="0 0 420 560">
      <rect width="420" height="560" rx="42" fill="#fffdfb"/>
      <rect x="20" y="20" width="380" height="520" rx="32" fill="white" stroke="#e2b66f" stroke-width="4"/>
      <path d="M210 80c18-18 44-7 44 16 0 24-28 41-44 57-16-16-44-33-44-57 0-23 26-34 44-16Z" fill="none" stroke="#d6a043" stroke-width="8"/>
      <text x="210" y="150" text-anchor="middle" fill="#241b16" font-size="20" font-family="Georgia, serif">COMPARTILHE</text>
      <text x="210" y="178" text-anchor="middle" fill="#241b16" font-size="20" font-family="Georgia, serif">SUAS FOTOS</text>
      <g transform="translate(98 210)">
        <rect width="224" height="224" rx="8" fill="#fff"/>
        <g fill="#111">
          <rect x="0" y="0" width="56" height="56"/><rect x="14" y="14" width="28" height="28" fill="#fff"/>
          <rect x="168" y="0" width="56" height="56"/><rect x="182" y="14" width="28" height="28" fill="#fff"/>
          <rect x="0" y="168" width="56" height="56"/><rect x="14" y="182" width="28" height="28" fill="#fff"/>
          <rect x="70" y="14" width="14" height="14"/><rect x="98" y="14" width="14" height="14"/><rect x="126" y="14" width="14" height="14"/>
          <rect x="84" y="28" width="14" height="14"/><rect x="112" y="28" width="14" height="14"/><rect x="70" y="56" width="14" height="14"/>
          <rect x="98" y="56" width="14" height="14"/><rect x="140" y="56" width="14" height="14"/><rect x="70" y="84" width="14" height="14"/>
          <rect x="112" y="84" width="14" height="14"/><rect x="154" y="84" width="14" height="14"/><rect x="84" y="112" width="14" height="14"/>
          <rect x="126" y="112" width="14" height="14"/><rect x="168" y="112" width="14" height="14"/><rect x="70" y="140" width="14" height="14"/>
          <rect x="98" y="140" width="14" height="14"/><rect x="140" y="140" width="14" height="14"/><rect x="182" y="140" width="14" height="14"/>
          <rect x="84" y="168" width="14" height="14"/><rect x="112" y="168" width="14" height="14"/><rect x="140" y="168" width="14" height="14"/>
          <rect x="168" y="168" width="14" height="14"/><rect x="196" y="168" width="14" height="14"/><rect x="70" y="196" width="14" height="14"/>
          <rect x="98" y="196" width="14" height="14"/><rect x="126" y="196" width="14" height="14"/><rect x="154" y="196" width="14" height="14"/>
        </g>
      </g>
      <text x="210" y="470" text-anchor="middle" fill="#c78f37" font-size="19" font-family="Georgia, serif" font-style="italic">Obrigado por fazer</text>
      <text x="210" y="497" text-anchor="middle" fill="#c78f37" font-size="19" font-family="Georgia, serif" font-style="italic">parte desse momento!</text>
      <circle cx="210" cy="522" r="8" fill="#d9a042"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
