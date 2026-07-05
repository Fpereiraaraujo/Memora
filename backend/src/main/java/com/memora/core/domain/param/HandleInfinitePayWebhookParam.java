package com.memora.core.domain.param;

public record HandleInfinitePayWebhookParam(
	String orderNsu,
	String transactionNsu,
	String invoiceSlug,
	Integer amount,
	Integer paidAmount,
	String receiptUrl
) {
}
