package com.memora.core.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class Plan {
	EventPlanCode code;
	String name;
	int priceCents;
	int photoLimit;
	int storageMonths;
	boolean active;
	String checkoutUrl;
}
