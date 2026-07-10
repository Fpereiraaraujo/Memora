package com.memora.entrypoint.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record EventInvitationResponseDto(String theme, boolean rsvpEnabled, LocalDate rsvpDeadline, LocalTime ceremonyTime, LocalTime receptionTime, String dressCode, String registryUrl, LocalDateTime publishedAt, LocalDateTime updatedAt) { }
