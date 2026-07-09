package com.memora.entrypoint.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminDeleteUserRequestDto(
	@NotBlank String confirmationEmail,
	@NotBlank String reason
) {
}
