package com.memora.core.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.dataprovider.database.entity.AdminAuditLogEntity;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.UserEntity;
import com.memora.dataprovider.database.gateway.AdminQueryGateway;
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
import com.memora.entrypoint.api.dto.AdminRevenueSummaryResponseDto;
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
	private final AdminAuditLogRepository adminAuditLogRepository;
	private final FileStorageService fileStorageService;
	private final ObjectMapper objectMapper;

	public AdminManagementService(
		AdminQueryGateway adminQueryGateway,
		UserRepository userRepository,
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		EventCustomizationRepository eventCustomizationRepository,
		AdminAuditLogRepository adminAuditLogRepository,
		FileStorageService fileStorageService,
		ObjectMapper objectMapper
	) {
		this.adminQueryGateway = adminQueryGateway;
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.eventCustomizationRepository = eventCustomizationRepository;
		this.adminAuditLogRepository = adminAuditLogRepository;
		this.fileStorageService = fileStorageService;
		this.objectMapper = objectMapper;
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
}
