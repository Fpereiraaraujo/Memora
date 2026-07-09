package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserEventDto(
	UUID eventId,
	String title,
	String slug,
	EventType type,
	EventStatus status,
	String planCode,
	Integer photoLimit,
	LocalDate eventDate,
	String location,
	long totalPhotos,
	LocalDateTime paidAt,
	LocalDateTime createdAt
) {
}
