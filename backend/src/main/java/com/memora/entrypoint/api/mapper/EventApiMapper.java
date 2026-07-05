package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.Event;
import com.memora.entrypoint.api.dto.EventCreateResponseDto;
import com.memora.entrypoint.api.dto.EventResponseDto;
import com.memora.entrypoint.api.dto.PublicEventResponseDto;

public final class EventApiMapper {

	private EventApiMapper() {
	}

	public static EventCreateResponseDto toCreateResponse(Event event) {
		return new EventCreateResponseDto(
			event.getId(),
			event.getType(),
			event.getTitle(),
			event.getSlug(),
			event.getEventDate(),
			event.getLocation(),
			event.getStatus(),
			event.getPlanCode(),
			event.getPhotoLimit(),
			event.getStorageExpiresAt(),
			event.getPaidAt()
		);
	}

	public static EventResponseDto toResponse(Event event) {
		return new EventResponseDto(
			event.getId(),
			event.getType(),
			event.getTitle(),
			event.getSlug(),
			event.getEventDate(),
			event.getLocation(),
			event.getStatus(),
			event.getPlanCode(),
			event.getPhotoLimit(),
			event.getStorageExpiresAt(),
			event.getPaidAt()
		);
	}

	public static PublicEventResponseDto toPublicResponse(Event event) {
		return new PublicEventResponseDto(
			event.getId(),
			event.getType(),
			event.getTitle(),
			event.getSlug(),
			event.getEventDate(),
			event.getLocation(),
			event.getStatus(),
			event.getPlanCode(),
			event.getPhotoLimit(),
			event.getStorageExpiresAt(),
			event.getPaidAt()
		);
	}
}
