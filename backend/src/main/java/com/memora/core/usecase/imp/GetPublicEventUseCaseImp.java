package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.GetPublicEventParam;
import com.memora.core.usecase.GetPublicEventUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetPublicEventUseCaseImp implements GetPublicEventUseCase {

	private final EventRepository eventRepository;

	public GetPublicEventUseCaseImp(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	@Override
	public Event execute(GetPublicEventParam param) {
		return eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));
	}
}
