package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AdminUserDetailsResponseDto(
	UUID id,
	String name,
	String email,
	UserRole role,
	UserStatus status,
	LocalDateTime createdAt,
	LocalDateTime lastLoginAt,
	LocalDateTime deletedAt,
	long totalEvents,
	long totalPhotos,
	String currentPlanCode,
	long totalApprovedPayments,
	long totalRevenueCents,
	List<AdminUserEventDto> events,
	List<AdminPaymentListItemDto> payments
) {
}
