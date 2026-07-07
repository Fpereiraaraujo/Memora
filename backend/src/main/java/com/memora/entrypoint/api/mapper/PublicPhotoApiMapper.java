package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.Photo;
import com.memora.entrypoint.api.dto.PublicGuestUploadItemResponseDto;
import com.memora.entrypoint.api.dto.PublicGuestUploadResponseDto;
import java.util.List;

public final class PublicPhotoApiMapper {

	private PublicPhotoApiMapper() {
	}

	public static PublicGuestUploadItemResponseDto toItemResponse(Photo photo) {
		return new PublicGuestUploadItemResponseDto(
			photo.getId(),
			photo.getObjectKey(),
			photo.getStatus(),
			photo.getOriginalFilename()
		);
	}

	public static PublicGuestUploadResponseDto toBatchResponse(List<Photo> photos) {
		boolean hasOnlyMessages = photos.stream().allMatch(photo -> photo.getObjectKey() == null || photo.getObjectKey().isBlank());

		return new PublicGuestUploadResponseDto(
			photos.size(),
			photos.stream().map(PublicPhotoApiMapper::toItemResponse).toList(),
			hasOnlyMessages
				? (photos.size() == 1 ? "Recado enviado com sucesso" : "Recados enviados com sucesso")
				: (photos.size() == 1 ? "Foto enviada com sucesso" : "Fotos enviadas com sucesso")
		);
	}
}
