package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.Event;
import com.memora.dataprovider.database.entity.EventJpaEntity;

public final class EventDatabaseMapper {

	private EventDatabaseMapper() {
	}

	public static EventJpaEntity toEntity(Event event) {
		return EventJpaEntity.builder()
			.id(event.getId())
			.ownerId(event.getOwnerId())
			.type(event.getType())
			.title(event.getTitle())
			.slug(event.getSlug())
			.eventDate(event.getEventDate())
			.location(event.getLocation())
			.status(event.getStatus())
			.planCode(event.getPlanCode())
			.photoLimit(event.getPhotoLimit())
			.storageExpiresAt(event.getStorageExpiresAt())
			.paidAt(event.getPaidAt())
			.createdAt(event.getCreatedAt())
			.updatedAt(event.getUpdatedAt())
			.build();
	}

	public static Event toDomain(EventJpaEntity entity) {
		return Event.builder()
			.id(entity.getId())
			.ownerId(entity.getOwnerId())
			.type(entity.getType())
			.title(entity.getTitle())
			.slug(entity.getSlug())
			.eventDate(entity.getEventDate())
			.location(entity.getLocation())
			.status(entity.getStatus())
			.planCode(entity.getPlanCode())
			.photoLimit(entity.getPhotoLimit())
			.storageExpiresAt(entity.getStorageExpiresAt())
			.paidAt(entity.getPaidAt())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}
}
