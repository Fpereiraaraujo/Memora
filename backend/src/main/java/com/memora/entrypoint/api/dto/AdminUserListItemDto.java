package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserListItemDto(
	UUID id,
	String name,
	String email,
	UserRole role,
	UserStatus status,
	LocalDateTime createdAt,
	LocalDateTime lastLoginAt,
	long totalEvents,
	String activePlanCode,
	long totalPhotos,
	long totalApprovedPayments,
	long totalRevenueCents
) {
}
