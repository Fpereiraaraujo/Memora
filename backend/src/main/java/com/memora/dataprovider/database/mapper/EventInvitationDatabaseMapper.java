package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.EventInvitation;
import com.memora.dataprovider.database.entity.EventInvitationJpaEntity;

public final class EventInvitationDatabaseMapper {
	private EventInvitationDatabaseMapper() { }
	public static EventInvitation toDomain(EventInvitationJpaEntity entity) {
		return EventInvitation.builder().id(entity.getId()).eventId(entity.getEventId()).theme(entity.getTheme()).rsvpEnabled(entity.isRsvpEnabled()).rsvpDeadline(entity.getRsvpDeadline()).ceremonyTime(entity.getCeremonyTime()).receptionTime(entity.getReceptionTime()).dressCode(entity.getDressCode()).registryUrl(entity.getRegistryUrl()).publishedAt(entity.getPublishedAt()).updatedAt(entity.getUpdatedAt()).build();
	}
	public static EventInvitationJpaEntity toEntity(EventInvitation value) {
		return EventInvitationJpaEntity.builder().id(value.getId()).eventId(value.getEventId()).theme(value.getTheme()).rsvpEnabled(value.isRsvpEnabled()).rsvpDeadline(value.getRsvpDeadline()).ceremonyTime(value.getCeremonyTime()).receptionTime(value.getReceptionTime()).dressCode(value.getDressCode()).registryUrl(value.getRegistryUrl()).publishedAt(value.getPublishedAt()).updatedAt(value.getUpdatedAt()).build();
	}
}
