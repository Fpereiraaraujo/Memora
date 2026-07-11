package com.memora.entrypoint.api.dto;

import java.util.UUID;

public record AdminAffiliateMetricsSummaryResponseDto(
	long revenueViaCouponsCents,
	long totalSalesViaCoupons,
	long pendingCommissionCents,
	UUID topInfluencerId,
	String topInfluencerName,
	long topInfluencerSales
) {
}
