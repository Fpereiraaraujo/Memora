package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.ReferralCommissionStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminReferralCommissionListItemDto(
	UUID id,
	UUID couponId,
	String couponCode,
	UUID paymentOrderId,
	String eventTitle,
	String userName,
	String userEmail,
	int netAmountCents,
	int commissionAmountCents,
	ReferralCommissionStatus status,
	LocalDateTime createdAt,
	LocalDateTime paidAt
) {
}
