package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.InfluencerStatus;
import java.util.List;
import java.util.UUID;

public record AdminInfluencerPerformanceResponseDto(
	UUID id,
	String name,
	String instagramHandle,
	String email,
	String pixKey,
	InfluencerStatus status,
	long approvedSales,
	long netRevenueCents,
	long pendingCommissionCents,
	long paidCommissionCents,
	List<AdminCouponListItemDto> coupons,
	List<AdminAffiliateSaleListItemDto> sales,
	List<AdminReferralCommissionListItemDto> commissions
) {
}
