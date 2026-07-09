package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UploadEventPublicPageHighlightImagesParam;
import com.memora.core.usecase.UploadEventPublicPageHighlightImagesUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UploadEventPublicPageHighlightImagesUseCaseImp implements UploadEventPublicPageHighlightImagesUseCase {

	private static final int MAX_HIGHLIGHTS = 3;

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;

	public UploadEventPublicPageHighlightImagesUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		FileStorageService fileStorageService
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.fileStorageService = fileStorageService;
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

		List<String> objectKeys = param.files().stream()
			.map(file -> storeImage(event.getSlug(), file))
			.toList();

		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));

		var updated = current.toBuilder()
			.highlightImageKeys(EventPublicPageCustomizationSupport.writeHighlightKeys(objectKeys))
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventCustomizationRepository.save(updated);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}

	private String storeImage(String slug, UploadEventPublicPageHighlightImagesParam.UploadImageItemParam file) {
		if (file.content() == null || file.content().length == 0) {
			throw new IllegalArgumentException("Highlight image file is required");
		}

		String normalizedContentType = normalizeContentType(file.contentType());
		if (!normalizedContentType.startsWith("image/")) {
			throw new IllegalArgumentException("Highlight image must be a valid image");
		}

		String objectKey = "events/" + slug + "/public-page/highlights/" + UUID.randomUUID() + extractExtension(file.originalFilename());
		fileStorageService.store(objectKey, file.content(), normalizedContentType);
		return objectKey;
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
