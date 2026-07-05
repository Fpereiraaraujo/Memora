package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.Photo;
import com.memora.entrypoint.api.dto.PhotoResponseDto;

public final class PhotoApiMapper {

	private PhotoApiMapper() {
	}

	public static PhotoResponseDto toResponse(Photo photo) {
		return new PhotoResponseDto(
			photo.getId(),
			photo.getOriginalFilename(),
			photo.getObjectKey(),
			photo.getContentType(),
			photo.getSizeBytes(),
			photo.getStatus(),
			photo.isFavorite(),
			photo.getGuestName(),
			photo.getGuestMessage(),
			photo.getCreatedAt(),
			"/uploads/" + photo.getObjectKey()
		);
	}
}
