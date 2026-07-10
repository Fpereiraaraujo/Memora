package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.param.UpdateEventStatusParam;
import com.memora.core.usecase.UpdateEventStatusUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class UpdateEventStatusUseCaseImp implements UpdateEventStatusUseCase {

	private final EventRepository eventRepository;

	public UpdateEventStatusUseCaseImp(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	@Override
	@CacheEvict(cacheNames = "publicEvents", allEntries = true)
	public Event execute(UpdateEventStatusParam param) {
		Event event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		validateTransition(event.getStatus(), param.status());

		Event updated = event.toBuilder()
			.status(param.status())
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		return EventDatabaseMapper.toDomain(eventRepository.save(EventDatabaseMapper.toEntity(updated)));
	}

	private void validateTransition(EventStatus currentStatus, EventStatus nextStatus) {
		if (nextStatus == null) {
			throw new IllegalArgumentException("Event status is required");
		}

		if (currentStatus == nextStatus) {
			return;
		}

		boolean validTransition = switch (currentStatus) {
			case DRAFT -> nextStatus == EventStatus.ACTIVE;
			case ACTIVE -> nextStatus == EventStatus.PAUSED;
			case PAUSED -> nextStatus == EventStatus.ACTIVE;
			case EXPIRED -> false;
		};

		if (!validTransition) {
			throw new IllegalArgumentException("Invalid event status transition");
		}
	}
}
