import type { EventPlanCode } from '@/types/event';

export interface EventCheckoutRequest {
  planCode: EventPlanCode;
  couponCode?: string;
  referralCode?: string;
}

export interface EventCheckoutResponse {
  paymentOrderId: string;
  planCode: EventPlanCode;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED' | 'FAILED' | 'MANUAL_REVIEW';
  originalAmountCents: number;
  discountAmountCents: number;
  finalAmountCents: number;
  couponCode: string | null;
  discountPercent: number | null;
  message: string | null;
  checkoutUrl: string | null;
}

export interface EventCheckoutPreviewResponse {
  planCode: EventPlanCode;
  originalAmountCents: number;
  discountAmountCents: number;
  finalAmountCents: number;
  couponCode: string | null;
  referralCode: string | null;
  referralApplied: boolean;
  discountPercent: number | null;
  couponApplied: boolean;
  message: string;
}

export interface EventCheckoutStatusResponse {
  paymentOrderId: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED' | 'FAILED' | 'MANUAL_REVIEW' | null;
  planCode: EventPlanCode | null;
  eventStatus: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  paidAt: string | null;
  checkoutUrl: string | null;
}

export interface EventPlanPresentation {
  code: EventPlanCode;
  name: string;
  priceLabel: string;
  storageLabel: string;
  photoLimitLabel: string;
  description: string;
  items: string[];
  highlighted?: boolean;
}

export const EVENT_PLANS: EventPlanPresentation[] = [
  {
    code: 'ESSENTIAL',
    name: 'Essencial',
    priceLabel: 'R$ 59,90',
    storageLabel: '3 meses',
    photoLimitLabel: '150 fotos',
    description: 'Ideal para eventos pequenos e celebracoes mais intimistas.',
    items: [
      'Ate 150 fotos',
      'QR Code e link publico',
      'Upload sem login',
      'Galeria privada do anfitriao',
    ],
  },
  {
    code: 'EVENT',
    name: 'Evento',
    priceLabel: 'R$ 99,90',
    storageLabel: '6 meses',
    photoLimitLabel: '500 fotos',
    description: 'O melhor equilibrio para casamentos e festas com mais convidados.',
    highlighted: true,
    items: [
      'Ate 500 fotos',
      'Favoritas para os anfitrioes',
      'Recados privados dos convidados',
      'Armazenamento por 6 meses',
    ],
  },
  {
    code: 'PREMIUM',
    name: 'Premium',
    priceLabel: 'R$ 149,90',
    storageLabel: '12 meses',
    photoLimitLabel: '1.500 fotos',
    description: 'Perfeito para eventos com alto volume e pagina publica personalizada.',
    items: [
      'Ate 1.500 fotos',
      'Personalizacao completa da pagina publica',
      'Favoritas, recados e downloads premium',
      'Armazenamento por 12 meses',
    ],
  },
];
