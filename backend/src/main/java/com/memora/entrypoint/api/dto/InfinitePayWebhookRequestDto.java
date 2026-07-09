package com.memora.entrypoint.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record InfinitePayWebhookRequestDto(
	@JsonProperty("external_reference")
	String externalReference,

	@JsonProperty("order_nsu")
	String orderNsu,

	@JsonProperty("provider_payment_id")
	String providerPaymentId,

	@JsonProperty("transaction_nsu")
	String transactionNsu,

	@JsonProperty("invoice_slug")
	String invoiceSlug,

	String status,

	Integer amount,

	@JsonProperty("paid_amount")
	Integer paidAmount,

	@JsonProperty("receipt_url")
	String receiptUrl
) {
}
