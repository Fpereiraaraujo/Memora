package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class EventGuest {
	UUID id;
	UUID eventId;
	String invitationToken;
	String name;
	String phone;
	String email;
	String guestGroup;
	int maxPlusOnes;
	GuestRsvpStatus rsvpStatus;
	int plusOnes;
	String companionName;
	String mealChoice;
	String dietaryRestrictions;
	String guestMessage;
	LocalDateTime respondedAt;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
