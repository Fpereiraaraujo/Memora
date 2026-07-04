package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class User {
	UUID id;
	String name;
	String email;
	String passwordHash;
	UserRole role;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}

