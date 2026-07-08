package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.Photo;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.entrypoint.api.dto.PhotoResponseDto;
import org.springframework.stereotype.Component;

@Component
public class PhotoApiMapper {

	private final FileStorageService fileStorageService;

	public PhotoApiMapper(FileStorageService fileStorageService) {
		this.fileStorageService = fileStorageService;
	}

	public PhotoResponseDto toResponse(Photo photo) {
		return new PhotoResponseDto(
			photo.getId(),
			photo.getOriginalFilename(),
			photo.getObjectKey(),
			photo.getContentType(),
			photo.getSizeBytes(),
			photo.getStatus(),
			photo.isFavorite(),
			photo.getLikesCount(),
			photo.getGuestName(),
			photo.getGuestMessage(),
			photo.getUploadGroupId(),
			photo.getCreatedAt(),
			resolvePublicUrl(photo.getObjectKey())
		);
	}

	private String resolvePublicUrl(String objectKey) {
		if (objectKey == null || objectKey.isBlank()) {
			return null;
		}

		return fileStorageService.resolvePublicUrl(objectKey);
	}
}
