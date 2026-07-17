package com.memora.core.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class EventQrArtCustomization {
	UUID id;
	UUID eventId;
	EventType eventType;
	LocalDate eventDate;
	String eventLocation;
	String title;
	String subtitle;
	String callToAction;
	String message;
	String themeName;
	String primaryColor;
	String secondaryColor;
	String accentColor;
	QrArtVisualStyle visualStyle;
	QrArtTemplateCode templateCode;
	QrArtFormat format;
	boolean showMemoraBranding;
	boolean showEventDate;
	boolean showEventLocation;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
