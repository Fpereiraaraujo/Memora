package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.UpdateEventPublicPageCustomizationParam;
import com.memora.core.service.EventFeatureAccessService;
import com.memora.core.usecase.UpdateEventPublicPageCustomizationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class UpdateEventPublicPageCustomizationUseCaseImp implements UpdateEventPublicPageCustomizationUseCase {

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final EventFeatureAccessService eventFeatureAccessService;

	public UpdateEventPublicPageCustomizationUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		EventFeatureAccessService eventFeatureAccessService
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.eventFeatureAccessService = eventFeatureAccessService;
	}

	@Override
	public EventPublicPageCustomization execute(UpdateEventPublicPageCustomizationParam param) {
		if (param.title() == null || param.title().isBlank()) {
			throw new IllegalArgumentException("Public page title is required");
		}

		if (param.welcomeMessage() == null || param.welcomeMessage().isBlank()) {
			throw new IllegalArgumentException("Public page welcome message is required");
		}

		var currentEvent = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		var event = currentEvent.toBuilder()
			.title(param.title().trim())
			.eventDate(param.eventDate())
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventRepository.save(EventDatabaseMapper.toEntity(event));

		var current = eventCustomizationRepository.findByEventId(param.eventId())
			.orElseGet(() -> EventPublicPageCustomizationSupport.createEmpty(param.eventId()));

		var updated = current.toBuilder()
			.welcomeMessage(param.welcomeMessage().trim())
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		eventCustomizationRepository.save(updated);
		return EventPublicPageCustomizationSupport.toDomain(event, updated);
	}
}
