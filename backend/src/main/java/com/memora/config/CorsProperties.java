package com.memora.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "memora.security.cors")
public record CorsProperties(
	List<String> allowedOriginPatterns
) {
}
