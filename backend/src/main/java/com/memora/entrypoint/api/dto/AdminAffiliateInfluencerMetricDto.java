package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.InfluencerStatus;
import java.util.UUID;

public record AdminAffiliateInfluencerMetricDto(
	UUID influencerId,
	String name,
	String instagramHandle,
	String primaryCouponCode,
	Long clicks,
	long approvedSales,
	long netRevenueCents,
	long pendingCommissionCents,
	long paidCommissionCents,
	InfluencerStatus status
) {
}
