package com.memora.core.domain.param;

import java.util.UUID;

public record ListEventPhotosParam(
	UUID ownerId,
	UUID eventId
) {
}
