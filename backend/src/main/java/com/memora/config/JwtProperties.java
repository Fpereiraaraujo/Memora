package com.memora.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "memora.security.jwt")
public record JwtProperties(
	String secret,
	long expirationMinutes,
	String issuer
) {
}
