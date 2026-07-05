package com.memora.core.domain.param;

import java.util.UUID;

public record UpdatePhotoFavoriteParam(
	UUID ownerId,
	UUID eventId,
	UUID photoId,
	boolean favorite
) {
}
