package com.memora.core.domain.param;

import java.util.UUID;

public record ListEventPhotosPageParam(
	UUID ownerId,
	UUID eventId,
	int page,
	int size
) {
}
