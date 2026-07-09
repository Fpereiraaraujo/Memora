package com.memora.entrypoint.api.dto;

import java.util.List;

public record AdminDashboardResponseDto(
	long totalUsers,
	long totalActiveUsers,
	long totalSuspendedUsers,
	long totalDeletedUsers,
	long totalEvents,
	long totalActiveEvents,
	long totalDraftEvents,
	long totalPhotos,
	long totalPaymentOrders,
	long totalApprovedPayments,
	long totalPendingPayments,
	long grossRevenueCents,
	List<AdminPlanMetricDto> revenueByPlan,
	List<AdminPlanMetricDto> eventsByPlan,
	long usersCreatedToday,
	long usersCreatedThisMonth,
	long paymentsApprovedThisMonth,
	long photosUploadedThisMonth
) {
}
