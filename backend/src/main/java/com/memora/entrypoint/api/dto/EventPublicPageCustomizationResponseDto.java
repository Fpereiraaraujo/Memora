package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventDecorationStyle;
import com.memora.core.domain.model.EventDecorativeImagePosition;
import com.memora.core.domain.model.EventThemeTemplateCode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record EventPublicPageCustomizationResponseDto(
	String title,
	LocalDate eventDate,
	String welcomeMessage,
	String coverImageUrl,
	List<String> highlightImageUrls,
	String decorativeImageUrl,
	EventDecorativeImagePosition decorativeImagePosition,
	boolean publicGalleryEnabled,
	EventThemeTemplateCode templateCode,
	String primaryColor,
	String secondaryColor,
	String accentColor,
	EventDecorationStyle decorationStyle,
	LocalDateTime updatedAt
) {
}
