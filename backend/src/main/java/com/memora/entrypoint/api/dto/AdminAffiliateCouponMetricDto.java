package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.CouponStatus;
import java.util.UUID;

public record AdminAffiliateCouponMetricDto(
	UUID couponId,
	String code,
	String influencerName,
	int currentUses,
	long approvedSales,
	long discountTotalCents,
	long netRevenueCents,
	long commissionGeneratedCents,
	CouponStatus status
) {
}
