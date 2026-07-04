package com.memora.core.domain.param;

import com.memora.core.domain.model.EventType;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateEventParam(
	UUID ownerId,
	UUID eventId,
	EventType type,
	String title,
	LocalDate eventDate,
	String location
) {
}
