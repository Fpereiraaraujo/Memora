package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class Coupon {
	UUID id;
	String code;
	UUID influencerId;
	Integer discountPercent;
	Integer commissionPercent;
	CouponStatus status;
	LocalDateTime startsAt;
	LocalDateTime expiresAt;
	Integer maxUses;
	int currentUses;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
