package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PublicEventResponseDto(
	UUID id,
	EventType type,
	String title,
	String slug,
	LocalDate eventDate,
	String location,
	EventStatus status,
	EventPlanCode planCode,
	Integer photoLimit,
	LocalDateTime storageExpiresAt,
	LocalDateTime paidAt
) {
}
