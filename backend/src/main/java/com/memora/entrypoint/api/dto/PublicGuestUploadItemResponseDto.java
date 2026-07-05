package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.PhotoStatus;
import java.util.UUID;

public record PublicGuestUploadItemResponseDto(
	UUID photoId,
	String objectKey,
	PhotoStatus status,
	String originalFilename
) {
}
