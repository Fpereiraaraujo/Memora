package com.memora.entrypoint.api.dto;

import java.util.UUID;

public record UserRegisterResponseDto(
	UUID id,
	String name,
	String email
) {
}

