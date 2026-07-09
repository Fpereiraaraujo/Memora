package com.memora.core.domain.param;

import java.util.UUID;

public record RemoveEventPublicPageHighlightImagesParam(
	UUID ownerId,
	UUID eventId
) {
}
