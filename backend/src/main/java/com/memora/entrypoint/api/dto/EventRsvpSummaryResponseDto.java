package com.memora.entrypoint.api.dto;

public record EventRsvpSummaryResponseDto(long totalGuests, long pendingGuests, long confirmedGuests, long declinedGuests, long confirmedPeople) { }
