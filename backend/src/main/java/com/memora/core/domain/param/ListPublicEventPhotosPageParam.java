package com.memora.core.domain.param;

public record ListPublicEventPhotosPageParam(
	String slug,
	int page,
	int size
) {
}
