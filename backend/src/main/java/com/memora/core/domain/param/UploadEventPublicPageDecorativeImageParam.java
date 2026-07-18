package com.memora.core.domain.param;

import java.util.UUID;

public record UploadEventPublicPageDecorativeImageParam(
	UUID ownerId,
	UUID eventId,
	String originalFilename,
	String contentType,
	byte[] content
) {
}
