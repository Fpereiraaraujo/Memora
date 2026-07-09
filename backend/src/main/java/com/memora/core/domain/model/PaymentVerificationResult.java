package com.memora.core.domain.model;

public record PaymentVerificationResult(
	boolean verified,
	boolean approved,
	String externalReference,
	String providerPaymentId,
	Integer amountCents,
	Integer paidAmountCents,
	String rawStatus
) {
}
