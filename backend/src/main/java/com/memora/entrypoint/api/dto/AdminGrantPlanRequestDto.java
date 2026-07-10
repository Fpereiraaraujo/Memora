package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventPlanCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AdminGrantPlanRequestDto(
	@NotNull UUID eventId,
	@NotNull EventPlanCode planCode,
	@NotBlank String reason
) {
}
