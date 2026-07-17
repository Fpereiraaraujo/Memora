package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventQrArtCustomization;
import com.memora.core.domain.model.QrArtFormat;
import com.memora.core.domain.model.QrArtTemplateCode;
import com.memora.core.domain.model.QrArtVisualStyle;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

final class EventQrArtCustomizationSupport {

	private EventQrArtCustomizationSupport() {
	}

	static EventQrArtCustomization createDefault(Event event) {
		TemplateDefaults defaults = defaultsFor(event);
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

		return EventQrArtCustomization.builder()
			.id(UUID.randomUUID())
			.eventId(event.getId())
			.eventType(event.getType())
			.eventDate(event.getEventDate())
			.eventLocation(event.getLocation())
			.title(event.getTitle())
			.subtitle(eventTypeLabel(event))
			.callToAction("Escaneie e envie suas fotos")
			.message("Ajude a guardar as memórias desse dia especial")
			.themeName(null)
			.primaryColor(defaults.primaryColor())
			.secondaryColor(defaults.secondaryColor())
			.accentColor(defaults.accentColor())
			.visualStyle(defaults.visualStyle())
			.templateCode(defaults.templateCode())
			.format(QrArtFormat.A5_VERTICAL)
			.showMemoraBranding(true)
			.showEventDate(false)
			.showEventLocation(false)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}

	private static TemplateDefaults defaultsFor(Event event) {
		return switch (event.getType()) {
			case WEDDING, BAPTISM -> new TemplateDefaults(
				QrArtTemplateCode.ELEGANT_FLORAL,
				QrArtVisualStyle.ELEGANT,
				"#D99A9F",
				"#FFF9F5",
				"#B88A44"
			);
			case BABY_SHOWER -> new TemplateDefaults(
				QrArtTemplateCode.BABY_REVEAL,
				QrArtVisualStyle.DELICATE,
				"#AFCFE8",
				"#FFF8F2",
				"#E8A7B2"
			);
			case CORPORATE, GRADUATION -> new TemplateDefaults(
				QrArtTemplateCode.MINIMAL_CHIC,
				QrArtVisualStyle.MINIMAL,
				"#244C5A",
				"#F7F1E7",
				"#C49A55"
			);
			case BIRTHDAY, OTHER -> new TemplateDefaults(
				QrArtTemplateCode.PARTY_FUN,
				QrArtVisualStyle.FUN,
				"#F28E94",
				"#FFF7E8",
				"#5AA7A7"
			);
		};
	}

	private static String eventTypeLabel(Event event) {
		return switch (event.getType()) {
			case WEDDING -> "Celebração de casamento";
			case BIRTHDAY -> "Celebração de aniversário";
			case GRADUATION -> "Celebração de formatura";
			case BABY_SHOWER -> "Celebração de chá de bebê";
			case BAPTISM -> "Celebração de batizado";
			case CORPORATE -> "Evento especial";
			case OTHER -> "Celebração especial";
		};
	}

	private record TemplateDefaults(
		QrArtTemplateCode templateCode,
		QrArtVisualStyle visualStyle,
		String primaryColor,
		String secondaryColor,
		String accentColor
	) {
	}
}
