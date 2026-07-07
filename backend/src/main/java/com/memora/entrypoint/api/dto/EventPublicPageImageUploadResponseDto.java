package com.memora.entrypoint.api.dto;

import java.util.List;

public record EventPublicPageImageUploadResponseDto(
	String coverImageUrl,
	List<String> highlightImageUrls
) {
}
