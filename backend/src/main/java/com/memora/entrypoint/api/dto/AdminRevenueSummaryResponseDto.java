package com.memora.entrypoint.api.dto;

import java.util.List;

public record AdminRevenueSummaryResponseDto(
	long grossRevenueCents,
	long revenueThisMonthCents,
	long revenueTodayCents,
	List<AdminPlanMetricDto> revenueByPlan,
	long approvedPaymentsCount,
	long pendingPaymentsCount,
	long failedPaymentsCount
) {
}
