package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.GetEventPublicPageCustomizationParam;
import com.memora.core.usecase.GetEventPublicPageCustomizationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetEventPublicPageCustomizationUseCaseImp implements GetEventPublicPageCustomizationUseCase {

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;

	public GetEventPublicPageCustomizationUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
	}

	@Override
	public EventPublicPageCustomization execute(GetEventPublicPageCustomizationParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		var customization = eventCustomizationRepository.findByEventId(event.getId()).orElse(null);
		return EventPublicPageCustomizationSupport.toDomain(event, customization);
	}
}
