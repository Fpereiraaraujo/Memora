package com.memora.dataprovider.storage;

public interface FileStorageService {

	void store(String objectKey, byte[] content, String contentType);

	String resolvePublicUrl(String objectKey);
}
