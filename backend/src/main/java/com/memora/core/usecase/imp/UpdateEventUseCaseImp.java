package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.UpdateEventParam;
import com.memora.core.usecase.UpdateEventUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class UpdateEventUseCaseImp implements UpdateEventUseCase {

	private final EventRepository eventRepository;

	public UpdateEventUseCaseImp(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	@Override
	@CacheEvict(cacheNames = "publicEvents", allEntries = true)
	public Event execute(UpdateEventParam param) {
		Event event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		Event updated = event.toBuilder()
			.type(param.type() != null ? param.type() : event.getType())
			.title(param.title() != null ? param.title() : event.getTitle())
			.eventDate(param.eventDate() != null ? param.eventDate() : event.getEventDate())
			.location(param.location() != null ? param.location() : event.getLocation())
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		return EventDatabaseMapper.toDomain(eventRepository.save(EventDatabaseMapper.toEntity(updated)));
	}
}
