package com.memora.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "memora.infinitepay")
public record InfinitePayProperties(
	String apiBaseUrl,
	String handle,
	String authHeaderName,
	String authHeaderValue
) {
}
