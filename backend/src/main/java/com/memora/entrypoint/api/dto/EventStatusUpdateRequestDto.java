package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventStatus;
import io.swagger.v3.oas.annotations.media.Schema;

public record EventStatusUpdateRequestDto(
	@Schema(example = "ACTIVE")
	EventStatus status
) {
}
