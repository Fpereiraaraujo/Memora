package com.memora.core.domain.param;

import com.memora.core.domain.model.PhotoStatus;
import java.util.UUID;

public record UpdatePhotoStatusParam(
	UUID ownerId,
	UUID eventId,
	UUID photoId,
	PhotoStatus status
) {
}
