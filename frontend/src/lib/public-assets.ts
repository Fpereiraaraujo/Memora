import { marketingAssetUrl } from '@/lib/env';

export const marketingWeddingAssets = {
  heroBanner: marketingAssetUrl('/wedding/hero-banner.png'),
  coupleProfile: marketingAssetUrl('/wedding/543.jpg'),
  gallery: [
    marketingAssetUrl('/wedding/700.jpg'),
    marketingAssetUrl('/wedding/528.jpg'),
    marketingAssetUrl('/wedding/203.jpg'),
    marketingAssetUrl('/wedding/377.jpg'),
    marketingAssetUrl('/wedding/543.jpg'),
  ],
} as const;
