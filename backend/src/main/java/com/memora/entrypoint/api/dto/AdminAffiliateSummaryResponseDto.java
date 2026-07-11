package com.memora.entrypoint.api.dto;

public record AdminAffiliateSummaryResponseDto(
	long activeInfluencers,
	long activeCoupons,
	long couponSales,
	long pendingCommissionCents
) {
}
