package com.memora.core.domain.param;

public record AuthenticateHostParam(
	String email,
	String rawPassword
) {
}
