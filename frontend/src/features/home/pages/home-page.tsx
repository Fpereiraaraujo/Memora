import { PublicShell } from '@/components/layout/public-shell';
import { HomeEventTypesSection } from '@/features/home/components/home-event-types-section';
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
        title="Memora | As fotos do seu evento em um só lugar"
        description="Crie uma página personalizada, compartilhe um QR Code e receba fotos e recados dos convidados em uma galeria privada. Ideal para casamentos, aniversários, festas de 15 anos, formaturas e outros eventos."
        path="/"
        faqJsonLd={LANDING_FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answer }))}
      />

      <HomeIntroSection />
      <HomeHowItWorksSection />
      <HomeEventTypesSection />
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
