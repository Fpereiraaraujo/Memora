package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.PhotoStatus;

public record PhotoStatusUpdateRequestDto(
	PhotoStatus status
) {
}
