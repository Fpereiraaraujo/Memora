package com.memora.core.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class EventPublicPageCustomization {
	UUID eventId;
	String title;
	LocalDate eventDate;
	String welcomeMessage;
	String coverImageKey;
	List<String> highlightImageKeys;
	String decorativeImageKey;
	EventDecorativeImagePosition decorativeImagePosition;
	EventThemeTemplateCode templateCode;
	String primaryColor;
	String secondaryColor;
	String accentColor;
	EventDecorationStyle decorationStyle;
	@Builder.Default
	boolean publicGalleryEnabled = true;
	LocalDateTime updatedAt;
}
