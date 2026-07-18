package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UploadEventPublicPageDecorativeImageParam;
import com.memora.core.usecase.UploadEventPublicPageDecorativeImageUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.shared.ImageContentValidator;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UploadEventPublicPageDecorativeImageUseCaseImp implements UploadEventPublicPageDecorativeImageUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(UploadEventPublicPageDecorativeImageUseCaseImp.class);
	private static final int MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
	private static final List<String> ALLOWED_CONTENT_TYPES = List.of("image/png", "image/webp");

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;

	public UploadEventPublicPageDecorativeImageUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		FileStorageService fileStorageService
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.fileStorageService = fileStorageService;
	}

	@Override
	public EventPublicPageCustomization execute(UploadEventPublicPageDecorativeImageParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (param.content() != null && param.content().length > MAX_FILE_SIZE_BYTES) {
			throw new IllegalArgumentException("A imagem decorativa deve ter no máximo 10 MB.");
		}

		var metadata = ImageContentValidator.validate(
			param.content(),
			param.contentType(),
			ALLOWED_CONTENT_TYPES
		);
		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));
		String previousObjectKey = current.getDecorativeImageKey();
		String objectKey = "events/" + event.getSlug() + "/public-page/decorative/"
			+ UUID.randomUUID() + metadata.extension();

		fileStorageService.store(objectKey, param.content(), metadata.contentType());
		var updated = current.toBuilder()
			.decorativeImageKey(objectKey)
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
			LOGGER.warn("Unable to remove replaced decorative image objectKey={}", objectKey, exception);
		}
	}
}
