package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.entrypoint.api.dto.EventPublicPageCustomizationResponseDto;
import com.memora.entrypoint.api.dto.EventPublicPageDecorativeImageUploadResponseDto;
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
			resolveUrl(customization.getDecorativeImageKey()),
			customization.getDecorativeImagePosition(),
			customization.isPublicGalleryEnabled(),
			customization.getTemplateCode(),
			customization.getPrimaryColor(),
			customization.getSecondaryColor(),
			customization.getAccentColor(),
			customization.getDecorationStyle(),
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

	public EventPublicPageDecorativeImageUploadResponseDto toDecorativeUploadResponse(
		EventPublicPageCustomization customization
	) {
		return new EventPublicPageDecorativeImageUploadResponseDto(
			resolveUrl(customization.getDecorativeImageKey())
		);
	}

	private String resolveUrl(String objectKey) {
		if (objectKey == null || objectKey.isBlank()) {
			return null;
		}

		return fileStorageService.resolvePublicUrl(objectKey);
	}
}
