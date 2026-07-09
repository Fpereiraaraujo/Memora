package com.memora.entrypoint.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminEventListItemDto(
	UUID eventId,
	String title,
	String slug,
	String ownerName,
	String ownerEmail,
	String status,
	String planCode,
	Integer photoLimit,
	long totalPhotos,
	LocalDateTime paidAt,
	LocalDateTime createdAt
) {
}
