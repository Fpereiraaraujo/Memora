package com.memora.core.domain.param;

public record ValidateGuestUploadBatchParam(
	String slug,
	int fileCount,
	long totalSizeBytes
) {
}
