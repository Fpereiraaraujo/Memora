package com.memora.core.domain.param;

import java.util.UUID;

public record UploadGuestPhotoParam(
	String slug,
	String guestName,
	String guestMessage,
	String originalFilename,
	String contentType,
	long sizeBytes,
	byte[] content,
	UUID uploadGroupId
) {
}
