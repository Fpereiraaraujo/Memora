import type { EventPlanCode } from '@/types/event';

export interface EventCheckoutRequest {
  planCode: EventPlanCode;
}

export interface EventCheckoutResponse {
  paymentOrderId: string;
  planCode: EventPlanCode;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  amountCents: number;
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
    priceLabel: 'R$ 39,90',
    storageLabel: '3 meses',
    photoLimitLabel: '150 fotos',
    description: 'Ideal para eventos pequenos e celebracoes mais intimistas.',
    items: [
      'Ate 150 fotos',
      'Galeria privada do anfitriao',
      'Galeria publica por link',
      'Armazenamento por 3 meses',
    ],
  },
  {
    code: 'EVENT',
    name: 'Evento',
    priceLabel: 'R$ 69,90',
    storageLabel: '6 meses',
    photoLimitLabel: '500 fotos',
    description: 'O melhor equilibrio para aniversarios, formaturas e festas medias.',
    highlighted: true,
    items: [
      'Ate 500 fotos',
      'QR Code e link publico',
      'Favoritas e moderacao',
      'Armazenamento por 6 meses',
    ],
  },
  {
    code: 'PREMIUM',
    name: 'Premium',
    priceLabel: 'R$ 99,90',
    storageLabel: '12 meses',
    photoLimitLabel: '1.500 fotos',
    description: 'Perfeito para casamentos e eventos com grande valor emocional.',
    items: [
      'Ate 1.500 fotos',
      'Galeria completa do evento',
      'Downloads e organizacao premium',
      'Armazenamento por 12 meses',
    ],
  },
];
