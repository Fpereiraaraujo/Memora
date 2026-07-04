package com.memora.core.domain.param;

import java.util.UUID;

public record GetEventParam(
	UUID ownerId,
	UUID eventId
) {
}
