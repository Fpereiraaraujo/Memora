package com.memora.entrypoint.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminAffiliateSaleListItemDto(
	UUID paymentOrderId,
	UUID eventId,
	String eventTitle,
	String userName,
	String userEmail,
	String couponCode,
	String planCode,
	int grossAmountCents,
	int discountAmountCents,
	int netAmountCents,
	LocalDateTime paidAt,
	String status
) {
}
