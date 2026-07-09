package com.memora.entrypoint.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminActionRequestDto(
	@NotBlank String reason
) {
}
