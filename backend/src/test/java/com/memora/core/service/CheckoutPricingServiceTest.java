package com.memora.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.memora.core.domain.model.CheckoutPricing;
import com.memora.core.domain.model.Coupon;
import com.memora.core.domain.model.CouponStatus;
import com.memora.core.domain.model.CouponValidationResult;
import com.memora.core.domain.model.CouponValidationStatus;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.Plan;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CheckoutPricingServiceTest {

	private CheckoutPricingService checkoutPricingService;

	@BeforeEach
	void setUp() {
		checkoutPricingService = new CheckoutPricingService();
	}

	@Test
	void calculateReturnsFullPriceWithoutCoupon() {
		CheckoutPricing pricing = checkoutPricingService.calculate(plan(9990), null);

		assertThat(pricing.getOriginalAmountCents()).isEqualTo(9990);
		assertThat(pricing.getDiscountAmountCents()).isZero();
		assertThat(pricing.getFinalAmountCents()).isEqualTo(9990);
		assertThat(pricing.getCouponCode()).isNull();
	}

	@Test
	void calculateAppliesValidCouponAndCommission() {
		CheckoutPricing pricing = checkoutPricingService.calculate(plan(9990), validCouponResult(10, 20));

		assertThat(pricing.getOriginalAmountCents()).isEqualTo(9990);
		assertThat(pricing.getDiscountAmountCents()).isEqualTo(999);
		assertThat(pricing.getFinalAmountCents()).isEqualTo(8991);
		assertThat(pricing.getCommissionAmountCents()).isEqualTo(1798);
		assertThat(pricing.getCouponCode()).isEqualTo("NOIVA10");
	}

	@Test
	void ensureApplicableRejectsExpiredCoupon() {
		assertThatThrownBy(() -> checkoutPricingService.ensureApplicable(CouponValidationResult.builder()
			.normalizedCode("NOIVA10")
			.status(CouponValidationStatus.EXPIRED)
			.build()))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessage("Cupom expirado.");
	}

	@Test
	void ensureApplicableRejectsUnknownCoupon() {
		assertThatThrownBy(() -> checkoutPricingService.ensureApplicable(CouponValidationResult.builder()
			.normalizedCode("NOIVA10")
			.status(CouponValidationStatus.NOT_FOUND)
			.build()))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessage("Cupom não encontrado.");
	}

	@Test
	void calculateRoundsInCents() {
		CheckoutPricing pricing = checkoutPricingService.calculate(plan(5990), validCouponResult(15, 20));

		assertThat(pricing.getDiscountAmountCents()).isEqualTo(899);
		assertThat(pricing.getFinalAmountCents()).isEqualTo(5091);
		assertThat(pricing.getCommissionAmountCents()).isEqualTo(1018);
	}

	private Plan plan(int amountCents) {
		return Plan.builder()
			.code(EventPlanCode.EVENT)
			.name("Evento")
			.priceCents(amountCents)
			.photoLimit(500)
			.storageMonths(6)
			.active(true)
			.build();
	}

	private CouponValidationResult validCouponResult(int discountPercent, int commissionPercent) {
		LocalDateTime now = LocalDateTime.now();
		return CouponValidationResult.builder()
			.normalizedCode("NOIVA10")
			.status(CouponValidationStatus.VALID)
			.coupon(Coupon.builder()
				.id(UUID.randomUUID())
				.code("NOIVA10")
				.discountPercent(discountPercent)
				.commissionPercent(commissionPercent)
				.status(CouponStatus.ACTIVE)
				.createdAt(now)
				.updatedAt(now)
				.build())
			.build();
	}
}
