package com.memora.core.domain.param;

import com.memora.core.domain.model.QrArtFormat;
import com.memora.core.domain.model.QrArtTemplateCode;
import com.memora.core.domain.model.QrArtVisualStyle;
import java.util.UUID;

public record UpdateEventQrArtCustomizationParam(
	UUID ownerId,
	UUID eventId,
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
	boolean showEventLocation
) {
}
