package com.memora.core.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class ResolvedEventCheckout {
	Event event;
	Plan plan;
	CheckoutPricing pricing;
}
