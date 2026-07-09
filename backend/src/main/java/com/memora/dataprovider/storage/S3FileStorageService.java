package com.memora.dataprovider.storage;

import com.memora.config.StorageProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@ConditionalOnProperty(prefix = "memora.storage", name = "provider", havingValue = "s3")
public class S3FileStorageService implements FileStorageService {

	private final S3Client s3Client;
	private final StorageProperties storageProperties;

	public S3FileStorageService(S3Client s3Client, StorageProperties storageProperties) {
		this.s3Client = s3Client;
		this.storageProperties = storageProperties;
	}

	@Override
	public void store(String objectKey, byte[] content, String contentType) {
		PutObjectRequest request = PutObjectRequest.builder()
			.bucket(storageProperties.bucketName())
			.key(objectKey)
			.contentType(contentType)
			.build();

		s3Client.putObject(request, RequestBody.fromBytes(content));
	}

	@Override
	public void delete(String objectKey) {
		if (objectKey == null || objectKey.isBlank()) {
			return;
		}

		DeleteObjectRequest request = DeleteObjectRequest.builder()
			.bucket(storageProperties.bucketName())
			.key(objectKey)
			.build();

		s3Client.deleteObject(request);
	}

	@Override
	public String resolvePublicUrl(String objectKey) {
		String publicBaseUrl = storageProperties.publicBaseUrl();
		if (publicBaseUrl != null && !publicBaseUrl.isBlank()) {
			String normalized = publicBaseUrl.endsWith("/")
				? publicBaseUrl.substring(0, publicBaseUrl.length() - 1)
				: publicBaseUrl;
			return normalized + "/" + objectKey;
		}

		return "https://%s.s3.%s.amazonaws.com/%s".formatted(
			storageProperties.bucketName(),
			storageProperties.region(),
			objectKey
		);
	}
}
