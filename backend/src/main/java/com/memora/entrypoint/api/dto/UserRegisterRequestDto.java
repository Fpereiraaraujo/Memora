package com.memora.entrypoint.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegisterRequestDto(
	@NotBlank
	@Size(min = 2, max = 120)
	@Schema(example = "Ana Silva")
	String name,

	@NotBlank
	@Email
	@Size(max = 180)
	@Schema(example = "ana@example.com")
	String email,

	@NotBlank
	@Size(min = 8, max = 72)
	@Schema(example = "SenhaForte123")
	String password
) {
}

