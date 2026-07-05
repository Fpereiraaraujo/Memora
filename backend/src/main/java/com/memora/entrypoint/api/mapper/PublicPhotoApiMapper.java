package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.Photo;
import com.memora.entrypoint.api.dto.PublicGuestUploadResponseDto;

public final class PublicPhotoApiMapper {

	private PublicPhotoApiMapper() {
	}

	public static PublicGuestUploadResponseDto toResponse(Photo photo) {
		return new PublicGuestUploadResponseDto(
			photo.getId(),
			photo.getObjectKey(),
			photo.getStatus(),
			"Fotos enviadas com sucesso"
		);
	}
}
