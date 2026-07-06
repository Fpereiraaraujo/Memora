package com.memora.config;

import java.nio.file.Path;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ConditionalOnProperty(prefix = "memora.storage", name = "provider", havingValue = "local", matchIfMissing = true)
public class StorageWebConfig implements WebMvcConfigurer {

	private final Path basePath;

	public StorageWebConfig(@Value("${memora.storage.local-path:./data/uploads}") String localPath) {
		this.basePath = Path.of(localPath).toAbsolutePath().normalize();
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String location = basePath.toUri().toString();
		if (!location.endsWith("/")) {
			location = location + "/";
		}

		registry.addResourceHandler("/uploads/**")
			.addResourceLocations(location);
	}
}
