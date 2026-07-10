import type { EventSummary } from '@/types/event';

export function canUseFavorites(event: Pick<EventSummary, 'planCode'> | null | undefined) {
  return true;
}

export function canUsePrivateMessages(event: Pick<EventSummary, 'planCode'> | null | undefined) {
  return true;
}

export function canCustomizePublicPage(event: Pick<EventSummary, 'planCode'> | null | undefined) {
  return true;
}

export function getRequiredPlanLabel(feature: 'favorites' | 'messages' | 'public-page-customization') {
  if (feature === 'public-page-customization') {
    return 'Premium';
  }

  return 'Evento';
}
