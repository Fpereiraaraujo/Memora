package com.memora.core.usecase;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventType;
import java.time.LocalDate;
import java.util.UUID;

public interface CreateEventUseCase {

	Event execute(Command command);

	record Command(
		UUID ownerId,
		EventType type,
		String title,
		LocalDate eventDate,
		String location
	) {
	}
}

