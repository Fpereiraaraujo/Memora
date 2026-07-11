package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.CouponStatus;
import jakarta.validation.constraints.NotNull;

public record AdminCouponStatusUpdateRequestDto(
	@NotNull CouponStatus status
) {
}
