package com.memora.core.domain.model;

public record PaymentVerificationCommand(
	String externalReference,
	String providerPaymentId,
	String transactionNsu,
	String invoiceSlug,
	Integer amountCents
) {
}
