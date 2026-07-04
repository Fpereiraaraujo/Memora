package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.ListEventsParam;
import com.memora.core.usecase.ListEventsUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ListEventsUseCaseImp implements ListEventsUseCase {

	private final EventRepository eventRepository;

	public ListEventsUseCaseImp(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	@Override
	public List<Event> execute(ListEventsParam param) {
		return eventRepository.findAllByOwnerIdOrderByCreatedAtDesc(param.ownerId()).stream()
			.map(EventDatabaseMapper::toDomain)
			.toList();
	}
}
