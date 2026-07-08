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
	Boolean favorite,
	Integer likesCount,
	String guestName,
	String guestMessage,
	UUID uploadGroupId,
	LocalDateTime createdAt,
	String downloadUrl
) {
}
