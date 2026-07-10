package com.memora.core.domain.param;

import java.util.UUID;

public record GetEventInvitationParam(UUID ownerId, UUID eventId) { }
