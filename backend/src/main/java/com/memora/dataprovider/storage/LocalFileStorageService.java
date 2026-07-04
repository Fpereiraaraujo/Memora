package com.memora.dataprovider.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LocalFileStorageService {

	private final Path basePath;

	public LocalFileStorageService(@Value("${memora.storage.local-path:./data/uploads}") String localPath) {
		this.basePath = Path.of(localPath).toAbsolutePath().normalize();
	}

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
}
