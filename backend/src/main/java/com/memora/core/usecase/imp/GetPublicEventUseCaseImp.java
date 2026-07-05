package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.param.GetPublicEventParam;
import com.memora.core.usecase.GetPublicEventUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class GetPublicEventUseCaseImp implements GetPublicEventUseCase {

	private final EventRepository eventRepository;

	public GetPublicEventUseCaseImp(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	@Override
	@Cacheable(cacheNames = "publicEvents", key = "#param.slug()")
	public Event execute(GetPublicEventParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (event.getStatus() != EventStatus.ACTIVE) {
			throw new NoSuchElementException("Event not found");
		}

		return event;
	}
}
