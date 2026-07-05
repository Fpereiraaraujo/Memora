package com.memora.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "memora.app")
public record AppProperties(
	String publicBaseUrl,
	String apiBaseUrl,
	String infinitepayWebhookToken
) {
}
