package com.memora.core.domain.param;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateEventPublicPageCustomizationParam(
	UUID ownerId,
	UUID eventId,
	String title,
	LocalDate eventDate,
	String welcomeMessage,
	boolean publicGalleryEnabled
) {
}
