package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import java.util.UUID;

public record UserProfileResponseDto(
	UUID id,
	String name,
	String email,
	UserRole role,
	UserStatus status
) {
}
