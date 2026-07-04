package com.memora.core.service;

import com.memora.core.usecase.CreateEventUseCase;
import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.port.EventRepositoryPort;
import com.memora.core.domain.port.SlugGeneratorPort;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CreateEventService implements CreateEventUseCase {

	private final EventRepositoryPort eventRepositoryPort;
	private final SlugGeneratorPort slugGeneratorPort;

	public CreateEventService(EventRepositoryPort eventRepositoryPort, SlugGeneratorPort slugGeneratorPort) {
		this.eventRepositoryPort = eventRepositoryPort;
		this.slugGeneratorPort = slugGeneratorPort;
	}

	@Override
	public Event execute(Command command) {
		String slug = slugGeneratorPort.generate(command.title() + "-" + UUID.randomUUID());
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

		Event event = Event.builder()
			.id(UUID.randomUUID())
			.ownerId(command.ownerId())
			.type(command.type())
			.title(command.title())
			.slug(slug)
			.eventDate(command.eventDate())
			.location(command.location())
			.status(EventStatus.DRAFT)
			.createdAt(now)
			.updatedAt(now)
			.build();

		return eventRepositoryPort.save(event);
	}
}

