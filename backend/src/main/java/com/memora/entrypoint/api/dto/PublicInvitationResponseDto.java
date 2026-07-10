package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.GuestRsvpStatus;
import java.time.LocalDate;
import java.time.LocalTime;

public record PublicInvitationResponseDto(String eventTitle, LocalDate eventDate, String location, String welcomeMessage, String coverImageUrl, String theme, LocalDate rsvpDeadline, LocalTime ceremonyTime, LocalTime receptionTime, String dressCode, String registryUrl, boolean rsvpEnabled, String guestName, int maxPlusOnes, GuestRsvpStatus rsvpStatus, int plusOnes, String companionName, String mealChoice, String dietaryRestrictions, String guestMessage) { }
