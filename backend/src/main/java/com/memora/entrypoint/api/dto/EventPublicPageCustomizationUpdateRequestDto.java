package com.memora.entrypoint.api.dto;

import java.time.LocalDate;

public record EventPublicPageCustomizationUpdateRequestDto(
	String title,
	LocalDate eventDate,
	String welcomeMessage,
	Boolean publicGalleryEnabled
) {
}
