package com.memora.entrypoint.api.dto;

import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalTime;

public record EventInvitationUpdateRequestDto(
	@Pattern(regexp = "ROMANCE|GARDEN|MODERN") String theme,
	boolean rsvpEnabled,
	LocalDate rsvpDeadline,
	LocalTime ceremonyTime,
	LocalTime receptionTime,
	String dressCode,
	String registryUrl,
	boolean published
) { }
