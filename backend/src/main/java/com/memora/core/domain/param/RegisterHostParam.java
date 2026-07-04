package com.memora.core.domain.param;

public record RegisterHostParam(
	String name,
	String email,
	String rawPassword
) {
}
