package com.memora.entrypoint.api.controller.definition;

import com.memora.entrypoint.api.dto.AdminActionRequestDto;
import com.memora.entrypoint.api.dto.AdminActionResponseDto;
import com.memora.entrypoint.api.dto.AdminAuditLogListItemDto;
import com.memora.entrypoint.api.dto.AdminDashboardResponseDto;
import com.memora.entrypoint.api.dto.AdminDeleteUserRequestDto;
import com.memora.entrypoint.api.dto.AdminEventListItemDto;
import com.memora.entrypoint.api.dto.AdminPaymentListItemDto;
import com.memora.entrypoint.api.dto.AdminRevenueSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminUserDetailsResponseDto;
import com.memora.entrypoint.api.dto.AdminUserListItemDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "admin", description = "Internal admin portal operations")
@Validated
@SecurityRequirement(name = "bearerAuth")
public interface AdminControllerApi {

	@GetMapping("/api/admin/dashboard")
	@Operation(summary = "Get admin dashboard metrics")
	ResponseEntity<AdminDashboardResponseDto> dashboard();

	@GetMapping("/api/admin/users")
	@Operation(summary = "List users for admin")
	ResponseEntity<PageResponseDto<AdminUserListItemDto>> users(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "20") int size,
		@RequestParam(required = false) String search,
		@RequestParam(required = false) String status,
		@RequestParam(required = false) String role,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate createdFrom,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate createdTo
	);

	@GetMapping("/api/admin/users/{userId}")
	@Operation(summary = "Get user details for admin")
	ResponseEntity<AdminUserDetailsResponseDto> userDetails(@PathVariable UUID userId, Authentication authentication, jakarta.servlet.http.HttpServletRequest request);

	@DeleteMapping("/api/admin/users/{userId}")
	@Operation(summary = "Soft delete user account")
	@ApiResponse(responseCode = "200", description = "User deleted")
	ResponseEntity<AdminActionResponseDto> deleteUser(
		@PathVariable UUID userId,
		@Valid @RequestBody AdminDeleteUserRequestDto request,
		Authentication authentication,
		jakarta.servlet.http.HttpServletRequest httpServletRequest
	);

	@PatchMapping("/api/admin/users/{userId}/suspend")
	@Operation(summary = "Suspend user account")
	ResponseEntity<AdminActionResponseDto> suspendUser(
		@PathVariable UUID userId,
		@Valid @RequestBody AdminActionRequestDto request,
		Authentication authentication,
		jakarta.servlet.http.HttpServletRequest httpServletRequest
	);

	@PatchMapping("/api/admin/users/{userId}/restore")
	@Operation(summary = "Restore suspended user account")
	ResponseEntity<AdminActionResponseDto> restoreUser(
		@PathVariable UUID userId,
		@Valid @RequestBody AdminActionRequestDto request,
		Authentication authentication,
		jakarta.servlet.http.HttpServletRequest httpServletRequest
	);

	@GetMapping("/api/admin/payments")
	@Operation(summary = "List payments for admin")
	ResponseEntity<PageResponseDto<AdminPaymentListItemDto>> payments(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "20") int size,
		@RequestParam(required = false) String status,
		@RequestParam(required = false) String planCode,
		@RequestParam(required = false) String provider,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate dateFrom,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate dateTo,
		@RequestParam(required = false) String userEmail
	);

	@GetMapping("/api/admin/revenue/summary")
	@Operation(summary = "Get revenue summary for admin")
	ResponseEntity<AdminRevenueSummaryResponseDto> revenueSummary();

	@GetMapping("/api/admin/events")
	@Operation(summary = "List events for admin")
	ResponseEntity<PageResponseDto<AdminEventListItemDto>> events(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "20") int size,
		@RequestParam(required = false) String status,
		@RequestParam(required = false) String planCode,
		@RequestParam(required = false) String ownerEmail,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate dateFrom,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate dateTo
	);

	@GetMapping("/api/admin/audit-logs")
	@Operation(summary = "List admin audit logs")
	ResponseEntity<PageResponseDto<AdminAuditLogListItemDto>> auditLogs(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "20") int size,
		@RequestParam(required = false) UUID adminUserId,
		@RequestParam(required = false) String action,
		@RequestParam(required = false) String targetType,
		@RequestParam(required = false) UUID targetId,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate dateFrom,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate dateTo
	);
}
