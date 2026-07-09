package com.memora.core.domain.param;

public record HandleInfinitePayWebhookParam(
	String externalReference,
	String orderNsu,
	String providerPaymentId,
	String transactionNsu,
	String invoiceSlug,
	String status,
	Integer amount,
	Integer paidAmount,
	String receiptUrl
) {
}
