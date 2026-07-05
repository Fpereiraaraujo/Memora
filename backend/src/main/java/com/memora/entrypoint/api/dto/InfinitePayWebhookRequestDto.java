package com.memora.entrypoint.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record InfinitePayWebhookRequestDto(
	@JsonProperty("order_nsu")
	@NotBlank
	String orderNsu,

	@JsonProperty("transaction_nsu")
	String transactionNsu,

	@JsonProperty("invoice_slug")
	String invoiceSlug,

	Integer amount,

	@JsonProperty("paid_amount")
	Integer paidAmount,

	@JsonProperty("receipt_url")
	String receiptUrl
) {
}
