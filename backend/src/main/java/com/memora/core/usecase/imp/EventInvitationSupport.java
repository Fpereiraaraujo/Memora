package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventInvitation;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

final class EventInvitationSupport {
	private EventInvitationSupport() { }

	static EventInvitation createDefault(UUID eventId) {
		return EventInvitation.builder()
			.id(UUID.randomUUID())
			.eventId(eventId)
			.theme("ROMANCE")
			.rsvpEnabled(true)
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();
	}
}
