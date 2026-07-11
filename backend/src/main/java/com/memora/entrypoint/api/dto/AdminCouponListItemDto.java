package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.CouponStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminCouponListItemDto(
	UUID id,
	String code,
	UUID influencerId,
	String influencerName,
	Integer discountPercent,
	Integer commissionPercent,
	CouponStatus status,
	LocalDateTime startsAt,
	LocalDateTime expiresAt,
	Integer maxUses,
	int currentUses,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}
