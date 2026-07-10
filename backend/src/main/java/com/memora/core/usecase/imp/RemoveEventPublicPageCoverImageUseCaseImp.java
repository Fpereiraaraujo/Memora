package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.RemoveEventPublicPageCoverImageParam;
import com.memora.core.usecase.RemoveEventPublicPageCoverImageUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class RemoveEventPublicPageCoverImageUseCaseImp implements RemoveEventPublicPageCoverImageUseCase {

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;

	public RemoveEventPublicPageCoverImageUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		FileStorageService fileStorageService
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.fileStorageService = fileStorageService;
	}

	@Override
	public EventPublicPageCustomization execute(RemoveEventPublicPageCoverImageParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));

		fileStorageService.delete(current.getCoverImageKey());

		var updated = current.toBuilder()
			.coverImageKey(null)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventCustomizationRepository.save(updated);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}
}
