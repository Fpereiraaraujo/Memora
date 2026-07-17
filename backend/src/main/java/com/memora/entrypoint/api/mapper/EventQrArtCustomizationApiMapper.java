package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.EventQrArtCustomization;
import com.memora.entrypoint.api.dto.EventQrArtCustomizationResponseDto;

public final class EventQrArtCustomizationApiMapper {

	private EventQrArtCustomizationApiMapper() {
	}

	public static EventQrArtCustomizationResponseDto toResponse(EventQrArtCustomization customization) {
		return new EventQrArtCustomizationResponseDto(
			customization.getEventType(),
			customization.getEventDate(),
			customization.getEventLocation(),
			customization.getTitle(),
			customization.getSubtitle(),
			customization.getCallToAction(),
			customization.getMessage(),
			customization.getThemeName(),
			customization.getPrimaryColor(),
			customization.getSecondaryColor(),
			customization.getAccentColor(),
			customization.getVisualStyle(),
			customization.getTemplateCode(),
			customization.getFormat(),
			customization.isShowMemoraBranding(),
			customization.isShowEventDate(),
			customization.isShowEventLocation(),
			customization.getUpdatedAt()
		);
	}
}
