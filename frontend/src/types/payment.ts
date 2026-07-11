import type { EventPlanCode } from '@/types/event';

export interface EventCheckoutRequest {
  planCode: EventPlanCode;
  couponCode?: string;
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
    description: 'Ideal para eventos pequenos e celebrações mais intimistas.',
    items: [
      'Até 150 fotos',
      'QR Code e link público',
      'Upload sem login',
      'Galeria privada do anfitrião',
    ],
  },
  {
    code: 'EVENT',
    name: 'Evento',
    priceLabel: 'R$ 99,90',
    storageLabel: '6 meses',
    photoLimitLabel: '500 fotos',
    description: 'O melhor equilíbrio para casamentos e festas com mais convidados.',
    highlighted: true,
    items: [
      'Até 500 fotos',
      'Favoritas para os anfitriões',
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
    description: 'Perfeito para eventos com alto volume e página pública personalizada.',
    items: [
      'Até 1.500 fotos',
      'Personalização completa da página pública',
      'Favoritas, recados e downloads premium',
      'Armazenamento por 12 meses',
    ],
  },
];
