import { useEffect } from 'react';

import { publicAppUrl } from '@/lib/env';

interface PageSeoProps {
  title: string;
  description: string;
  path?: string;
  faqJsonLd?: Array<{ question: string; answer: string }>;
}

function upsertMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertPropertyMeta(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function PageSeo({ title, description, path = '/', faqJsonLd }: PageSeoProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    const previousOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '';
    const previousOgDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '';
    const previousOgType = document.querySelector('meta[property="og:type"]')?.getAttribute('content') ?? '';
    const previousOgUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '';
    const previousTwitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') ?? '';
    const previousCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
    const canonicalUrl = publicAppUrl(path);

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('twitter:card', 'summary_large_image');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', canonicalUrl);
    upsertCanonical(canonicalUrl);

    let script: HTMLScriptElement | null = null;
    if (faqJsonLd?.length) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqJsonLd.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      upsertMeta('description', previousDescription);
      upsertMeta('twitter:card', previousTwitterCard);
      upsertPropertyMeta('og:title', previousOgTitle);
      upsertPropertyMeta('og:description', previousOgDescription);
      upsertPropertyMeta('og:type', previousOgType);
      upsertPropertyMeta('og:url', previousOgUrl);
      upsertCanonical(previousCanonical);
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [description, faqJsonLd, path, title]);

  return null;
}
