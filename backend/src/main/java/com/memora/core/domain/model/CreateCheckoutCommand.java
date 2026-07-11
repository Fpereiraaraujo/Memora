package com.memora.core.domain.model;

public record CreateCheckoutCommand(
	Plan plan,
	int amountCents,
	String externalReference,
	String redirectUrl,
	String webhookUrl
) {
}
