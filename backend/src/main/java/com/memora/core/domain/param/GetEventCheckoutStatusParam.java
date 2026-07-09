package com.memora.core.domain.param;

import java.util.UUID;

public record GetEventCheckoutStatusParam(
	UUID ownerId,
	UUID eventId
) {
}
