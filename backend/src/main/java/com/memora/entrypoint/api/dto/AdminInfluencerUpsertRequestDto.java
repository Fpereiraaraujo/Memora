package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.InfluencerStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminInfluencerUpsertRequestDto(
	@NotBlank String name,
	String instagramHandle,
	String email,
	String pixKey,
	@NotNull InfluencerStatus status
) {
}
