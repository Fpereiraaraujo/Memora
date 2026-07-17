package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventQrArtCustomization;
import com.memora.core.domain.model.QrArtFormat;
import com.memora.core.domain.model.QrArtTemplateCode;
import com.memora.core.domain.model.QrArtVisualStyle;
import com.memora.dataprovider.database.entity.EventQrArtCustomizationJpaEntity;

public final class EventQrArtCustomizationDatabaseMapper {

	private EventQrArtCustomizationDatabaseMapper() {
	}

	public static EventQrArtCustomization toDomain(Event event, EventQrArtCustomizationJpaEntity entity) {
		return EventQrArtCustomization.builder()
			.id(entity.getId())
			.eventId(entity.getEventId())
			.eventType(event.getType())
			.eventDate(event.getEventDate())
			.eventLocation(event.getLocation())
			.title(entity.getTitle())
			.subtitle(entity.getSubtitle())
			.callToAction(entity.getCallToAction())
			.message(entity.getMessage())
			.themeName(entity.getThemeName())
			.primaryColor(entity.getPrimaryColor())
			.secondaryColor(entity.getSecondaryColor())
			.accentColor(entity.getAccentColor())
			.visualStyle(QrArtVisualStyle.valueOf(entity.getVisualStyle()))
			.templateCode(QrArtTemplateCode.valueOf(entity.getTemplateCode()))
			.format(QrArtFormat.valueOf(entity.getFormat()))
			.showMemoraBranding(entity.isShowMemoraBranding())
			.showEventDate(entity.isShowEventDate())
			.showEventLocation(entity.isShowEventLocation())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}

	public static EventQrArtCustomizationJpaEntity toEntity(EventQrArtCustomization customization) {
		return EventQrArtCustomizationJpaEntity.builder()
			.id(customization.getId())
			.eventId(customization.getEventId())
			.title(customization.getTitle())
			.subtitle(customization.getSubtitle())
			.callToAction(customization.getCallToAction())
			.message(customization.getMessage())
			.themeName(customization.getThemeName())
			.primaryColor(customization.getPrimaryColor())
			.secondaryColor(customization.getSecondaryColor())
			.accentColor(customization.getAccentColor())
			.visualStyle(customization.getVisualStyle().name())
			.templateCode(customization.getTemplateCode().name())
			.format(customization.getFormat().name())
			.showMemoraBranding(customization.isShowMemoraBranding())
			.showEventDate(customization.isShowEventDate())
			.showEventLocation(customization.isShowEventLocation())
			.createdAt(customization.getCreatedAt())
			.updatedAt(customization.getUpdatedAt())
			.build();
	}
}
