package com.memora.entrypoint.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record EventPublicPageCustomizationResponseDto(
	String title,
	LocalDate eventDate,
	String welcomeMessage,
	String coverImageUrl,
	List<String> highlightImageUrls,
	boolean publicGalleryEnabled,
	LocalDateTime updatedAt
) {
}
