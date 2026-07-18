package com.memora.core.domain.param;

import java.util.UUID;

public record RemoveEventPublicPageDecorativeImageParam(
	UUID ownerId,
	UUID eventId
) {
}
