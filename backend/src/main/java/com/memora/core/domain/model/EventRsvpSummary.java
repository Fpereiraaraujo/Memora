package com.memora.core.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class EventRsvpSummary {
	long totalGuests;
	long pendingGuests;
	long confirmedGuests;
	long declinedGuests;
	long confirmedPeople;
}
