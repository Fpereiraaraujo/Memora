package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class ReferralCommission {
	UUID id;
	UUID influencerId;
	UUID couponId;
	UUID paymentOrderId;
	UUID eventId;
	UUID userId;
	int grossAmountCents;
	int discountAmountCents;
	int netAmountCents;
	int commissionPercent;
	int commissionAmountCents;
	ReferralCommissionStatus status;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
	LocalDateTime paidAt;
}
