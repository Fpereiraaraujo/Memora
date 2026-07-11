package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventCheckoutPreview;
import com.memora.core.domain.param.PreviewEventCheckoutParam;
import com.memora.core.service.EventCheckoutPricingResolverService;
import com.memora.core.usecase.PreviewEventCheckoutUseCase;
import org.springframework.stereotype.Service;

@Service
public class PreviewEventCheckoutUseCaseImp implements PreviewEventCheckoutUseCase {

	private final EventCheckoutPricingResolverService eventCheckoutPricingResolverService;

	public PreviewEventCheckoutUseCaseImp(EventCheckoutPricingResolverService eventCheckoutPricingResolverService) {
		this.eventCheckoutPricingResolverService = eventCheckoutPricingResolverService;
	}

	@Override
	public EventCheckoutPreview execute(PreviewEventCheckoutParam param) {
		var resolvedCheckout = eventCheckoutPricingResolverService.resolve(
			param.ownerId(),
			param.eventId(),
			param.planCode(),
			param.couponCode()
		);
		var pricing = resolvedCheckout.getPricing();

		return EventCheckoutPreview.builder()
			.planCode(pricing.getPlanCode())
			.originalAmountCents(pricing.getOriginalAmountCents())
			.discountAmountCents(pricing.getDiscountAmountCents())
			.finalAmountCents(pricing.getFinalAmountCents())
			.couponCode(pricing.getCouponCode())
			.discountPercent(pricing.getDiscountPercent())
			.couponApplied(pricing.getCouponCode() != null)
			.message(pricing.getCouponCode() != null ? pricing.getMessage() : "Sem cupom aplicado.")
			.build();
	}
}
