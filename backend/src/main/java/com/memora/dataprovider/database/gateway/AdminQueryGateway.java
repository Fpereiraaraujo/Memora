package com.memora.dataprovider.database.gateway;

import com.memora.entrypoint.api.dto.AdminAuditLogListItemDto;
import com.memora.entrypoint.api.dto.AdminDashboardResponseDto;
import com.memora.entrypoint.api.dto.AdminEventListItemDto;
import com.memora.entrypoint.api.dto.AdminPaymentListItemDto;
import com.memora.entrypoint.api.dto.AdminRevenueSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminUserDetailsResponseDto;
import com.memora.entrypoint.api.dto.AdminUserEventDto;
import com.memora.entrypoint.api.dto.AdminUserListItemDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AdminQueryGateway {

	AdminDashboardResponseDto getDashboard();

	PageResponseDto<AdminUserListItemDto> listUsers(
		int page,
		int size,
		String search,
		String status,
		String role,
		LocalDate createdFrom,
		LocalDate createdTo
	);

	List<AdminUserEventDto> listUserEvents(UUID userId);

	List<AdminPaymentListItemDto> listUserPayments(UUID userId);

	Map<String, Object> getUserSummary(UUID userId);

	PageResponseDto<AdminPaymentListItemDto> listPayments(
		int page,
		int size,
		String status,
		String planCode,
		String provider,
		LocalDate dateFrom,
		LocalDate dateTo,
		String userEmail
	);

	AdminRevenueSummaryResponseDto getRevenueSummary();

	PageResponseDto<AdminEventListItemDto> listEvents(
		int page,
		int size,
		String status,
		String planCode,
		String ownerEmail,
		LocalDate dateFrom,
		LocalDate dateTo
	);

	long countApprovedPaymentsByUserId(UUID userId);

	PageResponseDto<AdminAuditLogListItemDto> listAuditLogs(
		int page,
		int size,
		UUID adminUserId,
		String action,
		String targetType,
		UUID targetId,
		LocalDate dateFrom,
		LocalDate dateTo
	);
}
