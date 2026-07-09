package com.memora.core.domain.model;

public record CreateCheckoutCommand(
	Plan plan,
	String externalReference,
	String redirectUrl,
	String webhookUrl
) {
}
