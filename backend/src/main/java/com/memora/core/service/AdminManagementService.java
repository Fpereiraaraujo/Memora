package com.memora.core.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.CouponStatus;
import com.memora.core.domain.model.InfluencerStatus;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.dataprovider.database.entity.AdminAuditLogEntity;
import com.memora.dataprovider.database.entity.CouponJpaEntity;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.InfluencerJpaEntity;
import com.memora.dataprovider.database.entity.UserEntity;
import com.memora.dataprovider.database.gateway.AdminQueryGateway;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PlanDatabaseMapper;
import com.memora.dataprovider.database.repository.AdminAuditLogRepository;
import com.memora.dataprovider.database.repository.CouponRepository;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import com.memora.dataprovider.database.repository.InfluencerRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.ReferralCommissionRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import com.memora.entrypoint.api.dto.AdminActionResponseDto;
import com.memora.entrypoint.api.dto.AdminAuditLogListItemDto;
import com.memora.entrypoint.api.dto.AdminAffiliateSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminCouponListItemDto;
import com.memora.entrypoint.api.dto.AdminCouponUpsertRequestDto;
import com.memora.entrypoint.api.dto.AdminDashboardResponseDto;
import com.memora.entrypoint.api.dto.AdminEventListItemDto;
import com.memora.entrypoint.api.dto.AdminPaymentListItemDto;
import com.memora.entrypoint.api.dto.AdminRevenueSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminInfluencerListItemDto;
import com.memora.entrypoint.api.dto.AdminInfluencerUpsertRequestDto;
import com.memora.entrypoint.api.dto.AdminUserDetailsResponseDto;
import com.memora.entrypoint.api.dto.AdminUserEventDto;
import com.memora.entrypoint.api.dto.AdminUserListItemDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class AdminManagementService {

	private final AdminQueryGateway adminQueryGateway;
	private final UserRepository userRepository;
	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final EventCustomizationRepository eventCustomizationRepository;
	private final PlanRepository planRepository;
	private final InfluencerRepository influencerRepository;
	private final CouponRepository couponRepository;
	private final PaymentOrderRepository paymentOrderRepository;
	private final ReferralCommissionRepository referralCommissionRepository;
	private final AdminAuditLogRepository adminAuditLogRepository;
	private final FileStorageService fileStorageService;
	private final ObjectMapper objectMapper;
	private final EventPlanService eventPlanService;

	public AdminManagementService(
		AdminQueryGateway adminQueryGateway,
		UserRepository userRepository,
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		EventCustomizationRepository eventCustomizationRepository,
		PlanRepository planRepository,
		InfluencerRepository influencerRepository,
		CouponRepository couponRepository,
		PaymentOrderRepository paymentOrderRepository,
		ReferralCommissionRepository referralCommissionRepository,
		AdminAuditLogRepository adminAuditLogRepository,
		FileStorageService fileStorageService,
		ObjectMapper objectMapper,
		EventPlanService eventPlanService
	) {
		this.adminQueryGateway = adminQueryGateway;
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.planRepository = planRepository;
		this.influencerRepository = influencerRepository;
		this.couponRepository = couponRepository;
		this.paymentOrderRepository = paymentOrderRepository;
		this.referralCommissionRepository = referralCommissionRepository;
		this.adminAuditLogRepository = adminAuditLogRepository;
		this.fileStorageService = fileStorageService;
		this.objectMapper = objectMapper;
		this.eventPlanService = eventPlanService;
	}

	public AdminDashboardResponseDto getDashboard() {
		return adminQueryGateway.getDashboard();
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
		return adminQueryGateway.listUsers(page, size, search, status, role, createdFrom, createdTo);
	}

	public AdminUserDetailsResponseDto getUserDetails(UUID userId, AuthenticatedUserPrincipal admin, String ipAddress, String userAgent) {
		UserEntity user = userRepository.findById(userId)
			.orElseThrow(() -> new NoSuchElementException("Usuário não encontrado."));

		List<AdminUserEventDto> events = adminQueryGateway.listUserEvents(userId);
		List<AdminPaymentListItemDto> payments = adminQueryGateway.listUserPayments(userId);
		Map<String, Object> summary = adminQueryGateway.getUserSummary(userId);

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
		return adminQueryGateway.listPayments(page, size, status, planCode, provider, dateFrom, dateTo, userEmail);
	}

	public AdminRevenueSummaryResponseDto getRevenueSummary() {
		return adminQueryGateway.getRevenueSummary();
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
		return adminQueryGateway.listEvents(page, size, status, planCode, ownerEmail, dateFrom, dateTo);
	}

	@Transactional
	@CacheEvict(cacheNames = { "currentUsers", "publicEvents" }, allEntries = true)
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
			.orElseThrow(() -> new NoSuchElementException("Usuário não encontrado."));

		if (adminUser.getId().equals(targetUser.getId())) {
			throw new IllegalArgumentException("Você não pode excluir sua própria conta.");
		}
		if (targetUser.getRole() == UserRole.ADMIN) {
			throw new IllegalArgumentException("Não é permitido excluir outra conta ADMIN.");
		}
		if (!targetUser.getEmail().equals(confirmationEmail)) {
			throw new IllegalArgumentException("Digite o email correto para confirmar a exclusão.");
		}
		if (reason == null || reason.isBlank()) {
			throw new IllegalArgumentException("Informe o motivo da ação.");
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		long approvedPaymentsPreserved = adminQueryGateway.countApprovedPaymentsByUserId(userId);
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
				for (String key : readHighlightKeys(customization.getHighlightImageKeys())) {
					deleteObjectQuietly(key);
				}
			}
			eventCustomizationRepository.deleteAll(customizations);

			for (EventJpaEntity event : events) {
				event.setStatus(EventStatus.PAUSED);
				event.setTitle("Evento removido");
				event.setSlug("deleted-event-" + event.getId());
				event.setLocation(null);
				event.setEventDate(null);
				event.setUpdatedAt(now);
			}
			eventRepository.saveAll(events);
		}

		targetUser.setStatus(UserStatus.DELETED);
		targetUser.setDeletedAt(now);
		targetUser.setUpdatedAt(now);
		targetUser.setName("Usuário removido");
		targetUser.setEmail("deleted-" + targetUser.getId() + "@deleted.memora.local");
		userRepository.save(targetUser);

		logAudit(
			admin,
			"DELETE_USER",
			"USER",
			userId,
			confirmationEmail,
			reason,
			Map.of(
				"eventsAffected", eventIds.size(),
				"approvedPaymentsPreserved", approvedPaymentsPreserved,
				"financialRecordsPolicy", "PRESERVED_AND_ANONYMIZED"
			),
			ipAddress,
			userAgent
		);
		return new AdminActionResponseDto("Conta excluída com sucesso. Pagamentos aprovados foram preservados para auditoria financeira.");
	}

	@Transactional
	@CacheEvict(cacheNames = { "currentUsers", "publicEvents" }, allEntries = true)
	public AdminActionResponseDto suspendUser(UUID userId, String reason, AuthenticatedUserPrincipal admin, String ipAddress, String userAgent) {
		UserEntity targetUser = validateAdminActionTarget(userId, admin, reason);
		if (targetUser.getStatus() == UserStatus.DELETED) {
			throw new IllegalArgumentException("Não é possível suspender uma conta excluída.");
		}

		targetUser.setStatus(UserStatus.SUSPENDED);
		targetUser.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		userRepository.save(targetUser);
		logAudit(admin, "SUSPEND_USER", "USER", userId, targetUser.getEmail(), reason, Map.of(), ipAddress, userAgent);
		return new AdminActionResponseDto("Conta suspensa com sucesso.");
	}

	@Transactional
	@CacheEvict(cacheNames = { "currentUsers", "publicEvents" }, allEntries = true)
	public AdminActionResponseDto restoreUser(UUID userId, String reason, AuthenticatedUserPrincipal admin, String ipAddress, String userAgent) {
		UserEntity targetUser = validateAdminActionTarget(userId, admin, reason);
		if (targetUser.getStatus() == UserStatus.DELETED) {
			throw new IllegalArgumentException("Não é possível restaurar uma conta excluída.");
		}

		targetUser.setStatus(UserStatus.ACTIVE);
		targetUser.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		userRepository.save(targetUser);
		logAudit(admin, "RESTORE_USER", "USER", userId, targetUser.getEmail(), reason, Map.of(), ipAddress, userAgent);
		return new AdminActionResponseDto("Conta restaurada com sucesso.");
	}

	@Transactional
	@CacheEvict(cacheNames = "publicEvents", allEntries = true)
	public AdminActionResponseDto grantPlan(
		UUID userId,
		UUID eventId,
		EventPlanCode planCode,
		String reason,
		AuthenticatedUserPrincipal admin,
		String ipAddress,
		String userAgent
	) {
		UserEntity targetUser = validateAdminActionTarget(userId, admin, reason);
		if (targetUser.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("A conta precisa estar ativa para receber um plano.");
		}

		EventJpaEntity event = eventRepository.findByIdAndOwnerId(eventId, userId)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado para este cliente."));
		var plan = planRepository.findByCodeAndActiveTrue(planCode)
			.map(PlanDatabaseMapper::toDomain)
			.orElseThrow(() -> new IllegalArgumentException("Plano inválido ou indisponível."));

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		var activatedEvent = eventPlanService.applyPlanToEvent(EventDatabaseMapper.toDomain(event), plan, now);
		eventRepository.save(EventDatabaseMapper.toEntity(activatedEvent));

		logAudit(
			admin,
			"GRANT_EVENT_PLAN",
			"EVENT",
			eventId,
			targetUser.getEmail(),
			reason,
			Map.of("userId", userId, "eventId", eventId, "planCode", planCode.name(), "grantType", "ADMIN_MANUAL", "amountChargedCents", 0),
			ipAddress,
			userAgent
		);
		return new AdminActionResponseDto("Plano " + plan.getName() + " liberado para o evento com sucesso.");
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
		return adminQueryGateway.listAuditLogs(page, size, adminUserId, action, targetType, targetId, dateFrom, dateTo);
	}

	public AdminAffiliateSummaryResponseDto getAffiliateSummary() {
		return new AdminAffiliateSummaryResponseDto(
			influencerRepository.countByStatus(InfluencerStatus.ACTIVE),
			couponRepository.countByStatus(CouponStatus.ACTIVE),
			paymentOrderRepository.countByStatusAndCouponIdIsNotNull(com.memora.core.domain.model.PaymentOrderStatus.APPROVED),
			referralCommissionRepository.sumPendingCommissionCents()
		);
	}

	public List<AdminInfluencerListItemDto> listInfluencers() {
		return influencerRepository.findAllByOrderByCreatedAtDesc()
			.stream()
			.map(this::toInfluencerListItem)
			.toList();
	}

	@Transactional
	public AdminInfluencerListItemDto createInfluencer(
		AdminInfluencerUpsertRequestDto request,
		AuthenticatedUserPrincipal admin,
		String ipAddress,
		String userAgent
	) {
		findAdminUser(admin.userId());
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		InfluencerJpaEntity influencer = influencerRepository.save(InfluencerJpaEntity.builder()
			.id(UUID.randomUUID())
			.name(request.name().trim())
			.instagramHandle(normalizeNullable(request.instagramHandle()))
			.email(normalizeNullable(request.email()))
			.pixKey(normalizeNullable(request.pixKey()))
			.status(request.status())
			.createdAt(now)
			.updatedAt(now)
			.build());
		logAudit(admin, "CREATE_INFLUENCER", "INFLUENCER", influencer.getId(), influencer.getEmail(), null, Map.of("name", influencer.getName()), ipAddress, userAgent);
		return toInfluencerListItem(influencer);
	}

	@Transactional
	public AdminInfluencerListItemDto updateInfluencer(
		UUID influencerId,
		AdminInfluencerUpsertRequestDto request,
		AuthenticatedUserPrincipal admin,
		String ipAddress,
		String userAgent
	) {
		findAdminUser(admin.userId());
		InfluencerJpaEntity influencer = influencerRepository.findById(influencerId)
			.orElseThrow(() -> new NoSuchElementException("Influencer nao encontrada."));
		influencer.setName(request.name().trim());
		influencer.setInstagramHandle(normalizeNullable(request.instagramHandle()));
		influencer.setEmail(normalizeNullable(request.email()));
		influencer.setPixKey(normalizeNullable(request.pixKey()));
		influencer.setStatus(request.status());
		influencer.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		InfluencerJpaEntity saved = influencerRepository.save(influencer);
		logAudit(admin, "UPDATE_INFLUENCER", "INFLUENCER", saved.getId(), saved.getEmail(), null, Map.of("name", saved.getName()), ipAddress, userAgent);
		return toInfluencerListItem(saved);
	}

	public List<AdminCouponListItemDto> listCoupons() {
		Map<UUID, String> influencerNames = influencerRepository.findAllByOrderByCreatedAtDesc()
			.stream()
			.collect(java.util.stream.Collectors.toMap(InfluencerJpaEntity::getId, InfluencerJpaEntity::getName));
		return couponRepository.findAllByOrderByCreatedAtDesc()
			.stream()
			.map(coupon -> toCouponListItem(coupon, influencerNames.get(coupon.getInfluencerId())))
			.toList();
	}

	@Transactional
	public AdminCouponListItemDto createCoupon(
		AdminCouponUpsertRequestDto request,
		AuthenticatedUserPrincipal admin,
		String ipAddress,
		String userAgent
	) {
		findAdminUser(admin.userId());
		validateCouponRequest(request, null);
		UUID influencerId = validateInfluencerReference(request.influencerId());
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		String normalizedCode = request.code().trim().toUpperCase();
		CouponJpaEntity coupon = couponRepository.save(CouponJpaEntity.builder()
			.id(UUID.randomUUID())
			.code(normalizedCode)
			.influencerId(influencerId)
			.discountPercent(request.discountPercent())
			.commissionPercent(request.commissionPercent())
			.status(request.status())
			.startsAt(request.startsAt())
			.expiresAt(request.expiresAt())
			.maxUses(request.maxUses())
			.currentUses(0)
			.createdAt(now)
			.updatedAt(now)
			.build());
		logAudit(admin, "CREATE_COUPON", "COUPON", coupon.getId(), coupon.getCode(), null, Map.of("code", coupon.getCode()), ipAddress, userAgent);
		return toCouponListItem(coupon, influencerName(influencerId));
	}

	@Transactional
	public AdminCouponListItemDto updateCoupon(
		UUID couponId,
		AdminCouponUpsertRequestDto request,
		AuthenticatedUserPrincipal admin,
		String ipAddress,
		String userAgent
	) {
		findAdminUser(admin.userId());
		CouponJpaEntity coupon = couponRepository.findById(couponId)
			.orElseThrow(() -> new NoSuchElementException("Cupom nao encontrado."));
		validateCouponRequest(request, couponId);
		UUID influencerId = validateInfluencerReference(request.influencerId());
		coupon.setCode(request.code().trim().toUpperCase());
		coupon.setInfluencerId(influencerId);
		coupon.setDiscountPercent(request.discountPercent());
		coupon.setCommissionPercent(request.commissionPercent());
		coupon.setStatus(request.status());
		coupon.setStartsAt(request.startsAt());
		coupon.setExpiresAt(request.expiresAt());
		coupon.setMaxUses(request.maxUses());
		coupon.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		CouponJpaEntity saved = couponRepository.save(coupon);
		logAudit(admin, "UPDATE_COUPON", "COUPON", saved.getId(), saved.getCode(), null, Map.of("code", saved.getCode()), ipAddress, userAgent);
		return toCouponListItem(saved, influencerName(influencerId));
	}

	@Transactional
	public AdminCouponListItemDto updateCouponStatus(
		UUID couponId,
		CouponStatus status,
		AuthenticatedUserPrincipal admin,
		String ipAddress,
		String userAgent
	) {
		findAdminUser(admin.userId());
		CouponJpaEntity coupon = couponRepository.findById(couponId)
			.orElseThrow(() -> new NoSuchElementException("Cupom nao encontrado."));
		coupon.setStatus(status);
		coupon.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		CouponJpaEntity saved = couponRepository.save(coupon);
		logAudit(admin, "UPDATE_COUPON_STATUS", "COUPON", saved.getId(), saved.getCode(), null, Map.of("status", status.name()), ipAddress, userAgent);
		return toCouponListItem(saved, influencerName(saved.getInfluencerId()));
	}

	public boolean isUserActive(UUID userId) {
		return userRepository.findById(userId)
			.map(user -> user.getStatus() == UserStatus.ACTIVE)
			.orElse(false);
	}

	private UserEntity validateAdminActionTarget(UUID userId, AuthenticatedUserPrincipal admin, String reason) {
		findAdminUser(admin.userId());
		if (reason == null || reason.isBlank()) {
			throw new IllegalArgumentException("Informe o motivo da ação.");
		}

		UserEntity targetUser = userRepository.findById(userId)
			.orElseThrow(() -> new NoSuchElementException("Usuário não encontrado."));
		if (admin.userId().equals(targetUser.getId())) {
			throw new IllegalArgumentException("Você não pode excluir sua própria conta.");
		}
		if (targetUser.getRole() == UserRole.ADMIN) {
			throw new IllegalArgumentException("Não é permitido alterar outra conta ADMIN.");
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

	private List<String> readHighlightKeys(String value) {
		if (value == null || value.isBlank()) {
			return List.of();
		}

		return value.lines()
			.map(String::trim)
			.filter(item -> !item.isBlank())
			.toList();
	}

	private long asLong(Object value) {
		return value == null ? 0L : ((Number) value).longValue();
	}

	private void validateCouponRequest(AdminCouponUpsertRequestDto request, UUID currentCouponId) {
		if (request.expiresAt() != null && request.startsAt() != null && request.expiresAt().isBefore(request.startsAt())) {
			throw new IllegalArgumentException("A data de expiração deve ser posterior à data de início.");
		}
		String normalizedCode = request.code().trim().toUpperCase();
		boolean duplicated = currentCouponId == null
			? couponRepository.findByCode(normalizedCode).isPresent()
			: couponRepository.existsByCodeAndIdNot(normalizedCode, currentCouponId);
		if (duplicated) {
			throw new IllegalArgumentException("Já existe um cupom com este código.");
		}
	}

	private UUID validateInfluencerReference(UUID influencerId) {
		if (influencerId == null) {
			return null;
		}
		if (!influencerRepository.existsById(influencerId)) {
			throw new IllegalArgumentException("Influencer selecionada não existe.");
		}
		return influencerId;
	}

	private String influencerName(UUID influencerId) {
		if (influencerId == null) {
			return null;
		}
		return influencerRepository.findById(influencerId)
			.map(InfluencerJpaEntity::getName)
			.orElse(null);
	}

	private AdminInfluencerListItemDto toInfluencerListItem(InfluencerJpaEntity influencer) {
		return new AdminInfluencerListItemDto(
			influencer.getId(),
			influencer.getName(),
			influencer.getInstagramHandle(),
			influencer.getEmail(),
			influencer.getPixKey(),
			influencer.getStatus(),
			couponRepository.countByInfluencerId(influencer.getId()),
			influencer.getCreatedAt(),
			influencer.getUpdatedAt()
		);
	}

	private AdminCouponListItemDto toCouponListItem(CouponJpaEntity coupon, String influencerName) {
		return new AdminCouponListItemDto(
			coupon.getId(),
			coupon.getCode(),
			coupon.getInfluencerId(),
			influencerName,
			coupon.getDiscountPercent(),
			coupon.getCommissionPercent(),
			coupon.getStatus(),
			coupon.getStartsAt(),
			coupon.getExpiresAt(),
			coupon.getMaxUses(),
			coupon.getCurrentUses(),
			coupon.getCreatedAt(),
			coupon.getUpdatedAt()
		);
	}

	private String normalizeNullable(String value) {
		if (value == null) {
			return null;
		}
		String normalizedValue = value.trim();
		return normalizedValue.isBlank() ? null : normalizedValue;
	}
}
