package com.memora.entrypoint.api.auth;

import java.util.UUID;

public record AuthenticatedUserPrincipal(
	UUID userId,
	String email,
	String role
) {
}
