package com.memora.entrypoint.api.dto;

import java.util.UUID;

public record UserProfileResponseDto(
	UUID id,
	String name,
	String email
) {
}
