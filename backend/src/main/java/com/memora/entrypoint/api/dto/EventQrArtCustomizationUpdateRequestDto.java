package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.QrArtFormat;
import com.memora.core.domain.model.QrArtTemplateCode;
import com.memora.core.domain.model.QrArtVisualStyle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EventQrArtCustomizationUpdateRequestDto(
	@NotBlank @Size(max = 80) @Pattern(regexp = "^[^<>]*$") String title,
	@Size(max = 100) @Pattern(regexp = "^[^<>]*$") String subtitle,
	@NotBlank @Size(max = 120) @Pattern(regexp = "^[^<>]*$") String callToAction,
	@Size(max = 180) @Pattern(regexp = "^[^<>]*$") String message,
	@Size(max = 80) @Pattern(regexp = "^[^<>]*$") String themeName,
	@NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String primaryColor,
	@NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String secondaryColor,
	@NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String accentColor,
	@NotNull QrArtVisualStyle visualStyle,
	@NotNull QrArtTemplateCode templateCode,
	@NotNull QrArtFormat format,
	@NotNull Boolean showMemoraBranding,
	@NotNull Boolean showEventDate,
	@NotNull Boolean showEventLocation
) {
}
