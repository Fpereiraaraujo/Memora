package com.memora.core.service;

import com.memora.core.domain.model.CheckoutPricing;
import com.memora.core.domain.model.CouponValidationResult;
import com.memora.core.domain.model.CouponValidationStatus;
import com.memora.core.domain.model.Plan;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Component;

@Component
public class CheckoutPricingService {

	public CheckoutPricing calculate(Plan plan, CouponValidationResult couponValidationResult) {
		if (plan == null) {
			throw new IllegalArgumentException("Plano inválido.");
		}

		int originalAmountCents = plan.getPriceCents();
		if (couponValidationResult == null || !couponValidationResult.isValid()) {
			return CheckoutPricing.builder()
				.planCode(plan.getCode())
				.originalAmountCents(originalAmountCents)
				.discountAmountCents(0)
				.finalAmountCents(originalAmountCents)
				.message(null)
				.build();
		}

		var coupon = couponValidationResult.getCoupon();
		int discountAmountCents = percentageOf(originalAmountCents, coupon.getDiscountPercent());
		int finalAmountCents = originalAmountCents - discountAmountCents;
		if (finalAmountCents <= 0) {
			throw new IllegalArgumentException("O desconto do cupom deixou o valor final inválido.");
		}

		Integer commissionAmountCents = coupon.getCommissionPercent() == null
			? null
			: percentageOf(finalAmountCents, coupon.getCommissionPercent());

		return CheckoutPricing.builder()
			.planCode(plan.getCode())
			.originalAmountCents(originalAmountCents)
			.discountAmountCents(discountAmountCents)
			.finalAmountCents(finalAmountCents)
			.discountPercent(coupon.getDiscountPercent())
			.couponCode(couponValidationResult.getNormalizedCode())
			.couponId(coupon.getId())
			.influencerId(coupon.getInfluencerId())
			.commissionPercent(coupon.getCommissionPercent())
			.commissionAmountCents(commissionAmountCents)
			.message("Cupom aplicado com sucesso.")
			.build();
	}

	public void ensureApplicable(CouponValidationResult couponValidationResult) {
		if (couponValidationResult == null || couponValidationResult.isValid()) {
			return;
		}

		CouponValidationStatus status = couponValidationResult.getStatus();
		if (status == CouponValidationStatus.NOT_FOUND) {
			throw new IllegalArgumentException("Cupom não encontrado.");
		}
		if (status == CouponValidationStatus.INACTIVE) {
			throw new IllegalArgumentException("Cupom inativo.");
		}
		if (status == CouponValidationStatus.EXPIRED) {
			throw new IllegalArgumentException("Cupom expirado.");
		}
		if (status == CouponValidationStatus.MAX_USES_REACHED) {
			throw new IllegalArgumentException("Cupom atingiu o limite de usos.");
		}

		throw new IllegalArgumentException("Cupom inválido.");
	}

	private int percentageOf(int amountCents, int percent) {
		return BigDecimal.valueOf(amountCents)
			.multiply(BigDecimal.valueOf(percent))
			.divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP)
			.intValueExact();
	}
}
