package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.QrArtFormat;
import com.memora.core.domain.model.QrArtTemplateCode;
import com.memora.core.domain.model.QrArtVisualStyle;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EventQrArtCustomizationResponseDto(
	EventType eventType,
	LocalDate eventDate,
	String eventLocation,
	String title,
	String subtitle,
	String callToAction,
	String message,
	String themeName,
	String primaryColor,
	String secondaryColor,
	String accentColor,
	QrArtVisualStyle visualStyle,
	QrArtTemplateCode templateCode,
	QrArtFormat format,
	boolean showMemoraBranding,
	boolean showEventDate,
	boolean showEventLocation,
	LocalDateTime updatedAt
) {
}
