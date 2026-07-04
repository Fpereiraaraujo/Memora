package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import java.time.LocalDate;
import java.util.UUID;

public record EventResponseDto(
	UUID id,
	EventType type,
	String title,
	String slug,
	LocalDate eventDate,
	String location,
	EventStatus status
) {
}
