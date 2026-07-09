package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventPublicPageCustomization;
import com.memora.core.domain.param.GetPublicEventCustomizationParam;
import com.memora.core.usecase.GetPublicEventCustomizationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetPublicEventCustomizationUseCaseImp implements GetPublicEventCustomizationUseCase {

	private final EventRepository eventRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final UserRepository userRepository;

	public GetPublicEventCustomizationUseCaseImp(
		EventRepository eventRepository,
		EventCustomizationRepository eventCustomizationRepository,
		UserRepository userRepository
	) {
		this.eventRepository = eventRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.userRepository = userRepository;
	}

	@Override
	public EventPublicPageCustomization execute(GetPublicEventCustomizationParam param) {
		var event = eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		boolean ownerActive = userRepository.findById(event.getOwnerId())
			.map(user -> user.getStatus() == com.memora.core.domain.model.UserStatus.ACTIVE)
			.orElse(false);
		if (!PublicEventAccessSupport.canOpenPublicFlow(event, ownerActive)) {
			throw new NoSuchElementException("Event not found");
		}

		var customization = eventCustomizationRepository.findByEventId(event.getId()).orElse(null);
		return EventPublicPageCustomizationSupport.toDomain(event, customization);
	}
}
