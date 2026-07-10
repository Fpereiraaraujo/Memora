package com.memora.dataprovider.database.repository;

public record EventGuestRsvpSummaryProjection(
    Long totalGuests,
    Long pendingGuests,
    Long confirmedGuests,
    Long declinedGuests,
    Long confirmedPeople
) { }
