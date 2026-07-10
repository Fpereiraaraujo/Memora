package com.memora.core.domain.param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record UpdateEventInvitationParam(UUID ownerId, UUID eventId, String theme, boolean rsvpEnabled, LocalDate rsvpDeadline, LocalTime ceremonyTime, LocalTime receptionTime, String dressCode, String registryUrl, boolean published) { }
