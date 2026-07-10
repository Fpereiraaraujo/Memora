package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.GuestRsvpStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record EventGuestResponseDto(UUID id, String invitationToken, String name, String phone, String email, String guestGroup, int maxPlusOnes, GuestRsvpStatus rsvpStatus, int plusOnes, String companionName, String mealChoice, String dietaryRestrictions, String guestMessage, LocalDateTime respondedAt, LocalDateTime createdAt) { }
