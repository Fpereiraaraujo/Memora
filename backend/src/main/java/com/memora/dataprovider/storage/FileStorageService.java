package com.memora.dataprovider.storage;

public interface FileStorageService {

	void store(String objectKey, byte[] content, String contentType);

	void delete(String objectKey);

	String resolvePublicUrl(String objectKey);
}
