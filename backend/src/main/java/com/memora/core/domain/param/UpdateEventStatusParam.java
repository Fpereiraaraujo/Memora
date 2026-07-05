package com.memora.core.domain.param;

import com.memora.core.domain.model.EventStatus;
import java.util.UUID;

public record UpdateEventStatusParam(
	UUID ownerId,
	UUID eventId,
	EventStatus status
) {
}
