package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventPlanCode;
import jakarta.validation.constraints.NotNull;

public record EventCheckoutRequestDto(
	@NotNull
	EventPlanCode planCode,
	String couponCode,
	String referralCode
) {
}
