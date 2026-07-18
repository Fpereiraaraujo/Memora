package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.RemoveEventPublicPageDecorativeImageParam;
import com.memora.core.usecase.RemoveEventPublicPageDecorativeImageUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RemoveEventPublicPageDecorativeImageUseCaseImp implements RemoveEventPublicPageDecorativeImageUseCase {
	private static final Logger LOGGER = LoggerFactory.getLogger(RemoveEventPublicPageDecorativeImageUseCaseImp.class);

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;

	public RemoveEventPublicPageDecorativeImageUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		FileStorageService fileStorageService
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.fileStorageService = fileStorageService;
	}

	@Override
	public EventPublicPageCustomization execute(RemoveEventPublicPageDecorativeImageParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));
		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));
		String previousObjectKey = current.getDecorativeImageKey();

		if (previousObjectKey == null || previousObjectKey.isBlank()) {
			return EventPublicPageCustomizationSupport.toDomain(event, current);
		}

		var updated = current.toBuilder()
			.decorativeImageKey(null)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();
		eventCustomizationRepository.save(updated);
		deleteQuietly(previousObjectKey);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}

	private void deleteQuietly(String objectKey) {
		try {
			fileStorageService.delete(objectKey);
		} catch (RuntimeException exception) {
			LOGGER.warn("Unable to remove decorative image objectKey={}", objectKey, exception);
		}
	}
}
