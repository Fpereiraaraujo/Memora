package com.memora.dataprovider.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(prefix = "memora.storage", name = "provider", havingValue = "local", matchIfMissing = true)
public class LocalFileStorageService implements FileStorageService {

	private final Path basePath;
	private final String publicBaseUrl;

	public LocalFileStorageService(
		@Value("${memora.storage.local-path:./data/uploads}") String localPath,
		@Value("${memora.app.api-base-url:http://localhost:8080}") String apiBaseUrl
	) {
		this.basePath = Path.of(localPath).toAbsolutePath().normalize();
		this.publicBaseUrl = normalizeBaseUrl(apiBaseUrl);
	}

	@Override
	public void store(String objectKey, byte[] content, String contentType) {
		Path target = basePath.resolve(objectKey).normalize();
		if (!target.startsWith(basePath)) {
			throw new IllegalArgumentException("Invalid storage path");
		}

		try {
			Files.createDirectories(target.getParent());
			Files.write(target, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
		} catch (IOException exception) {
			throw new IllegalStateException("Failed to store file", exception);
		}
	}

	@Override
	public void delete(String objectKey) {
		if (objectKey == null || objectKey.isBlank()) {
			return;
		}

		Path target = basePath.resolve(objectKey).normalize();
		if (!target.startsWith(basePath)) {
			throw new IllegalArgumentException("Invalid storage path");
		}

		try {
			Files.deleteIfExists(target);
		} catch (IOException exception) {
			throw new IllegalStateException("Failed to delete file", exception);
		}
	}

	@Override
	public String resolvePublicUrl(String objectKey) {
		return publicBaseUrl + "/uploads/" + objectKey;
	}

	private String normalizeBaseUrl(String value) {
		if (value == null || value.isBlank()) {
			return "http://localhost:8080";
		}

		return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
	}
}
