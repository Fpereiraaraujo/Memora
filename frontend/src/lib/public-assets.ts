import { marketingAssetUrl } from '@/lib/env';

export const marketingWeddingAssets = {
  showcaseBanner: marketingAssetUrl('/wedding/hero-banner.png'),
  eventProfile: marketingAssetUrl('/wedding/543.jpg'),
  gallery: [
    marketingAssetUrl('/wedding/700.jpg'),
    marketingAssetUrl('/wedding/528.jpg'),
    marketingAssetUrl('/wedding/203.jpg'),
    marketingAssetUrl('/wedding/377.jpg'),
    marketingAssetUrl('/wedding/543.jpg'),
  ],
} as const;
