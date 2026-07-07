package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.dataprovider.database.entity.EventCustomizationJpaEntity;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

final class EventPublicPageCustomizationSupport {

	private EventPublicPageCustomizationSupport() {
	}

	static EventCustomizationJpaEntity createEmpty(UUID eventId) {
		return EventCustomizationJpaEntity.builder()
			.id(UUID.randomUUID())
			.eventId(eventId)
			.welcomeMessage(null)
			.coverImageKey(null)
			.highlightImageKeys(null)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();
	}

	static EventPublicPageCustomization toDomain(Event event, EventCustomizationJpaEntity customization) {
		return EventPublicPageCustomization.builder()
			.eventId(event.getId())
			.title(event.getTitle())
			.eventDate(event.getEventDate())
			.welcomeMessage(resolveWelcomeMessage(event, customization))
			.coverImageKey(customization == null ? null : customization.getCoverImageKey())
			.highlightImageKeys(readHighlightKeys(customization == null ? null : customization.getHighlightImageKeys()))
			.updatedAt(customization == null ? null : customization.getUpdatedAt())
			.build();
	}

	static String writeHighlightKeys(List<String> keys) {
		if (keys == null || keys.isEmpty()) {
			return null;
		}

		return String.join("\n", keys);
	}

	static List<String> readHighlightKeys(String value) {
		if (value == null || value.isBlank()) {
			return List.of();
		}

		return Arrays.stream(value.split("\\R"))
			.map(String::trim)
			.filter(item -> !item.isBlank())
			.toList();
	}

	private static String resolveWelcomeMessage(Event event, EventCustomizationJpaEntity customization) {
		if (customization != null && customization.getWelcomeMessage() != null && !customization.getWelcomeMessage().isBlank()) {
			return customization.getWelcomeMessage();
		}

		return switch (event.getType()) {
			case WEDDING -> "Ajude os noivos a guardar cada detalhe desse dia especial. Compartilhe suas fotos, seus bastidores e seu recado com carinho.";
			case BIRTHDAY -> "Compartilhe os melhores momentos dessa celebracao e ajude a montar uma lembranca coletiva.";
			case GRADUATION -> "Registre os momentos mais marcantes dessa conquista e compartilhe com todos que fizeram parte.";
			default -> "Compartilhe suas fotos e ajude a montar uma lembranca coletiva deste evento.";
		};
	}
}
