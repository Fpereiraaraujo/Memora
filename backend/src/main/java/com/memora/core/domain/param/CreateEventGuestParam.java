package com.memora.core.domain.param;

import java.util.UUID;

public record CreateEventGuestParam(UUID ownerId, UUID eventId, String name, String phone, String email, String guestGroup, int maxPlusOnes) { }
