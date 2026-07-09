package com.memora.core.domain.model;

public record CheckoutResponse(
	String checkoutUrl,
	String providerReference
) {
}
