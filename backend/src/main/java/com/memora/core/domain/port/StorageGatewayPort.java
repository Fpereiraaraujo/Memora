package com.memora.core.domain.port;

public interface StorageGatewayPort {
	String createPresignedUploadUrl(String objectKey, String contentType);
}

