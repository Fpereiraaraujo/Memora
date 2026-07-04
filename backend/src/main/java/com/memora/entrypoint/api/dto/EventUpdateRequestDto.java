package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

public record EventUpdateRequestDto(
	@Schema(example = "WEDDING")
	EventType type,

	@Schema(example = "Ana e Bruno")
	String title,

	@Schema(example = "2026-12-05")
	LocalDate eventDate,

	@Schema(example = "Sao Paulo, SP")
	String location
) {
	public boolean isEmpty() {
		return type == null && title == null && eventDate == null && location == null;
	}
}
