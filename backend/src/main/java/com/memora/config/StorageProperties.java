package com.memora.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "memora.storage")
public record StorageProperties(
	String provider,
	String localPath,
	String bucketName,
	String region,
	String publicBaseUrl
) {
}
