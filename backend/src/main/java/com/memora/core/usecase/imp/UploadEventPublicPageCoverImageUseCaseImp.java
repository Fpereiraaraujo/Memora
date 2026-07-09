package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UploadEventPublicPageCoverImageParam;
import com.memora.core.service.EventFeatureAccessService;
import com.memora.core.usecase.UploadEventPublicPageCoverImageUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UploadEventPublicPageCoverImageUseCaseImp implements UploadEventPublicPageCoverImageUseCase {

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;
	private final EventFeatureAccessService eventFeatureAccessService;

	public UploadEventPublicPageCoverImageUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		FileStorageService fileStorageService,
		EventFeatureAccessService eventFeatureAccessService
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.fileStorageService = fileStorageService;
		this.eventFeatureAccessService = eventFeatureAccessService;
	}

	@Override
	public EventPublicPageCustomization execute(UploadEventPublicPageCoverImageParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (!eventFeatureAccessService.allowsPublicPageCustomization(event)) {
			throw new IllegalArgumentException("A capa personalizada da pagina publica esta disponivel apenas no plano Premium.");
		}

		validateImage(param.content(), param.contentType());

		String objectKey = "events/" + event.getSlug() + "/public-page/cover/" + UUID.randomUUID() + extractExtension(param.originalFilename());
		fileStorageService.store(objectKey, param.content(), normalizeContentType(param.contentType()));

		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));

		var updated = current.toBuilder()
			.coverImageKey(objectKey)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventCustomizationRepository.save(updated);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}

	private void validateImage(byte[] content, String contentType) {
		if (content == null || content.length == 0) {
			throw new IllegalArgumentException("Cover image file is required");
		}

		String normalized = normalizeContentType(contentType);
		if (!normalized.startsWith("image/")) {
			throw new IllegalArgumentException("Cover image must be a valid image");
		}
	}

	private String extractExtension(String filename) {
		if (filename == null || !filename.contains(".")) {
			return "";
		}

		return filename.substring(filename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
	}

	private String normalizeContentType(String contentType) {
		return contentType == null ? "" : contentType.trim().toLowerCase(Locale.ROOT);
	}
}
