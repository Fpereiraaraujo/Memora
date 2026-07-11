package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.InfluencerStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminInfluencerListItemDto(
	UUID id,
	String name,
	String instagramHandle,
	String referralCode,
	String email,
	String pixKey,
	InfluencerStatus status,
	long couponsCount,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}
