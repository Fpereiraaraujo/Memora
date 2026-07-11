package com.memora.entrypoint.api.controller;

import com.memora.core.service.AdminManagementService;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import com.memora.entrypoint.api.controller.definition.AdminControllerApi;
import com.memora.entrypoint.api.dto.AdminActionRequestDto;
import com.memora.entrypoint.api.dto.AdminActionResponseDto;
import com.memora.entrypoint.api.dto.AdminAuditLogListItemDto;
import com.memora.entrypoint.api.dto.AdminAffiliateSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminCouponListItemDto;
import com.memora.entrypoint.api.dto.AdminCouponStatusUpdateRequestDto;
import com.memora.entrypoint.api.dto.AdminCouponUpsertRequestDto;
import com.memora.entrypoint.api.dto.AdminDashboardResponseDto;
import com.memora.entrypoint.api.dto.AdminDeleteUserRequestDto;
import com.memora.entrypoint.api.dto.AdminGrantPlanRequestDto;
import com.memora.entrypoint.api.dto.AdminEventListItemDto;
import com.memora.entrypoint.api.dto.AdminInfluencerListItemDto;
import com.memora.entrypoint.api.dto.AdminInfluencerUpsertRequestDto;
import com.memora.entrypoint.api.dto.AdminPaymentListItemDto;
import com.memora.entrypoint.api.dto.AdminRevenueSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminUserDetailsResponseDto;
import com.memora.entrypoint.api.dto.AdminUserListItemDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import java.util.List;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController implements AdminControllerApi {

	private final AdminManagementService adminManagementService;

	public AdminController(AdminManagementService adminManagementService) {
		this.adminManagementService = adminManagementService;
	}

	@Override
	public ResponseEntity<AdminDashboardResponseDto> dashboard() {
		return ResponseEntity.ok(adminManagementService.getDashboard());
	}

	@Override
	public ResponseEntity<PageResponseDto<AdminUserListItemDto>> users(int page, int size, String search, String status, String role, LocalDate createdFrom, LocalDate createdTo) {
		return ResponseEntity.ok(adminManagementService.listUsers(page, size, search, status, role, createdFrom, createdTo));
	}

	@Override
	public ResponseEntity<AdminUserDetailsResponseDto> userDetails(UUID userId, Authentication authentication, jakarta.servlet.http.HttpServletRequest request) {
		return ResponseEntity.ok(adminManagementService.getUserDetails(userId, resolvePrincipal(authentication), request.getRemoteAddr(), request.getHeader("User-Agent")));
	}

	@Override
	public ResponseEntity<AdminActionResponseDto> deleteUser(UUID userId, AdminDeleteUserRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.deleteUser(
			userId,
			request.confirmationEmail().trim().toLowerCase(),
			request.reason().trim(),
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<AdminActionResponseDto> suspendUser(UUID userId, AdminActionRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.suspendUser(
			userId,
			request.reason().trim(),
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<AdminActionResponseDto> restoreUser(UUID userId, AdminActionRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.restoreUser(
			userId,
			request.reason().trim(),
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<AdminActionResponseDto> grantPlan(UUID userId, AdminGrantPlanRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.grantPlan(
			userId,
			request.eventId(),
			request.planCode(),
			request.reason().trim(),
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<PageResponseDto<AdminPaymentListItemDto>> payments(int page, int size, String status, String planCode, String provider, LocalDate dateFrom, LocalDate dateTo, String userEmail) {
		return ResponseEntity.ok(adminManagementService.listPayments(page, size, status, planCode, provider, dateFrom, dateTo, userEmail));
	}

	@Override
	public ResponseEntity<AdminRevenueSummaryResponseDto> revenueSummary() {
		return ResponseEntity.ok(adminManagementService.getRevenueSummary());
	}

	@Override
	public ResponseEntity<PageResponseDto<AdminEventListItemDto>> events(int page, int size, String status, String planCode, String ownerEmail, LocalDate dateFrom, LocalDate dateTo) {
		return ResponseEntity.ok(adminManagementService.listEvents(page, size, status, planCode, ownerEmail, dateFrom, dateTo));
	}

	@Override
	public ResponseEntity<PageResponseDto<AdminAuditLogListItemDto>> auditLogs(int page, int size, UUID adminUserId, String action, String targetType, UUID targetId, LocalDate dateFrom, LocalDate dateTo) {
		return ResponseEntity.ok(adminManagementService.listAuditLogs(page, size, adminUserId, action, targetType, targetId, dateFrom, dateTo));
	}

	@Override
	public ResponseEntity<AdminAffiliateSummaryResponseDto> affiliateSummary() {
		return ResponseEntity.ok(adminManagementService.getAffiliateSummary());
	}

	@Override
	public ResponseEntity<List<AdminInfluencerListItemDto>> influencers() {
		return ResponseEntity.ok(adminManagementService.listInfluencers());
	}

	@Override
	public ResponseEntity<AdminInfluencerListItemDto> createInfluencer(AdminInfluencerUpsertRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.createInfluencer(
			request,
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<AdminInfluencerListItemDto> updateInfluencer(UUID influencerId, AdminInfluencerUpsertRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.updateInfluencer(
			influencerId,
			request,
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<List<AdminCouponListItemDto>> coupons() {
		return ResponseEntity.ok(adminManagementService.listCoupons());
	}

	@Override
	public ResponseEntity<AdminCouponListItemDto> createCoupon(AdminCouponUpsertRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.createCoupon(
			request,
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<AdminCouponListItemDto> updateCoupon(UUID couponId, AdminCouponUpsertRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.updateCoupon(
			couponId,
			request,
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	@Override
	public ResponseEntity<AdminCouponListItemDto> updateCouponStatus(UUID couponId, AdminCouponStatusUpdateRequestDto request, Authentication authentication, jakarta.servlet.http.HttpServletRequest httpServletRequest) {
		return ResponseEntity.ok(adminManagementService.updateCouponStatus(
			couponId,
			request.status(),
			resolvePrincipal(authentication),
			httpServletRequest.getRemoteAddr(),
			httpServletRequest.getHeader("User-Agent")
		));
	}

	private AuthenticatedUserPrincipal resolvePrincipal(Authentication authentication) {
		if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUserPrincipal principal)) {
			throw new SecurityException("Acesso negado.");
		}
		return principal;
	}
}
