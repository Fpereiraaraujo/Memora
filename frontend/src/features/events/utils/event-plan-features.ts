import type { EventPlanCode, EventSummary } from '@/types/event';

function getPlanCode(event: Pick<EventSummary, 'planCode'> | null | undefined): EventPlanCode | null {
  return event?.planCode ?? null;
}

export function hasEventPlan(event: Pick<EventSummary, 'planCode'> | null | undefined) {
  const planCode = getPlanCode(event);
  return planCode === 'EVENT' || planCode === 'PREMIUM';
}

export function hasPremiumPlan(event: Pick<EventSummary, 'planCode'> | null | undefined) {
  return getPlanCode(event) === 'PREMIUM';
}

export function canUseFavorites(event: Pick<EventSummary, 'planCode'> | null | undefined) {
  return hasEventPlan(event);
}

export function canUsePrivateMessages(event: Pick<EventSummary, 'planCode'> | null | undefined) {
  return hasEventPlan(event);
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
