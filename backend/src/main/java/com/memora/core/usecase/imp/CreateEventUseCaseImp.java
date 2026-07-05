package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.param.CreateEventParam;
import com.memora.core.usecase.CreateEventUseCase;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.shared.SlugGenerator;
import org.springframework.stereotype.Service;

@Service
public class CreateEventUseCaseImp implements CreateEventUseCase {

	private final EventRepository eventRepository;
	private final SlugGenerator slugGenerator;

	public CreateEventUseCaseImp(EventRepository eventRepository, SlugGenerator slugGenerator) {
		this.eventRepository = eventRepository;
		this.slugGenerator = slugGenerator;
	}

	@Override
	public Event execute(CreateEventParam param) {
		String slug = slugGenerator.generate(param.title() + "-" + UUID.randomUUID());
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

		Event event = Event.builder()
			.id(UUID.randomUUID())
			.ownerId(param.ownerId())
			.type(param.type())
			.title(param.title())
			.slug(slug)
			.eventDate(param.eventDate())
			.location(param.location())
			.status(EventStatus.DRAFT)
			.planCode(null)
			.photoLimit(null)
			.storageExpiresAt(null)
			.paidAt(null)
			.createdAt(now)
			.updatedAt(now)
			.build();

		EventJpaEntity saved = eventRepository.save(EventDatabaseMapper.toEntity(event));
		return EventDatabaseMapper.toDomain(saved);
	}
}
