package com.memora.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@ConditionalOnProperty(prefix = "memora.storage", name = "provider", havingValue = "s3")
public class AwsStorageConfig {

	@Bean
	public S3Client s3Client(StorageProperties storageProperties) {
		return S3Client.builder()
			.region(Region.of(storageProperties.region()))
			.build();
	}
}
