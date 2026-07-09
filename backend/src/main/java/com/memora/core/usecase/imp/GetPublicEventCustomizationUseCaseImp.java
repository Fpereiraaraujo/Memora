package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.GetPublicEventCustomizationParam;
import com.memora.core.usecase.GetPublicEventCustomizationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetPublicEventCustomizationUseCaseImp implements GetPublicEventCustomizationUseCase {

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;

	public GetPublicEventCustomizationUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
	}

	@Override
	public EventPublicPageCustomization execute(GetPublicEventCustomizationParam param) {
		var event = eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (!PublicEventAccessSupport.canOpenPublicFlow(event)) {
			throw new NoSuchElementException("Event not found");
		}

		var customization = eventCustomizationRepository.findByEventId(event.getId()).orElse(null);
		return EventPublicPageCustomizationSupport.toDomain(event, customization);
	}
}
