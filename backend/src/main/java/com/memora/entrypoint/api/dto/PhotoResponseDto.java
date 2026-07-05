package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.PhotoStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record PhotoResponseDto(
	UUID id,
	String originalFilename,
	String objectKey,
	String contentType,
	Long sizeBytes,
	PhotoStatus status,
	String guestName,
	String guestMessage,
	LocalDateTime createdAt,
	String downloadUrl
) {
}
