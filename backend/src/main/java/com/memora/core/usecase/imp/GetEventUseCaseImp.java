package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.GetEventParam;
import com.memora.core.usecase.GetEventUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetEventUseCaseImp implements GetEventUseCase {

	private final EventRepository eventRepository;

	public GetEventUseCaseImp(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	@Override
	public Event execute(GetEventParam param) {
		return eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));
	}
}
