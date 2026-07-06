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
			photo.getGuestName(),
			photo.getGuestMessage(),
			photo.getCreatedAt(),
			fileStorageService.resolvePublicUrl(photo.getObjectKey())
		);
	}
}
