package com.memora.core.domain.param;

import com.memora.core.domain.model.EventDecorationStyle;
import com.memora.core.domain.model.EventDecorativeImagePosition;
import com.memora.core.domain.model.EventThemeTemplateCode;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateEventPublicPageCustomizationParam(
	UUID ownerId,
	UUID eventId,
	String title,
	LocalDate eventDate,
	String welcomeMessage,
	Boolean publicGalleryEnabled,
	EventThemeTemplateCode templateCode,
	String primaryColor,
	String secondaryColor,
	String accentColor,
	EventDecorationStyle decorationStyle,
	EventDecorativeImagePosition decorativeImagePosition
) {
}
