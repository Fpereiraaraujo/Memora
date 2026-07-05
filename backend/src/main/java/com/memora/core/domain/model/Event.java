package com.memora.core.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class Event {
	UUID id;
	UUID ownerId;
	EventType type;
	String title;
	String slug;
	LocalDate eventDate;
	String location;
	EventStatus status;
	EventPlanCode planCode;
	Integer photoLimit;
	LocalDateTime storageExpiresAt;
	LocalDateTime paidAt;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
