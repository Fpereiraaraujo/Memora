package com.memora.entrypoint.api.dto;

import java.util.UUID;

public record UserLoginResponseDto(
	String token,
	UUID id,
	String name,
	String email
) {
}
