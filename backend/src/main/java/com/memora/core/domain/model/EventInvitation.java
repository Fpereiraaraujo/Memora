package com.memora.core.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class EventInvitation {
	UUID id;
	UUID eventId;
	String theme;
	boolean rsvpEnabled;
	LocalDate rsvpDeadline;
	LocalTime ceremonyTime;
	LocalTime receptionTime;
	String dressCode;
	String registryUrl;
	LocalDateTime publishedAt;
	LocalDateTime updatedAt;
}
