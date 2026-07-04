package com.memora.dataprovider.repository;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.port.EventRepositoryPort;
import com.memora.infra.persistence.jpa.mapper.EventJpaMapper;
import com.memora.infra.persistence.jpa.repository.EventJpaRepository;
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
		return EventJpaMapper.toDomain(eventJpaRepository.save(EventJpaMapper.toEntity(event)));
	}

	@Override
	public Optional<Event> findBySlug(String slug) {
		return eventJpaRepository.findBySlug(slug).map(EventJpaMapper::toDomain);
	}
}

