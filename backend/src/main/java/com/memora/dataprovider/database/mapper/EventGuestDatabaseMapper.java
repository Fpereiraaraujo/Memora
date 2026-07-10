package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.EventGuest;
import com.memora.dataprovider.database.entity.EventGuestJpaEntity;

public final class EventGuestDatabaseMapper {
	private EventGuestDatabaseMapper() { }
	public static EventGuest toDomain(EventGuestJpaEntity entity) {
		return EventGuest.builder().id(entity.getId()).eventId(entity.getEventId()).invitationToken(entity.getInvitationToken()).name(entity.getName()).phone(entity.getPhone()).email(entity.getEmail()).guestGroup(entity.getGuestGroup()).maxPlusOnes(entity.getMaxPlusOnes()).rsvpStatus(entity.getRsvpStatus()).plusOnes(entity.getPlusOnes()).companionName(entity.getCompanionName()).mealChoice(entity.getMealChoice()).dietaryRestrictions(entity.getDietaryRestrictions()).guestMessage(entity.getGuestMessage()).respondedAt(entity.getRespondedAt()).createdAt(entity.getCreatedAt()).updatedAt(entity.getUpdatedAt()).build();
	}
	public static EventGuestJpaEntity toEntity(EventGuest value) {
		return EventGuestJpaEntity.builder().id(value.getId()).eventId(value.getEventId()).invitationToken(value.getInvitationToken()).name(value.getName()).phone(value.getPhone()).email(value.getEmail()).guestGroup(value.getGuestGroup()).maxPlusOnes(value.getMaxPlusOnes()).rsvpStatus(value.getRsvpStatus()).plusOnes(value.getPlusOnes()).companionName(value.getCompanionName()).mealChoice(value.getMealChoice()).dietaryRestrictions(value.getDietaryRestrictions()).guestMessage(value.getGuestMessage()).respondedAt(value.getRespondedAt()).createdAt(value.getCreatedAt()).updatedAt(value.getUpdatedAt()).build();
	}
}
