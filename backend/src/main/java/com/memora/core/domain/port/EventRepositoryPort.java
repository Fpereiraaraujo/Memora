package com.memora.core.domain.port;

import com.memora.core.domain.model.Event;
import java.util.Optional;

public interface EventRepositoryPort {
	Event save(Event event);
	Optional<Event> findBySlug(String slug);
}

