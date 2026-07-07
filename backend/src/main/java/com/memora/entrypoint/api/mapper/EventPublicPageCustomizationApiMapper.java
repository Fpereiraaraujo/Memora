package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationResponseDto;
import com.memora.entrypoint.api.dto.EventPublicPageImageUploadResponseDto;
import org.springframework.stereotype.Component;

@Component
public class EventPublicPageCustomizationApiMapper {

	private final FileStorageService fileStorageService;

	public EventPublicPageCustomizationApiMapper(FileStorageService fileStorageService) {
		this.fileStorageService = fileStorageService;
	}

	public EventPublicPageCustomizationResponseDto toResponse(EventPublicPageCustomization customization) {
		return new EventPublicPageCustomizationResponseDto(
			customization.getTitle(),
			customization.getEventDate(),
			customization.getWelcomeMessage(),
			resolveUrl(customization.getCoverImageKey()),
			customization.getHighlightImageKeys().stream().map(this::resolveUrl).toList(),
			customization.getUpdatedAt()
		);
	}

	public EventPublicPageImageUploadResponseDto toCoverUploadResponse(EventPublicPageCustomization customization) {
		return new EventPublicPageImageUploadResponseDto(resolveUrl(customization.getCoverImageKey()), null);
	}

	public EventPublicPageImageUploadResponseDto toHighlightUploadResponse(EventPublicPageCustomization customization) {
		return new EventPublicPageImageUploadResponseDto(
			null,
			customization.getHighlightImageKeys().stream().map(this::resolveUrl).toList()
		);
	}

	private String resolveUrl(String objectKey) {
		if (objectKey == null || objectKey.isBlank()) {
			return null;
		}

		return fileStorageService.resolvePublicUrl(objectKey);
	}
}
