package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.CouponStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminCouponUpsertRequestDto(
	@NotBlank String code,
	UUID influencerId,
	@NotNull @Min(1) @Max(50) Integer discountPercent,
	@Min(0) @Max(50) Integer commissionPercent,
	LocalDateTime startsAt,
	LocalDateTime expiresAt,
	@Min(0) Integer maxUses,
	@NotNull CouponStatus status
) {
}
