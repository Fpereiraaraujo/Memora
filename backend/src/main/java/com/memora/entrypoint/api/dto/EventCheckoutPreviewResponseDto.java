package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventPlanCode;

public record EventCheckoutPreviewResponseDto(
	EventPlanCode planCode,
	int originalAmountCents,
	int discountAmountCents,
	int finalAmountCents,
	String couponCode,
	Integer discountPercent,
	boolean couponApplied,
	String message
) {
}
