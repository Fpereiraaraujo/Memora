package com.memora.entrypoint.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminPaymentListItemDto(
	UUID paymentOrderId,
	String userEmail,
	String userName,
	String eventTitle,
	String planCode,
	String provider,
	String status,
	int amountCents,
	Integer paidAmountCents,
	LocalDateTime paidAt,
	LocalDateTime createdAt
) {
}
