package com.memora.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "memora.upload")
public record UploadProperties(
	long maxFileSizeBytes,
	List<String> allowedContentTypes,
	int requestsPerMinutePerIp,
	int maxFilesPerRequest
) {
}
