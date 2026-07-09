package com.memora.core.domain.param;

import java.util.UUID;

public record RemoveEventPublicPageCoverImageParam(
	UUID ownerId,
	UUID eventId
) {
}
