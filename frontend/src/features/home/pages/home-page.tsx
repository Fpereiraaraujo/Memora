import { PublicShell } from '@/components/layout/public-shell';
import { HomeHowItWorksSection } from '@/features/home/components/home-how-it-works-section';
import { HomeIntroSection } from '@/features/home/components/home-intro-section';
import { LandingFinalCta } from '@/features/home/components/landing-final-cta';
import { ProductShowcaseSection } from '@/features/home/components/product-showcase-section';
import {
  HomeCameraFlowSection,
  HomeEmotionalSection,
  HomeWhatsappComparisonSection,
} from '@/features/home/components/home-story-sections';
import {
  HomeFaqSection,
  HomePrivacySection,
  HomeQrCodePlacementSection,
  HomeSocialProofSection,
} from '@/features/home/components/home-trust-sections';
import { LANDING_FAQ_ITEMS } from '@/features/home/data/landing-content';
import { PageSeo } from '@/lib/page-seo';

export function HomePage() {
  return (
    <PublicShell>
      <PageSeo
        title="Memora | As fotos do seu casamento em um só lugar"
        description="Crie uma página personalizada, compartilhe um QR Code e receba fotos e recados dos convidados em uma galeria privada. Sem app, sem login e sem complicação."
        path="/"
        faqJsonLd={LANDING_FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answer }))}
      />

      <HomeIntroSection />
      <HomeHowItWorksSection />
      <HomeEmotionalSection />
      <HomeWhatsappComparisonSection />
      <HomeCameraFlowSection />
      <ProductShowcaseSection />
      <HomePrivacySection />
      <HomeQrCodePlacementSection />
      <HomeSocialProofSection />
      <HomeFaqSection />
      <LandingFinalCta />
    </PublicShell>
  );
}
