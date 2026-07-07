package com.memora.core.domain.param;

import java.util.UUID;

public record GetEventPublicPageCustomizationParam(
	UUID ownerId,
	UUID eventId
) {
}
