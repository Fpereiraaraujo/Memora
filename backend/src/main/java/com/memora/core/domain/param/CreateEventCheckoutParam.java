package com.memora.core.domain.param;

import com.memora.core.domain.model.EventPlanCode;
import java.util.UUID;

public record CreateEventCheckoutParam(
	UUID ownerId,
	UUID eventId,
	EventPlanCode planCode,
	String couponCode,
	String referralCode
) {
}
