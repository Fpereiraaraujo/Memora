package com.memora.core.domain.model;

import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class CheckoutPricing {
	EventPlanCode planCode;
	int originalAmountCents;
	int discountAmountCents;
	int finalAmountCents;
	Integer discountPercent;
	String couponCode;
	UUID couponId;
	UUID influencerId;
	Integer commissionPercent;
	Integer commissionAmountCents;
	String message;
}
