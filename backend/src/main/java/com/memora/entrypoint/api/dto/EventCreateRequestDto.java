package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record EventCreateRequestDto(
	@NotNull
	@Schema(example = "WEDDING")
	EventType type,

	@NotBlank
	@Size(max = 160)
	@Schema(example = "Ana e Bruno")
	String title,

	@Schema(example = "2026-12-05")
	LocalDate eventDate,

	@Size(max = 180)
	@Schema(example = "São Paulo, SP")
	String location
) {
}
