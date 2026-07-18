package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventDecorativeImagePosition;
import com.memora.core.domain.model.EventDecorationStyle;
import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.model.EventThemeTemplateCode;
import com.memora.dataprovider.database.entity.EventCustomizationJpaEntity;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public final class EventPublicPageCustomizationSupport {

	private EventPublicPageCustomizationSupport() {
	}

	public static EventCustomizationJpaEntity createEmpty(UUID eventId) {
		VisualIdentity identity = resolveVisualIdentity(EventThemeTemplateCode.MEMORA_CLASSIC, null, null, null, null);

		return EventCustomizationJpaEntity.builder()
			.id(UUID.randomUUID())
			.eventId(eventId)
			.welcomeMessage(null)
			.templateCode(identity.templateCode().name())
			.primaryColor(identity.primaryColor())
			.secondaryColor(identity.secondaryColor())
			.accentColor(identity.accentColor())
			.decorationStyle(identity.decorationStyle().name())
			.coverImageKey(null)
			.highlightImageKeys(null)
			.decorativeImageKey(null)
			.decorativeImagePosition(EventDecorativeImagePosition.HERO_RIGHT.name())
			.publicGalleryEnabled(true)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();
	}

	public static EventPublicPageCustomization toDomain(Event event, EventCustomizationJpaEntity customization) {
		VisualIdentity identity = customization == null
			? resolveVisualIdentity(EventThemeTemplateCode.MEMORA_CLASSIC, null, null, null, null)
			: resolveVisualIdentity(
				EventThemeTemplateCode.fromStored(customization.getTemplateCode()),
				customization.getPrimaryColor(),
				customization.getSecondaryColor(),
				customization.getAccentColor(),
				customization.getDecorationStyle()
			);

		return EventPublicPageCustomization.builder()
			.eventId(event.getId())
			.title(event.getTitle())
			.eventDate(event.getEventDate())
			.welcomeMessage(resolveWelcomeMessage(event, customization))
			.coverImageKey(customization == null ? null : customization.getCoverImageKey())
			.highlightImageKeys(readHighlightKeys(customization == null ? null : customization.getHighlightImageKeys()))
			.decorativeImageKey(customization == null ? null : customization.getDecorativeImageKey())
			.decorativeImagePosition(EventDecorativeImagePosition.fromStored(
				customization == null ? null : customization.getDecorativeImagePosition()
			))
			.templateCode(identity.templateCode())
			.primaryColor(identity.primaryColor())
			.secondaryColor(identity.secondaryColor())
			.accentColor(identity.accentColor())
			.decorationStyle(identity.decorationStyle())
			.publicGalleryEnabled(customization == null || customization.isPublicGalleryEnabled())
			.updatedAt(customization == null ? null : customization.getUpdatedAt())
			.build();
	}

	public static VisualIdentity resolveVisualIdentity(
		EventThemeTemplateCode templateCode,
		String primaryColor,
		String secondaryColor,
		String accentColor,
		String decorationStyle
	) {
		ThemeDefaults defaults = defaultsFor(templateCode == null ? EventThemeTemplateCode.MEMORA_CLASSIC : templateCode);
		return new VisualIdentity(
			defaults.templateCode(),
			resolveColor(primaryColor, defaults.primaryColor()),
			resolveColor(secondaryColor, defaults.secondaryColor()),
			resolveColor(accentColor, defaults.accentColor()),
			EventDecorationStyle.fromStored(decorationStyle, defaults.decorationStyle())
		);
	}

	public static String writeHighlightKeys(List<String> keys) {
		if (keys == null || keys.isEmpty()) {
			return null;
		}

		return String.join("\n", keys);
	}

	public static List<String> readHighlightKeys(String value) {
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
			case WEDDING -> "Ajude os anfitriões a guardar cada detalhe desse dia especial. Compartilhe suas fotos, seus bastidores e seu recado com carinho.";
			case BIRTHDAY -> "Compartilhe os melhores momentos dessa celebracao e ajude a montar uma lembranca coletiva.";
			case GRADUATION -> "Registre os momentos mais marcantes dessa conquista e compartilhe com todos que fizeram parte.";
			default -> "Compartilhe suas fotos e ajude a montar uma lembranca coletiva deste evento.";
		};
	}

	private static ThemeDefaults defaultsFor(EventThemeTemplateCode templateCode) {
		return switch (templateCode) {
			case MEMORA_CLASSIC -> new ThemeDefaults(
				templateCode,
				"#EF7885",
				"#FFF3E6",
				"#C5922E",
				EventDecorationStyle.HEARTS
			);
			case KIDS_SKY -> new ThemeDefaults(
				templateCode,
				"#6AAEE8",
				"#D9EFFF",
				"#FFD66B",
				EventDecorationStyle.CLOUDS_STARS
			);
			case KIDS_BLUSH -> new ThemeDefaults(
				templateCode,
				"#E8A7B2",
				"#FBE8EE",
				"#D9A441",
				EventDecorationStyle.CLOUDS_STARS
			);
			case FLORAL_ELEGANT -> new ThemeDefaults(
				templateCode,
				"#D99A9F",
				"#FFF9F5",
				"#B88A44",
				EventDecorationStyle.FLORAL
			);
			case PARTY_BOLD -> new ThemeDefaults(
				templateCode,
				"#F28E94",
				"#FFF7E8",
				"#5AA7A7",
				EventDecorationStyle.CONFETTI
			);
		};
	}

	private static String resolveColor(String value, String fallback) {
		if (value == null || !value.matches("^#[0-9A-Fa-f]{6}$")) {
			return fallback;
		}
		return value.toUpperCase();
	}

	public record VisualIdentity(
		EventThemeTemplateCode templateCode,
		String primaryColor,
		String secondaryColor,
		String accentColor,
		EventDecorationStyle decorationStyle
	) {
	}

	private record ThemeDefaults(
		EventThemeTemplateCode templateCode,
		String primaryColor,
		String secondaryColor,
		String accentColor,
		EventDecorationStyle decorationStyle
	) {
	}
}
