package com.memora.core.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class EventCheckoutPreview {
	EventPlanCode planCode;
	int originalAmountCents;
	int discountAmountCents;
	int finalAmountCents;
	String couponCode;
	String referralCode;
	boolean referralApplied;
	Integer discountPercent;
	boolean couponApplied;
	String message;
}
