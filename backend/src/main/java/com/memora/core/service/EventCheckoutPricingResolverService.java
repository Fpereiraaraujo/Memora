package com.memora.core.service;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.Plan;
import com.memora.core.domain.model.ResolvedEventCheckout;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PlanDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class EventCheckoutPricingResolverService {

	private final EventRepository eventRepository;
	private final PlanRepository planRepository;
	private final ReferralCouponResolverService referralCouponResolverService;
	private final CouponValidationService couponValidationService;
	private final CheckoutPricingService checkoutPricingService;

	public EventCheckoutPricingResolverService(
		EventRepository eventRepository,
		PlanRepository planRepository,
		ReferralCouponResolverService referralCouponResolverService,
		CouponValidationService couponValidationService,
		CheckoutPricingService checkoutPricingService
	) {
		this.eventRepository = eventRepository;
		this.planRepository = planRepository;
		this.referralCouponResolverService = referralCouponResolverService;
		this.couponValidationService = couponValidationService;
		this.checkoutPricingService = checkoutPricingService;
	}

	public ResolvedEventCheckout resolve(
		UUID ownerId,
		UUID eventId,
		EventPlanCode planCode,
		String couponCode,
		String referralCode
	) {
		if (planCode == null) {
			throw new IllegalArgumentException("Plan code is required");
		}

		Event event = eventRepository.findByIdAndOwnerId(eventId, ownerId)
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento nao encontrado."));

		if (event.getPaidAt() != null && event.getPlanCode() != null) {
			throw new IllegalArgumentException("Este evento ja possui um plano aprovado.");
		}

		Plan plan = planRepository.findByCodeAndActiveTrue(planCode)
			.map(PlanDatabaseMapper::toDomain)
			.orElseThrow(() -> new IllegalArgumentException("Plano invalido."));

		var pricing = resolvePricing(plan, couponCode, referralCode);

		return ResolvedEventCheckout.builder()
			.event(event)
			.plan(plan)
			.pricing(pricing)
			.build();
	}

	private com.memora.core.domain.model.CheckoutPricing resolvePricing(Plan plan, String couponCode, String referralCode) {
		var resolvedCouponInput = referralCouponResolverService.resolve(couponCode, referralCode);
		if (resolvedCouponInput.couponCode() == null || resolvedCouponInput.couponCode().isBlank()) {
			return checkoutPricingService.calculate(plan, null);
		}

		var couponValidationResult = couponValidationService.validateByCode(resolvedCouponInput.couponCode());
		checkoutPricingService.ensureApplicable(couponValidationResult);
		var pricing = checkoutPricingService.calculate(plan, couponValidationResult);
		if (resolvedCouponInput.fromReferral()) {
			return pricing.toBuilder()
				.message("Cupom " + pricing.getCouponCode() + " disponivel para voce via link de parceria.")
				.build();
		}
		return pricing;
	}
}
