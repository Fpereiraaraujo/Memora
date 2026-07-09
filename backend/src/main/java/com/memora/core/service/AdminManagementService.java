package com.memora.core.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.dataprovider.database.entity.AdminAuditLogEntity;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.UserEntity;
import com.memora.dataprovider.database.repository.AdminAuditLogRepository;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import com.memora.entrypoint.api.dto.AdminActionResponseDto;
import com.memora.entrypoint.api.dto.AdminAuditLogListItemDto;
import com.memora.entrypoint.api.dto.AdminDashboardResponseDto;
import com.memora.entrypoint.api.dto.AdminEventListItemDto;
import com.memora.entrypoint.api.dto.AdminPaymentListItemDto;
import com.memora.entrypoint.api.dto.AdminPlanMetricDto;
import com.memora.entrypoint.api.dto.AdminRevenueSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminUserDetailsResponseDto;
import com.memora.entrypoint.api.dto.AdminUserEventDto;
import com.memora.entrypoint.api.dto.AdminUserListItemDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import com.memora.core.usecase.imp.EventPublicPageCustomizationSupport;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminManagementService {

	private final NamedParameterJdbcTemplate jdbcTemplate;
	private final UserRepository userRepository;
	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final AdminAuditLogRepository adminAuditLogRepository;
	private final FileStorageService fileStorageService;
	private final ObjectMapper objectMapper;

	public AdminManagementService(
		NamedParameterJdbcTemplate jdbcTemplate,
		UserRepository userRepository,
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		EventCustomizationRepository eventCustomizationRepository,
		AdminAuditLogRepository adminAuditLogRepository,
		FileStorageService fileStorageService,
		ObjectMapper objectMapper
	) {
		this.jdbcTemplate = jdbcTemplate;
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.adminAuditLogRepository = adminAuditLogRepository;
		this.fileStorageService = fileStorageService;
		this.objectMapper = objectMapper;
	}

	public AdminDashboardResponseDto getDashboard() {
		Map<String, Object> metrics = jdbcTemplate.queryForMap("""
			select
				(select count(*) from users) as total_users,
				(select count(*) from users where status = 'ACTIVE') as total_active_users,
				(select count(*) from users where status = 'SUSPENDED') as total_suspended_users,
				(select count(*) from users where status = 'DELETED') as total_deleted_users,
				(select count(*) from events) as total_events,
				(select count(*) from events where status = 'ACTIVE') as total_active_events,
				(select count(*) from events where status = 'DRAFT') as total_draft_events,
				(select count(*) from photos where object_key is not null) as total_photos,
				(select count(*) from payment_orders) as total_payment_orders,
				(select count(*) from payment_orders where status = 'APPROVED') as total_approved_payments,
				(select count(*) from payment_orders where status = 'PENDING') as total_pending_payments,
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED') as gross_revenue_cents,
				(select count(*) from users where created_at >= :todayStart) as users_created_today,
				(select count(*) from users where created_at >= :monthStart) as users_created_this_month,
				(select count(*) from payment_orders where status = 'APPROVED' and paid_at >= :monthStart) as payments_approved_this_month,
				(select count(*) from photos where object_key is not null and created_at >= :monthStart) as photos_uploaded_this_month
			""", new MapSqlParameterSource()
			.addValue("todayStart", LocalDate.now(ZoneOffset.UTC).atStartOfDay())
			.addValue("monthStart", LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1).atStartOfDay()));

		List<AdminPlanMetricDto> revenueByPlan = jdbcTemplate.query("""
			select plan_code, coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) as total
			from payment_orders
			where status = 'APPROVED'
			group by plan_code
			order by total desc
			""", (rs, rowNum) -> new AdminPlanMetricDto(rs.getString("plan_code"), rs.getLong("total")));

		List<AdminPlanMetricDto> eventsByPlan = jdbcTemplate.query("""
			select coalesce(plan_code, 'FREE') as plan_code, count(*) as total
			from events
			group by coalesce(plan_code, 'FREE')
			order by total desc
			""", (rs, rowNum) -> new AdminPlanMetricDto(rs.getString("plan_code"), rs.getLong("total")));

		return new AdminDashboardResponseDto(
			asLong(metrics.get("total_users")),
			asLong(metrics.get("total_active_users")),
			asLong(metrics.get("total_suspended_users")),
			asLong(metrics.get("total_deleted_users")),
			asLong(metrics.get("total_events")),
			asLong(metrics.get("total_active_events")),
			asLong(metrics.get("total_draft_events")),
			asLong(metrics.get("total_photos")),
			asLong(metrics.get("total_payment_orders")),
			asLong(metrics.get("total_approved_payments")),
			asLong(metrics.get("total_pending_payments")),
			asLong(metrics.get("gross_revenue_cents")),
			revenueByPlan,
			eventsByPlan,
			asLong(metrics.get("users_created_today")),
			asLong(metrics.get("users_created_this_month")),
			asLong(metrics.get("payments_approved_this_month")),
			asLong(metrics.get("photos_uploaded_this_month"))
		);
	}

	public PageResponseDto<AdminUserListItemDto> listUsers(
		int page,
		int size,
		String search,
		String status,
		String role,
		LocalDate createdFrom,
		LocalDate createdTo
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);

		String where = buildUserFilters(search, status, role, createdFrom, createdTo, params);
		long total = jdbcTemplate.queryForObject("select count(*) from users u where 1=1 " + where, params, Long.class);

		List<AdminUserListItemDto> content = jdbcTemplate.query("""
			select
				u.id,
				u.name,
				u.email,
				u.role,
				u.status,
				u.created_at,
				u.last_login_at,
				(select count(*) from events e where e.owner_id = u.id) as total_events,
				(select e.plan_code from events e where e.owner_id = u.id and e.plan_code is not null order by e.paid_at desc nulls last, e.created_at desc limit 1) as active_plan_code,
				(select count(*) from photos p join events e2 on e2.id = p.event_id where e2.owner_id = u.id and p.object_key is not null) as total_photos,
				(select count(*) from payment_orders po where po.user_id = u.id and po.status = 'APPROVED') as total_approved_payments,
				(select coalesce(sum(coalesce(po.paid_amount_cents, po.amount_cents)), 0) from payment_orders po where po.user_id = u.id and po.status = 'APPROVED') as total_revenue_cents
			from users u
			where 1=1
			""" + where + """
			order by u.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminUserListItemDto(
			rs.getObject("id", UUID.class),
			rs.getString("name"),
			rs.getString("email"),
			UserRole.valueOf(rs.getString("role")),
			UserStatus.valueOf(rs.getString("status")),
			asLocalDateTime(rs.getObject("created_at")),
			asLocalDateTime(rs.getObject("last_login_at")),
			rs.getLong("total_events"),
			rs.getString("active_plan_code"),
			rs.getLong("total_photos"),
			rs.getLong("total_approved_payments"),
			rs.getLong("total_revenue_cents")
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	public AdminUserDetailsResponseDto getUserDetails(UUID userId, AuthenticatedUserPrincipal admin, String ipAddress, String userAgent) {
		UserEntity user = userRepository.findById(userId)
			.orElseThrow(() -> new NoSuchElementException("Usuario nao encontrado."));

		List<AdminUserEventDto> events = jdbcTemplate.query("""
			select
				e.id as event_id,
				e.title,
				e.slug,
				e.type,
				e.status,
				e.plan_code,
				e.photo_limit,
				e.event_date,
				e.location,
				e.paid_at,
				e.created_at,
				(select count(*) from photos p where p.event_id = e.id and p.object_key is not null) as total_photos
			from events e
			where e.owner_id = :userId
			order by e.created_at desc
			""", new MapSqlParameterSource("userId", userId), (rs, rowNum) -> new AdminUserEventDto(
			rs.getObject("event_id", UUID.class),
			rs.getString("title"),
			rs.getString("slug"),
			Enum.valueOf(com.memora.core.domain.model.EventType.class, rs.getString("type")),
			EventStatus.valueOf(rs.getString("status")),
			rs.getString("plan_code"),
			asInteger(rs.getObject("photo_limit")),
			rs.getDate("event_date") == null ? null : rs.getDate("event_date").toLocalDate(),
			rs.getString("location"),
			rs.getLong("total_photos"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));

		List<AdminPaymentListItemDto> payments = jdbcTemplate.query("""
			select
				po.id as payment_order_id,
				u.email as user_email,
				u.name as user_name,
				e.title as event_title,
				po.plan_code,
				po.provider,
				po.status,
				po.amount_cents,
				po.paid_amount_cents,
				po.paid_at,
				po.created_at
			from payment_orders po
			join users u on u.id = po.user_id
			join events e on e.id = po.event_id
			where po.user_id = :userId
			order by po.created_at desc
			""", new MapSqlParameterSource("userId", userId), (rs, rowNum) -> new AdminPaymentListItemDto(
			rs.getObject("payment_order_id", UUID.class),
			rs.getString("user_email"),
			rs.getString("user_name"),
			rs.getString("event_title"),
			rs.getString("plan_code"),
			rs.getString("provider"),
			rs.getString("status"),
			rs.getInt("amount_cents"),
			(Integer) rs.getObject("paid_amount_cents"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));

		Map<String, Object> summary = jdbcTemplate.queryForMap("""
			select
				(select count(*) from events e where e.owner_id = :userId) as total_events,
				(select count(*) from photos p join events e2 on e2.id = p.event_id where e2.owner_id = :userId and p.object_key is not null) as total_photos,
				(select e.plan_code from events e where e.owner_id = :userId and e.plan_code is not null order by e.paid_at desc nulls last, e.created_at desc limit 1) as current_plan_code,
				(select count(*) from payment_orders po where po.user_id = :userId and po.status = 'APPROVED') as total_approved_payments,
				(select coalesce(sum(coalesce(po.paid_amount_cents, po.amount_cents)), 0) from payment_orders po where po.user_id = :userId and po.status = 'APPROVED') as total_revenue_cents
			""", new MapSqlParameterSource("userId", userId));

		logAudit(admin, "VIEW_USER_DETAILS", "USER", user.getId(), user.getEmail(), null, Map.of("userId", userId), ipAddress, userAgent);

		return new AdminUserDetailsResponseDto(
			user.getId(),
			user.getName(),
			user.getEmail(),
			user.getRole(),
			user.getStatus(),
			user.getCreatedAt(),
			user.getLastLoginAt(),
			user.getDeletedAt(),
			asLong(summary.get("total_events")),
			asLong(summary.get("total_photos")),
			(String) summary.get("current_plan_code"),
			asLong(summary.get("total_approved_payments")),
			asLong(summary.get("total_revenue_cents")),
			events,
			payments
		);
	}

	public PageResponseDto<AdminPaymentListItemDto> listPayments(
		int page,
		int size,
		String status,
		String planCode,
		String provider,
		LocalDate dateFrom,
		LocalDate dateTo,
		String userEmail
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);
		String where = buildPaymentFilters(status, planCode, provider, dateFrom, dateTo, userEmail, params);
		long total = jdbcTemplate.queryForObject("""
			select count(*)
			from payment_orders po
			join users u on u.id = po.user_id
			join events e on e.id = po.event_id
			where 1=1
			""" + where, params, Long.class);

		List<AdminPaymentListItemDto> content = jdbcTemplate.query("""
			select
				po.id as payment_order_id,
				u.email as user_email,
				u.name as user_name,
				e.title as event_title,
				po.plan_code,
				po.provider,
				po.status,
				po.amount_cents,
				po.paid_amount_cents,
				po.paid_at,
				po.created_at
			from payment_orders po
			join users u on u.id = po.user_id
			join events e on e.id = po.event_id
			where 1=1
			""" + where + """
			order by po.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminPaymentListItemDto(
			rs.getObject("payment_order_id", UUID.class),
			rs.getString("user_email"),
			rs.getString("user_name"),
			rs.getString("event_title"),
			rs.getString("plan_code"),
			rs.getString("provider"),
			rs.getString("status"),
			rs.getInt("amount_cents"),
			(Integer) rs.getObject("paid_amount_cents"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	public AdminRevenueSummaryResponseDto getRevenueSummary() {
		Map<String, Object> summary = jdbcTemplate.queryForMap("""
			select
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED') as gross_revenue_cents,
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED' and paid_at >= :monthStart) as revenue_this_month_cents,
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED' and paid_at >= :todayStart) as revenue_today_cents,
				(select count(*) from payment_orders where status = 'APPROVED') as approved_payments_count,
				(select count(*) from payment_orders where status = 'PENDING') as pending_payments_count,
				(select count(*) from payment_orders where status in ('FAILED', 'REJECTED', 'CANCELLED', 'EXPIRED')) as failed_payments_count
			""", new MapSqlParameterSource()
			.addValue("todayStart", LocalDate.now(ZoneOffset.UTC).atStartOfDay())
			.addValue("monthStart", LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1).atStartOfDay()));

		List<AdminPlanMetricDto> revenueByPlan = jdbcTemplate.query("""
			select plan_code, coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) as total
			from payment_orders
			where status = 'APPROVED'
			group by plan_code
			order by total desc
			""", (rs, rowNum) -> new AdminPlanMetricDto(rs.getString("plan_code"), rs.getLong("total")));

		return new AdminRevenueSummaryResponseDto(
			asLong(summary.get("gross_revenue_cents")),
			asLong(summary.get("revenue_this_month_cents")),
			asLong(summary.get("revenue_today_cents")),
			revenueByPlan,
			asLong(summary.get("approved_payments_count")),
			asLong(summary.get("pending_payments_count")),
			asLong(summary.get("failed_payments_count"))
		);
	}

	public PageResponseDto<AdminEventListItemDto> listEvents(
		int page,
		int size,
		String status,
		String planCode,
		String ownerEmail,
		LocalDate dateFrom,
		LocalDate dateTo
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);
		String where = buildEventFilters(status, planCode, ownerEmail, dateFrom, dateTo, params);
		long total = jdbcTemplate.queryForObject("""
			select count(*)
			from events e
			join users u on u.id = e.owner_id
			where 1=1
			""" + where, params, Long.class);

		List<AdminEventListItemDto> content = jdbcTemplate.query("""
			select
				e.id as event_id,
				e.title,
				e.slug,
				u.name as owner_name,
				u.email as owner_email,
				e.status,
				e.plan_code,
				e.photo_limit,
				e.paid_at,
				e.created_at,
				(select count(*) from photos p where p.event_id = e.id and p.object_key is not null) as total_photos
			from events e
			join users u on u.id = e.owner_id
			where 1=1
			""" + where + """
			order by e.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminEventListItemDto(
			rs.getObject("event_id", UUID.class),
			rs.getString("title"),
			rs.getString("slug"),
			rs.getString("owner_name"),
			rs.getString("owner_email"),
			rs.getString("status"),
			rs.getString("plan_code"),
			asInteger(rs.getObject("photo_limit")),
			rs.getLong("total_photos"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	@Transactional
	public AdminActionResponseDto deleteUser(
		UUID userId,
		String confirmationEmail,
		String reason,
		AuthenticatedUserPrincipal admin,
		String ipAddress,
		String userAgent
	) {
		UserEntity adminUser = findAdminUser(admin.userId());
		UserEntity targetUser = userRepository.findById(userId)
			.orElseThrow(() -> new NoSuchElementException("Usuario nao encontrado."));

		if (adminUser.getId().equals(targetUser.getId())) {
			throw new IllegalArgumentException("Voce nao pode excluir sua propria conta.");
		}
		if (targetUser.getRole() == UserRole.ADMIN) {
			throw new IllegalArgumentException("Nao e permitido excluir outra conta ADMIN.");
		}
		if (!targetUser.getEmail().equals(confirmationEmail)) {
			throw new IllegalArgumentException("Digite o email correto para confirmar a exclusao.");
		}
		if (reason == null || reason.isBlank()) {
			throw new IllegalArgumentException("Informe o motivo da acao.");
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		List<EventJpaEntity> events = eventRepository.findAllByOwnerIdOrderByCreatedAtDesc(targetUser.getId());
		List<UUID> eventIds = events.stream().map(EventJpaEntity::getId).toList();
		if (!eventIds.isEmpty()) {
			var photos = photoRepository.findAllByEventIdIn(eventIds);
			for (var photo : photos) {
				deleteObjectQuietly(photo.getObjectKey());
			}
			photoRepository.deleteAllByEventIdIn(eventIds);

			var customizations = eventCustomizationRepository.findAllByEventIdIn(eventIds);
			for (var customization : customizations) {
				deleteObjectQuietly(customization.getCoverImageKey());
				for (String key : EventPublicPageCustomizationSupport.readHighlightKeys(customization.getHighlightImageKeys())) {
					deleteObjectQuietly(key);
				}
			}
			eventCustomizationRepository.deleteAll(customizations);

			for (EventJpaEntity event : events) {
				event.setStatus(EventStatus.PAUSED);
				event.setUpdatedAt(now);
			}
			eventRepository.saveAll(events);
		}

		targetUser.setStatus(UserStatus.DELETED);
		targetUser.setDeletedAt(now);
		targetUser.setUpdatedAt(now);
		targetUser.setName("Usuario removido");
		targetUser.setEmail("deleted-" + targetUser.getId() + "@deleted.memora.local");
		userRepository.save(targetUser);

		logAudit(
			admin,
			"DELETE_USER",
			"USER",
			userId,
			confirmationEmail,
			reason,
			Map.of("eventsAffected", eventIds.size()),
			ipAddress,
			userAgent
		);
		return new AdminActionResponseDto("Conta excluida com sucesso.");
	}

	@Transactional
	public AdminActionResponseDto suspendUser(UUID userId, String reason, AuthenticatedUserPrincipal admin, String ipAddress, String userAgent) {
		UserEntity targetUser = validateAdminActionTarget(userId, admin, reason);
		if (targetUser.getStatus() == UserStatus.DELETED) {
			throw new IllegalArgumentException("Nao e possivel suspender uma conta excluida.");
		}

		targetUser.setStatus(UserStatus.SUSPENDED);
		targetUser.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		userRepository.save(targetUser);
		logAudit(admin, "SUSPEND_USER", "USER", userId, targetUser.getEmail(), reason, Map.of(), ipAddress, userAgent);
		return new AdminActionResponseDto("Conta suspensa com sucesso.");
	}

	@Transactional
	public AdminActionResponseDto restoreUser(UUID userId, String reason, AuthenticatedUserPrincipal admin, String ipAddress, String userAgent) {
		UserEntity targetUser = validateAdminActionTarget(userId, admin, reason);
		if (targetUser.getStatus() == UserStatus.DELETED) {
			throw new IllegalArgumentException("Nao e possivel restaurar uma conta excluida.");
		}

		targetUser.setStatus(UserStatus.ACTIVE);
		targetUser.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		userRepository.save(targetUser);
		logAudit(admin, "RESTORE_USER", "USER", userId, targetUser.getEmail(), reason, Map.of(), ipAddress, userAgent);
		return new AdminActionResponseDto("Conta restaurada com sucesso.");
	}

	public PageResponseDto<AdminAuditLogListItemDto> listAuditLogs(
		int page,
		int size,
		UUID adminUserId,
		String action,
		String targetType,
		UUID targetId,
		LocalDate dateFrom,
		LocalDate dateTo
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);
		String where = buildAuditFilters(adminUserId, action, targetType, targetId, dateFrom, dateTo, params);
		long total = jdbcTemplate.queryForObject("""
			select count(*)
			from admin_audit_logs l
			left join users u on u.id = l.admin_user_id
			where 1=1
			""" + where, params, Long.class);

		List<AdminAuditLogListItemDto> content = jdbcTemplate.query("""
			select
				l.id,
				l.created_at,
				l.admin_user_id,
				u.email as admin_email,
				l.action,
				l.target_type,
				l.target_id,
				l.target_email,
				l.reason,
				l.ip_address
			from admin_audit_logs l
			left join users u on u.id = l.admin_user_id
			where 1=1
			""" + where + """
			order by l.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminAuditLogListItemDto(
			rs.getObject("id", UUID.class),
			asLocalDateTime(rs.getObject("created_at")),
			rs.getObject("admin_user_id", UUID.class),
			rs.getString("admin_email"),
			rs.getString("action"),
			rs.getString("target_type"),
			rs.getObject("target_id", UUID.class),
			rs.getString("target_email"),
			rs.getString("reason"),
			rs.getString("ip_address")
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	public boolean isUserActive(UUID userId) {
		return userRepository.findById(userId)
			.map(user -> user.getStatus() == UserStatus.ACTIVE)
			.orElse(false);
	}

	private UserEntity validateAdminActionTarget(UUID userId, AuthenticatedUserPrincipal admin, String reason) {
		findAdminUser(admin.userId());
		if (reason == null || reason.isBlank()) {
			throw new IllegalArgumentException("Informe o motivo da acao.");
		}

		UserEntity targetUser = userRepository.findById(userId)
			.orElseThrow(() -> new NoSuchElementException("Usuario nao encontrado."));
		if (admin.userId().equals(targetUser.getId())) {
			throw new IllegalArgumentException("Voce nao pode excluir sua propria conta.");
		}
		if (targetUser.getRole() == UserRole.ADMIN) {
			throw new IllegalArgumentException("Nao e permitido alterar outra conta ADMIN.");
		}
		return targetUser;
	}

	private UserEntity findAdminUser(UUID adminUserId) {
		UserEntity adminUser = userRepository.findById(adminUserId)
			.orElseThrow(() -> new SecurityException("Acesso negado."));
		if (adminUser.getRole() != UserRole.ADMIN || adminUser.getStatus() != UserStatus.ACTIVE) {
			throw new SecurityException("Acesso negado.");
		}
		return adminUser;
	}

	private void logAudit(
		AuthenticatedUserPrincipal admin,
		String action,
		String targetType,
		UUID targetId,
		String targetEmail,
		String reason,
		Map<String, Object> metadata,
		String ipAddress,
		String userAgent
	) {
		String metadataJson = null;
		if (metadata != null && !metadata.isEmpty()) {
			try {
				metadataJson = objectMapper.writeValueAsString(metadata);
			} catch (JsonProcessingException exception) {
				metadataJson = "{\"serialization\":\"failed\"}";
			}
		}

		adminAuditLogRepository.save(AdminAuditLogEntity.builder()
			.id(UUID.randomUUID())
			.adminUserId(admin.userId())
			.action(action)
			.targetType(targetType)
			.targetId(targetId)
			.targetEmail(targetEmail)
			.reason(reason)
			.metadata(metadataJson)
			.ipAddress(ipAddress)
			.userAgent(userAgent)
			.createdAt(LocalDateTime.now(ZoneOffset.UTC))
			.build());
	}

	private void deleteObjectQuietly(String objectKey) {
		if (objectKey == null || objectKey.isBlank()) {
			return;
		}
		try {
			fileStorageService.delete(objectKey);
		} catch (Exception ignored) {
		}
	}

	private <T> PageResponseDto<T> toPage(List<T> content, int page, int size, long total) {
		int totalPages = total == 0 ? 1 : (int) Math.ceil((double) total / size);
		return new PageResponseDto<>(content, page, size, total, totalPages, page >= totalPages - 1);
	}

	private String buildUserFilters(String search, String status, String role, LocalDate createdFrom, LocalDate createdTo, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (search != null && !search.isBlank()) {
			where.append(" and (lower(u.name) like :search or lower(u.email) like :search)");
			params.addValue("search", "%" + search.trim().toLowerCase() + "%");
		}
		if (status != null && !status.isBlank()) {
			where.append(" and u.status = :status");
			params.addValue("status", status.trim().toUpperCase());
		}
		if (role != null && !role.isBlank()) {
			where.append(" and u.role = :role");
			params.addValue("role", role.trim().toUpperCase());
		}
		if (createdFrom != null) {
			where.append(" and u.created_at >= :createdFrom");
			params.addValue("createdFrom", createdFrom.atStartOfDay());
		}
		if (createdTo != null) {
			where.append(" and u.created_at < :createdTo");
			params.addValue("createdTo", createdTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private String buildPaymentFilters(String status, String planCode, String provider, LocalDate dateFrom, LocalDate dateTo, String userEmail, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (status != null && !status.isBlank()) {
			where.append(" and po.status = :status");
			params.addValue("status", status.trim().toUpperCase());
		}
		if (planCode != null && !planCode.isBlank()) {
			where.append(" and po.plan_code = :planCode");
			params.addValue("planCode", planCode.trim().toUpperCase());
		}
		if (provider != null && !provider.isBlank()) {
			where.append(" and po.provider = :provider");
			params.addValue("provider", provider.trim().toUpperCase());
		}
		if (userEmail != null && !userEmail.isBlank()) {
			where.append(" and lower(u.email) like :userEmail");
			params.addValue("userEmail", "%" + userEmail.trim().toLowerCase() + "%");
		}
		if (dateFrom != null) {
			where.append(" and po.created_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and po.created_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private String buildEventFilters(String status, String planCode, String ownerEmail, LocalDate dateFrom, LocalDate dateTo, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (status != null && !status.isBlank()) {
			where.append(" and e.status = :status");
			params.addValue("status", status.trim().toUpperCase());
		}
		if (planCode != null && !planCode.isBlank()) {
			where.append(" and e.plan_code = :planCode");
			params.addValue("planCode", planCode.trim().toUpperCase());
		}
		if (ownerEmail != null && !ownerEmail.isBlank()) {
			where.append(" and lower(u.email) like :ownerEmail");
			params.addValue("ownerEmail", "%" + ownerEmail.trim().toLowerCase() + "%");
		}
		if (dateFrom != null) {
			where.append(" and e.created_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and e.created_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private String buildAuditFilters(UUID adminUserId, String action, String targetType, UUID targetId, LocalDate dateFrom, LocalDate dateTo, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (adminUserId != null) {
			where.append(" and l.admin_user_id = :adminUserId");
			params.addValue("adminUserId", adminUserId);
		}
		if (action != null && !action.isBlank()) {
			where.append(" and l.action = :action");
			params.addValue("action", action.trim().toUpperCase());
		}
		if (targetType != null && !targetType.isBlank()) {
			where.append(" and l.target_type = :targetType");
			params.addValue("targetType", targetType.trim().toUpperCase());
		}
		if (targetId != null) {
			where.append(" and l.target_id = :targetId");
			params.addValue("targetId", targetId);
		}
		if (dateFrom != null) {
			where.append(" and l.created_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and l.created_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private long asLong(Object value) {
		return value == null ? 0L : ((Number) value).longValue();
	}

	private Integer asInteger(Object value) {
		return value == null ? null : ((Number) value).intValue();
	}

	private LocalDateTime asLocalDateTime(Object value) {
		if (value == null) {
			return null;
		}
		if (value instanceof LocalDateTime localDateTime) {
			return localDateTime;
		}
		if (value instanceof Timestamp timestamp) {
			return timestamp.toLocalDateTime();
		}
		return null;
	}
}
