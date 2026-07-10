package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.config.UploadProperties;
import com.memora.core.domain.param.UploadEventPublicPageHighlightImagesParam;
import com.memora.core.usecase.UploadEventPublicPageHighlightImagesUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.shared.ImageContentValidator;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UploadEventPublicPageHighlightImagesUseCaseImp implements UploadEventPublicPageHighlightImagesUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(UploadEventPublicPageHighlightImagesUseCaseImp.class);

	private static final int MAX_HIGHLIGHTS = 3;

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;
	private final UploadProperties uploadProperties;

	public UploadEventPublicPageHighlightImagesUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		FileStorageService fileStorageService,
		UploadProperties uploadProperties
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.fileStorageService = fileStorageService;
		this.uploadProperties = uploadProperties;
	}

	@Override
	public EventPublicPageCustomization execute(UploadEventPublicPageHighlightImagesParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (param.files() == null || param.files().isEmpty()) {
			throw new IllegalArgumentException("At least one highlight image is required");
		}

		if (param.files().size() > MAX_HIGHLIGHTS) {
			throw new IllegalArgumentException("Public page supports at most 3 highlight images");
		}

		List<ValidatedImage> validatedImages = param.files().stream()
			.map(this::validateImage)
			.toList();

		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));
		List<String> previousObjectKeys = EventPublicPageCustomizationSupport.readHighlightKeys(current.getHighlightImageKeys());
		List<String> objectKeys = new ArrayList<>();
		try {
			for (ValidatedImage validatedImage : validatedImages) {
				objectKeys.add(storeImage(event.getSlug(), validatedImage));
			}
		} catch (RuntimeException exception) {
			objectKeys.forEach(this::deleteQuietly);
			throw exception;
		}

		var updated = current.toBuilder()
			.highlightImageKeys(EventPublicPageCustomizationSupport.writeHighlightKeys(objectKeys))
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		try {
			eventCustomizationRepository.save(updated);
		} catch (RuntimeException exception) {
			objectKeys.forEach(this::deleteQuietly);
			throw exception;
		}
		previousObjectKeys.forEach(this::deleteQuietly);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}

	private ValidatedImage validateImage(UploadEventPublicPageHighlightImagesParam.UploadImageItemParam file) {
		if (file.content() == null || file.content().length == 0) {
			throw new IllegalArgumentException("Highlight image file is required");
		}

		if (file.content().length > uploadProperties.maxFileSizeBytes()) {
			throw new IllegalArgumentException("Cada foto em destaque deve ter no máximo 20 MB.");
		}
		var metadata = ImageContentValidator.validate(
			file.content(),
			file.contentType(),
			uploadProperties.allowedContentTypes()
		);
		return new ValidatedImage(file, metadata);
	}

	private String storeImage(String slug, ValidatedImage validatedImage) {
		String objectKey = "events/" + slug + "/public-page/highlights/" + UUID.randomUUID() + validatedImage.metadata().extension();
		fileStorageService.store(
			objectKey,
			validatedImage.file().content(),
			validatedImage.metadata().contentType()
		);
		return objectKey;
	}

	private void deleteQuietly(String objectKey) {
		try {
			fileStorageService.delete(objectKey);
		} catch (RuntimeException exception) {
			LOGGER.warn("Unable to remove replaced highlight objectKey={}", objectKey, exception);
		}
	}

	private record ValidatedImage(
		UploadEventPublicPageHighlightImagesParam.UploadImageItemParam file,
		ImageContentValidator.ImageMetadata metadata
	) {
	}
}
