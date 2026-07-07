package com.memora.core.domain.param;

import java.util.List;
import java.util.UUID;

public record UploadEventPublicPageHighlightImagesParam(
	UUID ownerId,
	UUID eventId,
	List<UploadImageItemParam> files
) {
	public record UploadImageItemParam(
		String originalFilename,
		String contentType,
		byte[] content
	) {
	}
}
