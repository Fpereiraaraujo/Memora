package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.config.UploadProperties;
import com.memora.core.domain.param.UploadEventPublicPageCoverImageParam;
import com.memora.core.usecase.UploadEventPublicPageCoverImageUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.shared.ImageContentValidator;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UploadEventPublicPageCoverImageUseCaseImp implements UploadEventPublicPageCoverImageUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(UploadEventPublicPageCoverImageUseCaseImp.class);

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;
	private final UploadProperties uploadProperties;

	public UploadEventPublicPageCoverImageUseCaseImp(
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
	public EventPublicPageCustomization execute(UploadEventPublicPageCoverImageParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (param.content() != null && param.content().length > uploadProperties.maxFileSizeBytes()) {
			throw new IllegalArgumentException("A foto de capa deve ter no máximo 20 MB.");
		}
		var metadata = ImageContentValidator.validate(
			param.content(),
			param.contentType(),
			uploadProperties.allowedContentTypes()
		);

		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));
		String previousObjectKey = current.getCoverImageKey();
		String objectKey = "events/" + event.getSlug() + "/public-page/cover/" + UUID.randomUUID() + metadata.extension();
		fileStorageService.store(objectKey, param.content(), metadata.contentType());

		var updated = current.toBuilder()
			.coverImageKey(objectKey)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		try {
			eventCustomizationRepository.save(updated);
		} catch (RuntimeException exception) {
			deleteQuietly(objectKey);
			throw exception;
		}
		deleteQuietly(previousObjectKey);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}

	private void deleteQuietly(String objectKey) {
		try {
			fileStorageService.delete(objectKey);
		} catch (RuntimeException exception) {
			LOGGER.warn("Unable to remove replaced cover objectKey={}", objectKey, exception);
		}
	}
}
