import { useEffect, useMemo, useState } from 'react';

import { api } from '@/lib/api';
import type { EventPlanCode } from '@/types/event';
import type { EventCheckoutPreviewResponse } from '@/types/payment';

interface UseCheckoutPreviewParams {
  token: string | null;
  eventId?: string;
}

export interface UseCheckoutPreviewResult {
  selectedPlanCode: EventPlanCode | null;
  couponCode: string;
  appliedCouponCode: string | null;
  preview: EventCheckoutPreviewResponse | null;
  previewing: boolean;
  applyingCoupon: boolean;
  couponFeedback: string | null;
  couponError: string | null;
  setCouponCode: (value: string) => void;
  selectPlan: (planCode: EventPlanCode) => Promise<void>;
  applyCoupon: () => Promise<void>;
  removeCoupon: () => Promise<void>;
}

function normalizeCouponCode(couponCode: string) {
  const normalizedCouponCode = couponCode.trim().toUpperCase();
  return normalizedCouponCode || null;
}

export function useCheckoutPreview({
  token,
  eventId,
}: UseCheckoutPreviewParams): UseCheckoutPreviewResult {
  const [selectedPlanCode, setSelectedPlanCode] = useState<EventPlanCode | null>(null);
  const [couponCode, setCouponCodeState] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [preview, setPreview] = useState<EventCheckoutPreviewResponse | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const normalizedCouponCode = useMemo(() => normalizeCouponCode(couponCode), [couponCode]);

  useEffect(() => {
    if (!appliedCouponCode || normalizedCouponCode === appliedCouponCode) {
      return;
    }

    setAppliedCouponCode(null);
    setCouponFeedback(null);
  }, [appliedCouponCode, normalizedCouponCode]);

  async function fetchPreview(planCode: EventPlanCode, couponCodeToApply?: string | null) {
    if (!token || !eventId) {
      return null;
    }

    return api.previewEventCheckout(token, eventId, {
      planCode,
      couponCode: couponCodeToApply ?? undefined,
    });
  }

  async function selectPlan(planCode: EventPlanCode) {
    setSelectedPlanCode(planCode);
    setPreviewing(true);
    setCouponError(null);

    try {
      const response = await fetchPreview(planCode, appliedCouponCode);
      setPreview(response);
      if (!appliedCouponCode) {
        setCouponFeedback(null);
      }
    } finally {
      setPreviewing(false);
    }
  }

  async function applyCoupon() {
    if (!selectedPlanCode) {
      setCouponError('Escolha um plano antes de aplicar o cupom.');
      return;
    }

    if (!normalizedCouponCode) {
      setCouponError('Digite um cupom para validar.');
      return;
    }

    setApplyingCoupon(true);
    setCouponError(null);
    setCouponFeedback(null);

    try {
      const response = await fetchPreview(selectedPlanCode, normalizedCouponCode);
      if (!response) {
        throw new Error('Não foi possível validar o cupom agora.');
      }

      setPreview(response);
      setAppliedCouponCode(response.couponApplied ? response.couponCode : null);
      setCouponCodeState(response.couponCode ?? normalizedCouponCode);
      setCouponFeedback(response.message);
    } catch (error) {
      setAppliedCouponCode(null);
      setCouponError(error instanceof Error ? error.message : 'Não foi possível validar o cupom.');
    } finally {
      setApplyingCoupon(false);
    }
  }

  async function removeCoupon() {
    setCouponCodeState('');
    setAppliedCouponCode(null);
    setCouponFeedback('Cupom removido.');
    setCouponError(null);

    if (!selectedPlanCode) {
      setPreview(null);
      return;
    }

    setPreviewing(true);
    try {
      const response = await fetchPreview(selectedPlanCode, null);
      setPreview(response);
    } finally {
      setPreviewing(false);
    }
  }

  function setCouponCode(value: string) {
    setCouponCodeState(value);
    setCouponError(null);
    if (!value.trim()) {
      setCouponFeedback(null);
    }
  }

  return {
    selectedPlanCode,
    couponCode,
    appliedCouponCode,
    preview,
    previewing,
    applyingCoupon,
    couponFeedback,
    couponError,
    setCouponCode,
    selectPlan,
    applyCoupon,
    removeCoupon,
  };
}
