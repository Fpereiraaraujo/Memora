package com.memora.entrypoint.api.dto;

import java.util.List;

public record PublicGuestUploadResponseDto(
	int uploadedCount,
	List<PublicGuestUploadItemResponseDto> photos,
	String message
) {
}
