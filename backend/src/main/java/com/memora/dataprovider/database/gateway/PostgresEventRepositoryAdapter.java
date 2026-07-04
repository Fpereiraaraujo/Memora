package com.memora.dataprovider.database.gateway;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.port.EventRepositoryPort;
import com.memora.entrypoint.api.mapper.EventApiMapper;
import com.memora.dataprovider.database.repository.EventJpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class PostgresEventRepositoryAdapter implements EventRepositoryPort {

	private final EventJpaRepository eventJpaRepository;

	public PostgresEventRepositoryAdapter(EventJpaRepository eventJpaRepository) {
		this.eventJpaRepository = eventJpaRepository;
	}

	@Override
	public Event save(Event event) {
		return EventApiMapper.toDomain(eventJpaRepository.save(EventApiMapper.toEntity(event)));
	}

	@Override
	public Optional<Event> findBySlug(String slug) {
		return eventJpaRepository.findBySlug(slug).map(EventApiMapper::toDomain);
	}
}
