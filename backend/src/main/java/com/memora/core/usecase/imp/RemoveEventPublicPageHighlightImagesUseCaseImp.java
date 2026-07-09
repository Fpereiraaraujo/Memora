package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.RemoveEventPublicPageHighlightImagesParam;
import com.memora.core.service.EventFeatureAccessService;
import com.memora.core.usecase.RemoveEventPublicPageHighlightImagesUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class RemoveEventPublicPageHighlightImagesUseCaseImp implements RemoveEventPublicPageHighlightImagesUseCase {

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final FileStorageService fileStorageService;
	private final EventFeatureAccessService eventFeatureAccessService;

	public RemoveEventPublicPageHighlightImagesUseCaseImp(
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
	public EventPublicPageCustomization execute(RemoveEventPublicPageHighlightImagesParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (!eventFeatureAccessService.allowsPublicPageCustomization(event)) {
			throw new IllegalArgumentException("Os destaques da pagina publica estao disponiveis apenas no plano Premium.");
		}

		var current = eventCustomizationRepository.findByEventId(event.getId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(event.getId()));

		for (String objectKey : EventPublicPageCustomizationSupport.readHighlightKeys(current.getHighlightImageKeys())) {
			fileStorageService.delete(objectKey);
		}

		var updated = current.toBuilder()
			.highlightImageKeys(null)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventCustomizationRepository.save(updated);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}
}
