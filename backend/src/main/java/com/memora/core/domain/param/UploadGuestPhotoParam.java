package com.memora.core.domain.param;

public record UploadGuestPhotoParam(
	String slug,
	String guestName,
	String guestMessage,
	String originalFilename,
	String contentType,
	long sizeBytes,
	byte[] content
) {
}
