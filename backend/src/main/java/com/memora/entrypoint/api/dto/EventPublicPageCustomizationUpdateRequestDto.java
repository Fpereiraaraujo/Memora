package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventDecorationStyle;
import com.memora.core.domain.model.EventDecorativeImagePosition;
import com.memora.core.domain.model.EventThemeTemplateCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record EventPublicPageCustomizationUpdateRequestDto(
	@NotBlank @Size(max = 90) @Pattern(regexp = "^[^<>]*$") String title,
	LocalDate eventDate,
	@NotBlank @Size(max = 420) @Pattern(regexp = "^[^<>]*$") String welcomeMessage,
	Boolean publicGalleryEnabled,
	EventThemeTemplateCode templateCode,
	@Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String primaryColor,
	@Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String secondaryColor,
	@Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String accentColor,
	EventDecorationStyle decorationStyle,
	EventDecorativeImagePosition decorativeImagePosition
) {
}
